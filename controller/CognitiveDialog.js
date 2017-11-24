var request = require('request'); //node module for http post requests

exports.retreiveMessage = function (session){

    request.post({
        url: 'https://customvision.ai/https://southcentralus.api.cognitive.microsoft.com/customvision/v1.0/Prediction/d09183ae-45f8-40c6-88f1-dd8c496f3a08/url?iterationId=c21714ce-026e-4ea5-bd7c-df2945c928e6',
        json: true,
        headers: {
            'Content-Type': 'application/json',
            'Prediction-Key': '18b3ab4dcb65431989aef002aec9799e'
        },
        body: { 'Url': session.message.text }
    }, function(error, response, body){
        console.log(validResponse(body));
        session.send(validResponse(body));
    });
}

function validResponse(body){
    if (body && body.Predictions && body.Predictions[0].Tag){
        return "This is " + body.Predictions[0].Tag
    } else{
        console.log('Oops, please try again!');
    }
}