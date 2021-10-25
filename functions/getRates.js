const DB = require('../API/database');

const getCurrent = (req,res) => {
    const sqlLatest = 'SELECT * FROM rates WHERE date >= ALL (SELECT MAX(date) FROM rates);';
    DB.pool.getConnection((err, connection) => {
        if (err) console.log(err);
        connection.query(sqlLatest, (err, result) => {
            connection.release(); 
            if(err) console.log(err);
            let answer = JSON.parse(JSON.stringify(result[0]));
            console.log('The data sent to the client is: \n', answer);
            res.send(answer);
        });
    });
}

const dateFormatting = (ddmmyy) => {
    let coin = req.params.coin;
    let start = dateFormatting(req.params.start);
    let end =  dateFormatting(req.params.end);
    let day = Number(ddmmyy.substring(0,2));
    let month = Number(ddmmyy.substring(2,4));
    let year = Number(ddmmyy.substring(4)) + 2000;
    return new Date(year, month, day);
    console.log(coin, start, end);

}

const getHistory = (req,res) => {
    let filter = req.params;
    const sqlSelect = 'SELECT date, '+filter.coin+' FROM rates WHERE DATE(date) >= STR_TO_DATE('+filter.start+',"%d%m%y") AND DATE(date) <= STR_TO_DATE('+filter.end+',"%d%m%y");';
    console.log(sqlSelect);
    //start = earliest date, end = latest date
    DB.pool.getConnection((err, connection) => {
        if (err) console.log(err);
        connection.query(sqlSelect, (err, result) => {
            connection.release(); 
            if(err) console.log(err);
            console.log(result);
            let answer = JSON.parse(JSON.stringify(result));
            console.log('The data sent to the client is: \n', answer);
            res.send(answer);
        });
    });

}

exports.getCurrent = getCurrent;
exports.getHistory = getHistory;