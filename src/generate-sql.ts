const mysql = require('mysql');
const fs = require('fs');
const path = require('path');
// const connection = mysql.createConnection({
//     host: '127.0.0.1',
//     user: 'root',
//     password: 'Abc12345',
//     database: 'honey'
// });


const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'Abc12345'
});



const sqlText = fs.readFileSync(path.join(__dirname, '../create.sql')).toString();

connection.query(sqlText, function (error, results, fields) {
    if (error) throw error;
    console.log('The solution is: ', results[0].solution);
});

