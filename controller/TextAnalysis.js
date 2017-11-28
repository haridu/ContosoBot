//'use strict';
var rest = require('../API/Restclient');
var https = require ('https');
var LuisDialog=require('./LuisDialog');
var Ses;

var accessKey = '1ad83c04867441b0a7a03897e965abb0';


var uri = 'westcentralus.api.cognitive.microsoft.com';
var path = '/text/analytics/v2.0/languages';

var response_handler = function (response,session) {
    var body = '';
    response.on ('data', function (d) {
        body += d;
    });
    response.on ('end', function () {
        var body_ = JSON.parse (body);
        var identifiedlanguage=body_.documents[0].detectedLanguages[0].name;
       
        if(identifiedlanguage=='English'||identifiedlanguage=='Catalan'){
            console.log ('English or Catlan identified');          
        }else{
            Ses.send('Hi, Currently Costoso bot is only supported English %s is not yet supported', identifiedlanguage);
        }


        var body__ = JSON.stringify (body_, null, '  ');
        console.log (body__);
      
       
    });
    response.on ('error', function (e) {
        console.log ('Error: ' + e.message);
    });
};

exports.HandleText =function SendTextToAnalyze (documents,session) {
    var body = JSON.stringify (documents);

    var request_params = {
        method : 'POST',
        hostname : uri,
        path : path,
        headers : {
            'Ocp-Apim-Subscription-Key' : accessKey,
        }
    };
    Ses=session;
    var req = https.request (request_params,response_handler);
    req.write (body);
    req.end ();
}

