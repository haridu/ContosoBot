var rest = require('../API/Restclient');

exports.displaySpecificcurrencyexchangerate = function getSpecificcurrencyexchangerate(session, username){
    var url = 'https://api.fixer.io/latest?symbols=USD,GBP';
    rest.getspecificexchangerate(url, session, username, handleSpecificCurrenciesExchangeRateResponse)
};

function handleSpecificCurrenciesExchangeRateResponse(message, session, username) {
    
    // Print all favourite foods for the user that is currently logged in
    //session.send(" Exchange rate from %s to %s are", username, allFoods);                
    session.send(" Exchange rate complete");
}