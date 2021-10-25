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

let coins = "";

const quoteRequest = () => {
    https.get(options, (res) => {
        res.setEncoding("utf8");
        res.on("data", data => {
            coins += data;
        });
        res.on("end", () => {
            coins = JSON.parse(coins);
            console.log("quoteRequest func", coins.data.BTC);
        });
    });    
}

const quoteToDB = () => {
    console.log("start quoteToDB func", coins.data);
    let BTCrate = coins.data.BTC.quote.USD.price;
    let ETHrate = coins.data.ETH.quote.USD.price;
    let LTCrate = coins.data.LTC.quote.USD.price;
    const sqlInsert = 'INSERT INTO rates (BTC,ETH,LTC) values ('+BTCrate+','+ETHrate+','+LTCrate+');';
    pool.getConnection((err, connection) => {
        if (err) console.log(err);
        connection.query(sqlInsert, (err, result) => {
            connection.release(); 
            if(err) console.log(err);
            console.log('The data sent to the db is: \n', result);
            coins = "";
        });
    });
}

const rateUpdate = () => {
    quoteRequest();
    setTimeout(function(){quoteToDB()}, 5000);
};

function rateUpdateInterval() {
    rateUpdate();
    console.log("updates db rates");
}  
setInterval(rateUpdateInterval,300000);  //300,000 ms = 300 seconds = 5 minutes

const getCurrentRates = () => {
    const sqlCurrent = 'SELECT * FROM rates WHERE date >= ALL (SELECT MAX(date) FROM rates);';
    pool.getConnection((err, connection) => {
        if (err) console.log(err);
        connection.query(sqlCurrent, (err, result) => {
            connection.release(); 
            if(err) console.log(err);
            console.log('The current rates are: \n', result);
        });
    });
}

const reqHistoryParams = {coin: 'BTC', start: 'current', end: ''}

const getHistoricRates = ({reqParams}) => {

}


app.listen(PORT, () => {
    console.log("listening on port", PORT);
});