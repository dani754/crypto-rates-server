//general API configuration
const coinMarketCapAPI = {
    hostname: 'pro-api.coinmarketcap.com',
    port: 443,
    path: '/',
    headers: {
        'X-CMC_PRO_API_KEY': '1089cde2-9abb-4f0e-9a03-e5c4dc5e85dd', //API KEY
        'Content-Type': 'application/json'
    },
    json: true,
    gzip: true,
};

const coinsSymbol = 'symbol=BTC,ETH,LTC';

//get-latest-rates API path
const latestsQuotesPath = '/v1/cryptocurrency/quotes/latest' + '?' + coinsSymbol;

//adds specific request path to API
const latestsQuotesAPI = coinMarketCapAPI;
latestsQuotesAPI.path = latestsQuotesPath;

exports.latestsQuotesAPI = latestsQuotesAPI;