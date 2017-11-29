var rest = require('../API/Restclient');
var builder = require('botbuilder');

exports.displaySavedCurrencies = function getSavedCurrencies(session, username) {
    var url = 'http://harinducontosobot.azurewebsites.net/tables/CostosoTable';
    rest.GetSaved(url, session, username, handleSavedCurrenciesResponse);
};

exports.AddToSavedCurrencies = function postSavedCurrencies(session, username, currency) {
    var url = 'http://harinducontosobot.azurewebsites.net/tables/CostosoTable';
    rest.postToSaved(url, username, currency);
};


exports.deleteSavedCurrency = function deleteSaved(session, username, favouritecurrencies) {
    var url = 'http://harinducontosobot.azurewebsites.net/tables/CostosoTable';


    rest.GetSaved(url, session, username, function (message, session, username) {
        var allCurrencies = JSON.parse(message);
        var num = 0;
        for (var i in allCurrencies) {

            if (allCurrencies[i].favouritecurrencies === favouritecurrencies && allCurrencies[i].username === username) {

                console.log(allCurrencies[i]);

                rest.deleteCurrencyFromSaved(url, session, username, favouritecurrencies, allCurrencies[i].id, handleDeletedCurrencyResponse)
                num++;
            }
        }

        if (num == 0) {
            session.send("%s does not exist in your saved currecy list to delete", favouritecurrencies);
        }


    });


};

function handleDeletedCurrencyResponse(body, session, username, savedCurrency) {
    console.log('done');
}

//provide saved currencies list with a hero card
function handleSavedCurrenciesResponse(message, session, username) {

    var allCurrencies = [];

    var SavedcurrencyResponse = JSON.parse(message);
    var attachment = [];
    var messege_text = "\n\n";
    var num = 0;

    var card = new builder.HeroCard(session);
    card.title('Contoso Bank - %s saved currencies list',username);

    for (var index in SavedcurrencyResponse) {
        var usernameReceived = SavedcurrencyResponse[index].username;
        console.log(SavedcurrencyResponse[index]);
        var favouritecurrencies = SavedcurrencyResponse[index].favouritecurrencies;
        num++;

        if (username.toLowerCase() === usernameReceived.toLowerCase()) {

            if (SavedcurrencyResponse.length) {
                allCurrencies.push(favouritecurrencies);
                messege_text += num + "  " + favouritecurrencies + "\n\n";
            }

        }

    }
    card.text(messege_text);
    attachment.push(card);

    if (allCurrencies.length == 0) {
        session.send("%s, Your saved Currency list is empty", username);
    } else {

        var message = new builder.Message(session)
            .attachmentLayout(builder.AttachmentLayout.carousel)
            .attachments(attachment);
        session.send(message);

    }


}