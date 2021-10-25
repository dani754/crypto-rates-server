const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());

const PORT = process.env.PORT || 3001;
const getRates = require('./functions/getRates.js');
const ratesUpdates = require('./functions/ratesUpdate.js');

const updateInterval = 5; //update quotes from API every X minutes

//send latest rates of all coins to client
app.get('/', (req,res) => {
    getRates.getCurrent(req,res);
});

//send rates history to client
app.get('/:coin/:start/:end', (req, res) => {
    getRates.getHistory(req,res);
});

//send quotes from API to DB every X minutes
function updateRatesDB() {
    ratesUpdates.getLatestRates();
}  
setInterval(updateRatesDB,updateInterval*60*1000);  // X min * 60seconds * 1000ms Interval

//delete old quotes from DB every week
const weekly = 1000*60*60*24*7;  //week interval in milliseconds
function cleanRatesDB() {
    ratesUpdates.deleteOldRates();
}  
setInterval(cleanRatesDB,weekly);

app.listen(PORT, () => {
    console.log("listening on port", PORT);
});