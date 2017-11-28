var request = require('request');

exports.postQnAResults = function getData(url, session, question, callback){
    var options = {
        url: url,
        method: 'POST',
        headers: {
            'Ocp-Apim-Subscription-Key': '230d15ed5f544175b7b86b7a4e910848',
            'Content-Type':'application/json'
        },
        json: {
            "question" : question
        }
      };
  
      request(options, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            callback(body, session, question);
        }
        else{
            console.log(error);
        }
      });
  };


exports.getspecificexchangerate = function getData(url, session, fromcurrency,tocurrency, callback){
    request.get(url, {'headers':{'Content-Type':'application/json'}}, 
    function handleGetReponse(err,res,body){
        if(err){
            console.log(err);
        }else {
            callback(body, session,fromcurrency,tocurrency);
        }
    });
};

exports.getexchangerate = function getData(url, session,currency,callback){
    request.get(url, {'headers':{'Content-Type':'application/json'}}, 
    function handleGetReponse(err,res,body){
        if(err){
            console.log(err);
        }else {
            callback(body, session,currency);
        }
    });
};

exports.GetSavedAuth= function getData(url, session, username,password, callback){
    request.get(url, {'headers':{'ZUMO-API-VERSION': '2.0.0'}}, function handleGetReponse(err,res,body){
        if(err){
            console.log(err);
        }else {
            callback(body, session, username,password);
        }
    });
};


exports.GetSaved= function getData(url, session, username, callback){
    request.get(url, {'headers':{'ZUMO-API-VERSION': '2.0.0'}}, function handleGetReponse(err,res,body){
        if(err){
            console.log(err);
        }else {
            callback(body, session, username);
        }
    });
};

exports.postToSaved = function SendData(url, username, favouritecurrencies){
    var options = {
        url: url,
        method: 'POST',
        headers: {
            'ZUMO-API-VERSION': '2.0.0',
            'Content-Type':'application/json'
        },
        json: {
            "username" : username,
            "favouritecurrencies" : favouritecurrencies
        }
      };
      
      request(options, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            console.log(body);
        }
        else{
            console.log(error);
        }
      });
};

exports.deleteCurrencyFromSaved = function deleteData(url,session, username ,savedCurrency, id, callback){
    session.send("in the method");
    var options = {
        url: url + "\\" +"3cc1306b-da7b-4513-b3c9-ad0beb126264",
        method: 'DELETE',
        headers: {
            'ZUMO-API-VERSION': '2.0.0',
            'Content-Type':'application/json'
        }
    };

    session.send("after deleting");

    request(options,function (err, res, body){
        if( !err && res.statusCode === 200){
            session.send("deleteing sucessful");
            console.log(body);
            callback(body,session,username,savedCurrency);
        }else {
            session.send(" %s does not exist in the saved list",savedCurrency);
        }
    })

};