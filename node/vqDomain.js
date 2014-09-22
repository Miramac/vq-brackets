/*jshint laxcomma: true, browser: true, jquery: true, node: true*/
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50, node: true */
/*global brackets */

(function () {
    
    "use strict";
    
    var _domainManager = null
		, fs = require('fs')
	//	, vqExc = require('./vq.exec')
    ;
    /**
     * 
     */
    function cmdVq(path, command, callback) {
        var exec    = require('child_process').exec
            , cmd     = "node "
            , child
            , pId = (Math.random() * 1000000)
            , tmpFile = __dirname + "\\tmp\\vq.command." + pId + ".tmp"
            ;

        if (command) {
            fs.writeFileSync(tmpFile, command);
            cmd += __dirname + "\\lib\\vq.exec.js -v " + tmpFile;
			child = exec(cmd, function (error, stdout, stderr) {
				fs.unlink(tmpFile, function() {
					callback(error, "Done");
				});
				
			});
			
			child.stdout.on("data", function (data) {
				_domainManager.emitEvent("vq", "update", data);
			});
			child.stderr.on("data", function (data) {
				_domainManager.emitEvent("vq", "error", data);
			});
			
        }
        
        if (path) {
          //process.chdir(path);
        }
        
        /*
        child = exec(cmd, function (error, stdout, stderr) {
          // fs.unlinkSync(tmpFile, callback)

          callback(error, "Done!");
        });
        
        child.stdout.on("data", function (data) {
          _domainManager.emitEvent("vq", "update", data);
        });
		*/
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