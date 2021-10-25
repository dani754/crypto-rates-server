
const sqlInsert = 'INSERT INTO rates (BTC, ETH, LTC) values (11111.11, 22222.22, 3333.33);';

app.get('/', (req,res) => {
    pool.getConnection((err, connection) => {
        if (err) console.log(err);
        console.log('connected as id ' + connection.threadId);
        connection.query(sqlInsert, (err, result) => {
            connection.release(); 
            if(err) console.log(err);
            console.log('The data sent to the rates table is: \n', result);
            res.send("result");
        });
    });
});

http.get('http://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=BTC', {
    qs: {
        'start': '1',
        'limit': '5000',
        'convert': 'USD'
      },
      
      json: true,
      gzip: true
    }).then(response => {
        console.log('API call response:', response);
    }).catch((err) => {
        console.log('API call error:', err.message);
    });

    function updateRates(){
        let rates = setInterval(rateFetch(), 30000);
    };
    
    function rateFetch(){
        coinmarketcap.multi(coins => {
            let BTC = coins.get("BTC").price_usd;
            let ETH = coins.get("ETH").price_usd;
            let LTC = coins.get("LTC").price_usd;
            let sqlInsert = 'INSERT INTO rates (BTC, ETH, LTC) values ('+BTC+','+ETH+', '+LTC+')';
            pool.getConnection((err, connection) => {
                if (err) console.log(err);
                console.log('connected as id ');
                connection.query(sqlInsert, (err, result) => {
                    connection.release(); 
                    if(err) console.log(err);
                    console.log('The data sent to the rates table is: \n', result);
                    res.send("result");
                });
            });
        });
    };
    

    const sqlLatest = 'SELECT * FROM rates WHERE date >= ALL (SELECT MAX(date) FROM rates);';

app.get('/', (req,res) => {
    pool.getConnection((err, connection) => {
        if (err) console.log(err);
        console.log('connected as id ');
        connection.query(sqlLatest, (err, result) => {
            connection.release(); 
            if(err) console.log(err);
            console.log('The data sent to the client is: \n', result);
            res.send("result");
        });
    });
});
