var builder = require('botbuilder');
var currencies = require("./Favouritecurrencies");
var currenciesexchange = require("./EchangeRate");
var qna = require("./QnAMaker");
var customVision = require("./CustomVision");
var textAnalysis = require("./TextAnalysis");
var login = require("./Login");

//var isAttachment = false;


exports.startDialog = function (bot) {

    var recognizer = new builder.LuisRecognizer('https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/e4a99a2c-0797-4fc8-be41-c1f5d5c4e439?subscription-key=70a969c682e94fb0a047edde403fe126&verbose=true&timezoneOffset=0&q=');
    bot.recognizer(recognizer);

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

        }
    ]).triggerAction({
        matches: 'GetSpecifcCurrencyExchangeRates'
    });


    bot.dialog('GetExchangeratebasedOn', [

        function (session, args, next) {

            var intent = args.intent;

            if (builder.EntityRecognizer.findEntity(intent.entities, 'currency') == null) {
                session.send("Sorry, I could not understand required currency. Please Type 'Help' to view available commands");
            } else {
                var currencyEntity = builder.EntityRecognizer.findEntity(intent.entities, 'currency').entity.toUpperCase();

                currenciesexchange.displaybasedonexchangerate(session, currencyEntity);  // <---- THIS LINE HERE IS WHAT WE NEED 

            }

        }
    ]).triggerAction({
        matches: 'GetExchangeratebasedOn'
    });


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



    bot.dialog('Login', [
        function (session, args, next) {

            session.dialogData.args = args || {};

            if (!session.conversationData["username"]) {
                builder.Prompts.text(session, "Enter a username .");
            } else {
                next(); // Skip if we already have this info.
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
                next(); // Skip if we already have this info.
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

            // Pulls out the food entity from the session if it exists
            var currencyEntity = builder.EntityRecognizer.findEntity(session.dialogData.args.intent.entities, 'currency');

            // Checks if the for entity was found
            if (currencyEntity) {

                currencies.deleteSavedCurrency(session, session.conversationData['username'], currencyEntity.entity);
            } else {
                session.send("No food identified! Please try again");
            }

        }
    ]).triggerAction({
        matches: 'DeleteFromSaved'
    });


    /* This works but needs to to be changed
   
       bot.dialog('QnA', [
           function (session, args, next) {
               session.dialogData.args = args || {};
               builder.Prompts.text(session, "What is your question?");
           },
           function (session, results, next) {
               qna.talkToQnA(session, results.response);
           }
       ]).triggerAction({
           matches: 'QnA'
       });
   */

    bot.dialog('Image', function (session, args) {

        if (customVision.getnoteidentification(session)) {

            session.send('converting image');
        } else {
            session.send('Sorry, I did not understand \'%s\'. Type \'help\' if you need assistance.', session.message.text);
        }


    }).triggerAction({
        matches: 'Image'
    });


    bot.dialog('Welcome', function (session, args) {

        session.send("Hello there!");
        var documents = {
            'documents': [
                { 'id': '1', 'text': session.message.text }
            ]
        };

        textAnalysis.HandleText(documents, session);

    }).triggerAction({
        matches: 'Welcome'
    });






}