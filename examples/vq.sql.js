sql.query(function() {/*
    SELECT top 10 * FROM Job
*/}, function(err, data) {
    if(err) throw err;
   console.log(JSON.stringify(data));
})

console.log("Log mich");