var builder = require('botbuilder');
var currencies = require("./Favouritecurrencies");
var currenciesexchange = require("./ExchangeRate");
var customVision = require("./CustomVision");
var textAnalysis = require("./TextAnalysis");
var login = require("./Login");

//starts bot dialogs
exports.startDialog = function (bot) {
    //luis instantiation
    var recognizer = new builder.LuisRecognizer('https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/e4a99a2c-0797-4fc8-be41-c1f5d5c4e439?subscription-key=70a969c682e94fb0a047edde403fe126&verbose=true&timezoneOffset=0&q=');
    bot.recognizer(recognizer);

    //dialog for getting exchange rates between two currencies
    bot.dialog('GetSpecifcCurrencyExchangeRates', [

        function (session, args, next) {

            var intent = args.intent;

            if (builder.EntityRecognizer.findEntity(intent.entities, 'fromcurrency') == null || builder.EntityRecognizer.findEntity(intent.entities, 'tocurrency') == null) {
                session.send("Sorry, I could not understand required currencies. Please Type 'Help' to view available commands");
            } else {
                var fromcurrencyEntity = builder.EntityRecognizer.findEntity(intent.entities, 'fromcurrency').entity.toUpperCase();
                var tocurrencyEntity = builder.EntityRecognizer.findEntity(intent.entities, 'tocurrency').entity.toUpperCase();
                session.send("Getting exchange rates...");
                currenciesexchange.displaySpecificcurrencyexchangerate(session, fromcurrencyEntity, tocurrencyEntity);  // <---- THIS LINE HERE IS WHAT WE NEED 

            }
            session.endDialog();
        }
    ]).triggerAction({
        matches: 'GetSpecifcCurrencyExchangeRates'
    });

    //dialog for getting exchange rates based on request currency
    bot.dialog('GetExchangeratebasedOn', [

        function (session, args, next) {

            var intent = args.intent;

            if (builder.EntityRecognizer.findEntity(intent.entities, 'currency') == null) {
                session.send("Sorry, I could not understand required currency. Please Type 'Help' to view available commands");
            } else {
                var currencyEntity = builder.EntityRecognizer.findEntity(intent.entities, 'currency').entity.toUpperCase();

                currenciesexchange.displaybasedonexchangerate(session, currencyEntity);  // <---- THIS LINE HERE IS WHAT WE NEED 

            }
            session.endDialog();
        }
    ]).triggerAction({
        matches: 'GetExchangeratebasedOn'
    });

   //dialog for getting saved currencies list
    bot.dialog('GetMyCurrencies', [
        function (session, args, next) {
            session.dialogData.args = args || {};
            if (!session.conversationData["username"]) {
                builder.Prompts.text(session, "Please enter your username so I can retrieve your saved currencies");
            } else {
                next();
            }
        },
        function (session, results, next) {

            if (results.response) {
                session.conversationData["username"] = results.response;
            }

            session.send("Retrieving your saved currencies......");
            currencies.displaySavedCurrencies(session, session.conversationData["username"]);  // <---- THIS LINE HERE IS WHAT WE NEED 
            session.endDialog();
        }
    ]).triggerAction({
        matches: 'GetMyCurrencies'
    });


   //dialog for login, this works but is standalone and not intergrated due to unstability
    bot.dialog('Login', [
        function (session, args, next) {

            session.dialogData.args = args || {};

            if (!session.conversationData["username"]) {
                builder.Prompts.text(session, "Enter a username .");
            } else {
                next(); 
            }
        },
        function (session, results, args, next) {
            if (results.response) {
                session.conversationData['username'] = results.response;
            }
            session.dialogData.args = args || {};
            if (!session.conversationData['password']) {
                builder.Prompts.text(session, "Enter a password ");
            } else {
                next(); 
            }
        },
        function (session, results, args, next) {
            if (results.response) {
                session.conversationData['password'] = results.response;
            }

            if (!session.conversationData['username'] || (!session.conversationData['password'])) {
                session.send("Username field or Password field is empty please try again");

            } else {

                login.Athenticate(session, session.conversationData['username'], session.conversationData['password']);

                session.send('%s is the username password is %s and auth status %s', session.conversationData['username'], session.conversationData['password'], session.conversationData['Athenticated']);
            }
            session.endDialog();
        }

    ]).triggerAction({
        matches: 'Login'
    });


    bot.dialog('AddToSaved', [
        function (session, args, next) {
            session.dialogData.args = args || {};
            if (!session.conversationData["username"]) {
                builder.Prompts.text(session, "Enter a username to setup your account.");
            } else {
                next(); // Skip if we already have this info.
            }
        },
        function (session, results, next) {

            if (results.response) {
                session.conversationData["username"] = results.response;
            }
            // Pulls out the food entity from the session if it exists
            var currencyEntity = builder.EntityRecognizer.findEntity(session.dialogData.args.intent.entities, 'currency');

            // Checks if the food entity was found
            if (currencyEntity) {
                session.send('Added \'%s\' to your saved currency list', currencyEntity.entity);
                currencies.AddToSavedCurrencies(session, session.conversationData["username"], currencyEntity.entity); // <-- LINE WE WANT

            } else {
                session.send("No currency identified!!!");
            }
            session.endDialog();
        }

    ]).triggerAction({
        matches: 'AddToSaved'
    });




    bot.dialog('DeleteFromSaved', [
        function (session, args, next) {
            session.dialogData.args = args || {};
            if (!session.conversationData["username"]) {
                builder.Prompts.text(session, "Enter a username to setup your account.");
            } else {
                next(); // Skip if we already have this info.
            }
        },
        function (session, results, next) {

            // Pulls out the currency entity from the session if it exists
            var currencyEntity = builder.EntityRecognizer.findEntity(session.dialogData.args.intent.entities, 'currency');

            // Checks if the for entity was found
            if (currencyEntity) {

                currencies.deleteSavedCurrency(session, session.conversationData['username'], currencyEntity.entity);
            } else {
                session.send("No food identified! Please try again");
            }

            session.endDialog();
        }
    ]).triggerAction({
        matches: 'DeleteFromSaved'
    });

    //dialog for identifying currency from url 
    bot.dialog('Image', function (session, args) {

        if (customVision.getnoteidentification(session)) {

            session.send('converting image');
        } else {
            session.send('Sorry, I did not understand \'%s\'. Type \'help\' if you need assistance.', session.message.text);
        }
        session.endDialog();

    }).triggerAction({
        matches: 'Image'
    });

    //dialog for starting bot messege 
    bot.dialog('start', function (session, args) {

        var attachment = [];
        var messege_text = "";

        var card = new builder.HeroCard(session);
        card.title('Hey ');

        card.images([builder.CardImage.create(session, 'http://contosobotweb.azurewebsites.net/img/profile.png')]);
        messege_text = "Hey, My name is ContsoBot :) I am powered by Contoso Bank. /n/n I can help you by providing uptodate currency exchange rates as your request.//n Please type 'help' to view my other functionalities and how to interact with me.";

        card.text(messege_text);
        card.buttons([builder.CardAction.openUrl(session, 'http://contosobotweb.azurewebsites.net/', 'My website :)')]);
        attachment.push(card);

        var message = new builder.Message(session)
            .attachmentLayout(builder.AttachmentLayout.carousel)
            .attachments(attachment);
        session.send(message);
    }).triggerAction({
        matches: 'start'
    });


    //dialog for help bot messege 
    bot.dialog('Help', function (session, args) {

        var attachment = [];
        var messege_text = "";

        var card = new builder.HeroCard(session);
        card.title('Im here to Help :) ');

        card.images([builder.CardImage.create(session, 'http://contosobotweb.azurewebsites.net/img/profile.png')]);
        messege_text = "Available Functions \n\n1) show exchange rates between two currencies: eg- What are the exchange rates between USD and NZD? \n\n 2)Show exchange rates based on requested currency: eg- 'What are the exchange rates based on USD' \n\n 3)Show saved list : eg- 'what are my saved currencies? '\n\n 4)add to  saved list : eg- 'add NZD to my saved list'\n\n 5)delete from the saved list: eg- 'delete NZD from my saved list'\n\n 6)Identify New Zealand currency notes with non New Zeland currency notes : eg- 'http://www.polymernotes.com/nz$100-p189f.jpg'\n\n";

        card.text(messege_text);
        card.buttons([builder.CardAction.openUrl(session, 'http://contosobotweb.azurewebsites.net/', 'My website :)')]);
        attachment.push(card);

        var message = new builder.Message(session)
            .attachmentLayout(builder.AttachmentLayout.carousel)
            .attachments(attachment);
        session.send(message);
    }).triggerAction({
        matches: 'Help'
    });

    //dialog for welcome messege 
    bot.dialog('Welcome', function (session, args) {

        session.send("Hello there!");
        var documents = {
            'documents': [
                { 'id': '1', 'text': session.message.text }
            ]
        };

        //text analysis for user input
        textAnalysis.HandleText(documents, session);
        session.endDialog();
    }).triggerAction({
        matches: 'Welcome'
    });






}