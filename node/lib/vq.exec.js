/*jshint laxcomma: true, browser: true, jquery: true, node: true*/
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50, node: true */
/*global brackets */
var fs = require('fs')
	,  program = require('commander')
	// vq = require('vq')
	// , conf = require('vq-mab/config/conf')
	// , sql = new vq.Sql(conf.db)
	// , MAB = require('vq-mab/lib/mab')
	;
	
program
	.version('0.0.1')
	.option('-v, --vocqy <Path>', 'Execute a vocQuery command', exists)  
	
	.parse(process.argv)
	;
	
if (program.vocqy){
	try {
		var code = fs.readFileSync(program.vocqy).toString();
		//log(code);
		eval(code);
	} catch (e) {
		console.error(e.message);
	}
	
/*	fs.readFile(program.vocqy, function(err, data) {
		if(err) throw err;
		console.log(data.toString());
	} */
}


function exists(path) {
	return (fs.existsSync(path) ? path : false);
}