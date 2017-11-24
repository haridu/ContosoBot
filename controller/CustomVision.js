var request = require('request'); //node module for http post requests

exports.retreiveMessage = function (session){

    request.post({
        url: 'https://southcentralus.api.cognitive.microsoft.com/customvision/v1.0/Prediction/4935c94f-bc75-4fe3-8285-42e892a3d7b2/url',
        json: true,
        headers: {
            'Content-Type': 'application/json',
            'Prediction-Key': 'dd35061368584e85b5449750ac5b059e'
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