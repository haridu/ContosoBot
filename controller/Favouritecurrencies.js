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

                rest.deleteCurrencyFromSaved(url, session, username, favouritecurrencies, allCurrencies[i].id, handleDeletedFoodResponse)
                num++;
            }
        }

        if (num == 0) {
            session.send("%s does not exist in your saved currecy list to delete", favouritecurrencies);
        }


    });


};

function handleDeletedFoodResponse(body, session, username, savedCurrency) {

    session.send('it does not exist');
    console.log('Done');

}

function handleSavedCurrenciesResponse(message, session, username) {

    var allCurrencies = [];

    var favouriteFoodResponse = JSON.parse(message);
    var attachment = [];
    var messege_text = "\n\n";
    var num = 0;

    var card = new builder.HeroCard(session);
    card.title('Your saved currencies');

    for (var index in favouriteFoodResponse) {
        var usernameReceived = favouriteFoodResponse[index].username;
        console.log(favouriteFoodResponse[index]);
        var favouritecurrencies = favouriteFoodResponse[index].favouritecurrencies;
        num++;

        if (username.toLowerCase() === usernameReceived.toLowerCase()) {

            if (favouriteFoodResponse.length) {
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