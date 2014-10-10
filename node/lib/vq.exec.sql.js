/*jshint laxcomma: true, browser: true, jquery: true, node: true*/
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50, node: true */
/*global brackets */
var fs = require('fs')
    , vq = require('vq')
    , conf = require('vq-mab/config/conf')
    , sql = new vq.Sql(conf.db)
    , _tmpFile;

	
if (_tmpFile = exists(process.argv[2])) {
	try {
		var _tmpCode = fs.readFileSync(_tmpFile).toString();
		//log(code);
		sql.query(_tmpCode, function (err, data) {
            if (err) throw err;
            fs.writeFile(_tmpFile, JSON.stringify(data));
        });
	} catch (e) {
		console.error(e);
	}
}


function exists(path) {
	return (fs.existsSync(path) ? path : false);
}
