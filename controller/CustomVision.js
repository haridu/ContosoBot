var request = require('request'); //node module for http post requests

exports.retreiveMessage = function (session){
    
        request.post({
            url: 'https://southcentralus.api.cognitive.microsoft.com/customvision/v1.0/Prediction/0544b417-d179-49ba-a49b-cb8ffbf76d0b/url?iterationId=39a94183-6712-4281-8ce0-6a6d670568bb',
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
        console.log('Sorry we did not recognize this image, please try another');
    }
}