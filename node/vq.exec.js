/*jshint laxcomma: true, browser: true, jquery: true, node: true*/
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50, node: true */
/*global brackets */
    var  vq = require('vq')
        , conf = require('vq-mab/config/conf')
        , sql = new vq.Sql(conf.db)
        , MAB = require('vq-mab/lib/mab')
        , fs = require('fs')
    ;


try{
  console.log(MAB.options.project);
  //fs.readFile(
} catch(e) {
  
}