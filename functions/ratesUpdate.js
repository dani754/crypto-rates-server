const API = require('../API/coinMarketCap');
const DB = require('../API/database');
const https = require('https');

let tempQuotesKeeper = "";//holds data in getLatestRates scope

const quoteRequest = () => {
    https.get(API.latestsQuotesAPI, (res) => {
        res.setEncoding("utf8");//buffer parsing
        res.on("data", data => {
            tempQuotesKeeper += data;
        });
        res.on("end", () => {
            tempQuotesKeeper = JSON.parse(tempQuotesKeeper);//buffer parsing
            console.log("quoteRequest func", tempQuotesKeeper.data);
        });
    });    
}

const insertQuotesToDB = () => {
    console.log("start insertQuotesToDB func", tempQuotesKeeper.data);
    let BTC = tempQuotesKeeper.data.BTC.quote.USD.price;
    let ETH = tempQuotesKeeper.data.ETH.quote.USD.price;
    let LTC = tempQuotesKeeper.data.LTC.quote.USD.price;
    const sqlInsert = 'INSERT INTO rates (BTC,ETH,LTC) values ('+BTC+','+ETH+','+LTC+');';
    DB.pool.getConnection((err, connection) => {
        if (err) console.log(err);
        connection.query(sqlInsert, (err, result) => {
            connection.release(); 
            if(err) console.log(err);
            console.log('The data sent to the db is: \n', result);
            tempQuotesKeeper = "";
        });
    });
}

const getLatestRates = () => {
    quoteRequest();
    setTimeout(function(){insertQuotesToDB()}, 5000); //wait to quotes from API before sending to DB
}

const deleteOldRates = () => {
    console.log("delete old rates from db");
}

exports.getLatestRates = getLatestRates;
exports.deleteOldRates = deleteOldRates;