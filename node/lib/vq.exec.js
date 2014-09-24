/*jshint laxcomma: true, browser: true, jquery: true, node: true*/
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50, node: true */
/*global brackets */
var fs = require('fs')
	 , vq = require('vq')
	 , conf = require('vq-mab/config/conf')
	 , sql = new vq.Sql(conf.db)
	 , MAB = require('vq-mab/lib/mab')
     , updateSplitResult = require('vq-mab/lib/mab.splitresult')
	, _tmpFile;

	
if (_tmpFile = exists(process.argv[2])){
	try {
		var _tmpCode = fs.readFileSync(_tmpFile).toString();
		//log(code);
		eval(_tmpCode);
	} catch (e) {
		console.error(e);
	}
}


function exists(path) {
	return (fs.existsSync(path) ? path : false);
}