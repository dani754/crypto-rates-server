const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;
const https = require('https');

const mysql = require('mysql');
const pool = mysql.createPool({
    host: 'remotemysql.com',
    user: 'ydnrcxIpJA',
    password: '3ulj2sEuIi',
    database: 'ydnrcxIpJA',
    port: '3306',
});

const sqlLatest = 'SELECT * FROM rates WHERE date >= ALL (SELECT MAX(date) FROM rates);';

app.get('/',(req,res) => {
    pool.getConnection((err, connection) => {
        if (err) console.log(err);
        connection.query(sqlLatest, (err, result) => {
            connection.release(); 
            if(err) console.log(err);
            console.log('The data sent to the client is: \n', result);
            res.send("result");
        });
    });
});

const options = {
    hostname: 'pro-api.coinmarketcap.com',
    path: '/v1/cryptocurrency/quotes/latest?symbol=BTC,ETH,LTC&convert=USD',
    port: 443,
    headers: {
        'X-CMC_PRO_API_KEY': '1089cde2-9abb-4f0e-9a03-e5c4dc5e85dd',
        'Content-Type': 'application/json'
    },
    json: true,
    gzip: true,
};

const req = https.get(options, (res) => {
    res.setEncoding("utf8");
    let body = "";
    res.on("data", data => {
        body += data;
    });
    res.on("end", () => {
        body = JSON.parse(body);
        console.log(body.data.BTC.quote);
    });
});


app.listen(PORT, () => {
    console.log("listening on port", PORT);
});