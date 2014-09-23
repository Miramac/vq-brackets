/*jshint laxcomma: true, browser: true, jquery: true, node: true*/
/*jslint vars: true, plusplus: true, devel: true, nomen: true, maxerr: 50, node: true */
/*global brackets */

(function () {
    
    "use strict";
    
    var _domainManager = null
		, fs = require('fs') 
        ;
    /**
     * 
     */
    function cmdVq(path, command, callback) {
        var spawn = require('child_process').spawn
        , child
        , pId = (Math.random() * 1000000)
        , tmpFile = __dirname + '/./tmp/vq.command.' + pId + '.tmp'
        ;
        if (command) {
        
            fs.writeFile(tmpFile, command, function(err){
                if(err) throw err;
                child    = spawn("node" ,[__dirname + '/./lib/vq.exec', tmpFile]);
                
                //on stdout
                child.stdout.on("data", function (data) {
                    _domainManager.emitEvent("vq", "update", data.toString());
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
            cmdVq,
            true,
            "Runs a vocQuery3 command",
            ["path", "command"],
            [{name: "result",
                type: "string",
                description: "The result of the execution"}]
        );
        
        _domainManager.registerEvent(
            "vq",
            "update",
            [{name: "data", type: "string"}]
        );
        _domainManager.registerEvent(
            "vq",
            "error",
            [{name: "data", type: "string"}]
        );
    }

    exports.init = init;
    
}());