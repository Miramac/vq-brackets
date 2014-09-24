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




/**
* Dependencies
*/
//var _ = require('lodash');
/**
* Expose `json-to-htmltable`
*/
/*
var jsonToHtmlTable =  function(data, number) {
if (!data) {
throw new Error('No data given.');
}
// If data is interpreted as a string, attempt to parse it
if (typeof data == 'string' || data instanceof String) {
data = JSON.parse(data);
}
// if the data doesn't have a length then it is not an array
if (!data.length) {
data = [data];
}
// The initial table data
var table = '<table><thead>'
, keys = [];
for (var i = 0; i < data.length; i++) {
keys = _.union(keys, Object.keys(data[i]));
}
if (number) {
table += '<th>#</th>';
}
for (var index in keys) {
table += '<th>' + keys[index] + '</th>';
}
table += '</thead><tbody>';
for (var i = 0; i < data.length; i++) {
table += '<tr>';
if (number) {
table += '<td>' + (i + 1) + '</td>';
}
table += objectToTableRow(data[i], keys);
table += '</tr>';
}
return table + '</tbody></table>';
};
/**
* Convert a data object into a table row
*/
/*
var objectToTableRow = module.exports.objectToTableRow = function(object, keys) {
var row = '';
for (var index in keys) {
var data = object[keys[index]];
if (_.isObject(data) && !_.isArray(data)) {
data = jsonToHtmlTable(data, false);
}
row += '<td>' + data + '</td>';
}
return row;
};
*/