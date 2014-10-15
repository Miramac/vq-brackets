/*jshint laxcomma: true, browser: true, jquery: true, node: true*/
/*jslint vars: true, plusplus: true, devel: true, nomen: true, maxerr: 50, node: true */
/*global brackets */

(function () {
    
    "use strict";
    
    var _domainManager = null
		, fs = require('fs') 
        , path = require('path')
        ;
    /**
     * 
     */
    function execVq(cwd, command, callback) {
        var spawn = require('child_process').spawn
        , child
        , pId = (Math.random() * 1000000)
        , tmpFile = path.join(__dirname, 'tmp/vq.command.' + pId + '.tmp')
        ;
        if (command) {
        
            fs.writeFile(tmpFile, command, function(err){
                if(err) throw err;
                child    = spawn("node" ,[path.join(__dirname , 'lib/vq.exec'), tmpFile]);
                
                //on stdout
                child.stdout.on("data", function (data) {
                    _domainManager.emitEvent("vq", "log", data.toString());
                });
                //on stderr
                child.stderr.on("data", function (data) {
                    _domainManager.emitEvent("vq", "error", data.toString());
                });
                //on Exit
                child.on('exit', function (code) {
                    fs.unlink(tmpFile, function(err) {
                        callback(err, "Exit with code: " + code);
                    });
                });
            });
        }
    }
    function execSql(cwd, command, callback) {
        var spawn = require('child_process').spawn
        , child
        , pId = (Math.random() * 1000000)
        , tmpFile = path.join(__dirname, 'tmp/vq.command.' + pId + '.tmp')
        , hasNoErr = true
        ;
        if (command) {
        
            fs.writeFile(tmpFile, command, function(err){
                if(err) throw err;
                child    = spawn("node" ,[path.join(__dirname , 'lib/vq.exec.sql'), tmpFile]);
                
                //on stdout
                child.stdout.on("data", function (data) {
                    _domainManager.emitEvent("vq", "log", data.toString());
                });
                //on stderr
                child.stderr.on("data", function (data) {
                    _domainManager.emitEvent("vq", "error", data.toString());
                    hasNoErr = false;
                });
                //on Exit
                child.on('exit', function (code) {
                    fs.readFile(tmpFile, function(err, data) {
                        if(hasNoErr) {
                            _domainManager.emitEvent("vq", "sql", data.toString());
                        }
                        fs.unlink(tmpFile, function(err) {
                            callback(err, "Exit with code: " + code);
                        });
                    });
                });
            });
        }
    }
        
    /**
     *
    */
    function init(domainManager) {
        _domainManager = domainManager;
        
        if (!_domainManager.hasDomain("vq")) {
            _domainManager.registerDomain("vq", {major: 0, minor: 1});
        }
        
        _domainManager.registerCommand(
            "vq",
            "execVq",
            execVq,
            true,
            "Runs a vocQuery3 command",
            ["cwd", "command"],
            [{name: "result",
                type: "string",
                description: "The result of the execution"}]
        );
        _domainManager.registerCommand(
            "vq",
            "execSql",
            execSql,
            true,
            "Runs a SQL command",
            ["cwd", "command"],
            [{name: "result",
                type: "string",
                description: "The result of the execution"}]
        );
        
        _domainManager.registerEvent(
            "vq",
            "log",
            [{name: "data", type: "string"}]
        );
        _domainManager.registerEvent(
            "vq",
            "error",
            [{name: "data", type: "string"}]
        );
        _domainManager.registerEvent(
            "vq",
            "modal",
            [{name: "data", type: "string"}]
        );
        _domainManager.registerEvent(
            "vq",
            "sql",
            [{name: "data", type: "string"}]
        );

    }

    exports.init = init;
    
}());
