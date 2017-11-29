var request = require('request');
var customvision = require('./CustomVision');

exports.retreiveMessage = function (session) {

    request.post({
        url: 'https://southcentralus.api.cognitive.microsoft.com/customvision/v1.0/Prediction/0544b417-d179-49ba-a49b-cb8ffbf76d0b/url?iterationId=39a94183-6712-4281-8ce0-6a6d670568bb',
        json: true,
        headers: {
            'Content-Type': 'application/json',
            'Prediction-Key': '18b3ab4dcb65431989aef002aec9799e'
        },
        body: { 'Url': session.message.text }
    }, function (error, response, body) {
        console.log(validResponse(body));
        session.send(validResponse(body));
    });
}

//provide identification of the currency url
function validResponse(body) {
    if (body && body.Predictions && body.Predictions[0].Tag) {
        return "This is " + body.Predictions[0].Tag +" currency note"
    } else {
        console.log('Sorry I could not recognize this image, please try another :) ');
    }
}

//check if the messege is a url
exports.getnoteidentification=function isAttachment(session) {
    var msg = session.message.text;
    if ((session.message.attachments && session.message.attachments.length > 0) || msg.includes("http") || msg.includes("https") || msg.includes("png") || msg.includes("jpg")) {

        customvision.retreiveMessage(session);

        return true;
    }
    else {
        return false;
    }
}
