var rest = require('../API/Restclient');
var builder = require('botbuilder');

exports.displaySpecificcurrencyexchangerate = function getSpecificcurrencyexchangerate(session, fromcurrency, tocurrency) {

    var url = 'https://api.fixer.io/latest?symbols=' + fromcurrency + ',' + tocurrency + '';

    rest.getspecificexchangerate(url, session, fromcurrency, tocurrency, handleSpecificCurrenciesExchangeRateResponse)
};

function handleSpecificCurrenciesExchangeRateResponse(message, session, fromcurrency, tocurrency) {
    session.send("here");
    var SpecificCurrenciesResponse = JSON.parse(message);

    var fromvalue = SpecificCurrenciesResponse.rates[fromcurrency];
    var tovalue = SpecificCurrenciesResponse.rates[tocurrency];
    

    var attachment = [];
/*
    var card = new builder.HeroCard(session)
        .title('Exchange rate of '+fromcurrency+' to '+tocurrency+' In EU')
        .text(fromcurrency+' :'+fromvalue)
        .text(fromcurrency+' :'+fromvalue)
        .images([
            builder.CardImage.create(session, '')])
        .buttons([
            builder.CardAction.openUrl(session, 'http://www.xe.com/currencyconverter/', 'More Information')
        ]);
    attachment.push(card);


    var message = new builder.Message(session)
        .attachmentLayout(builder.AttachmentLayout.carousel)
        .attachments(attachment);
    session.send(message);
    session.send("%s  to %s Exchange rate complete ", fromvalue, tovalue);*/

    
    var card= new builder.ReceiptCard(session)
    .title('Exchange rate of '+fromcurrency+' to '+tocurrency+'')
    .facts([
        builder.Fact.create(session, "", 'Based on EUR')
    ])
    .items([
        builder.ReceiptItem.create(session,''+fromvalue+'', ''+fromcurrency+'')
            .quantity(368)
            .image(builder.CardImage.create(session, 'https://t4.ftcdn.net/jpg/01/30/80/31/240_F_130803157_EPcf5kbnOSi8kFOsVkleIuuLPHRU929E.jpg')),
        builder.ReceiptItem.create(session,''+tovalue+'', ''+tocurrency+'')
            .quantity(720)
            .image(builder.CardImage.create(session, 'https://t4.ftcdn.net/jpg/01/30/80/31/240_F_130803157_EPcf5kbnOSi8kFOsVkleIuuLPHRU929E.jpg'))
    ])
    .buttons([
        builder.CardAction.openUrl(session, 'http://www.xe.com/currencyconverter/', 'More exchange rate infomation')
            .image('https://raw.githubusercontent.com/amido/azure-vector-icons/master/renders/microsoft-azure.png')
    ]);
    // attach the card to the reply message
    var msg = new builder.Message(session).addAttachment(card);
    session.send(msg);
}

