sql.query(function() {/*
    SELECT top 10 * FROM Job
*/}, function(err, data) {
    if(err) throw err;
    fs.writeFile(__dirname + '/data.txt', JSON.stringify(data));
})