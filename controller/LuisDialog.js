var builder = require('botbuilder');
var currencies = require("./Favouritecurrencies");
var currenciesexchange = require("./EchangeRate");
var qna = require("./QnAMaker");
var customVision = require("./CustomVision");
var textAnalysis = require("./TextAnalysis");
var login=require("./Login");
// Some sections have been omitted
var isAttachment = false;


exports.startDialog = function (bot) {
    // Replace {YOUR_APP_ID_HERE} and {YOUR_KEY_HERE} with your LUIS app ID and your LUIS key, respectively.
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
                session.send("Converting the currencies");
                currenciesexchange.displaySpecificcurrencyexchangerate(session, fromcurrencyEntity, tocurrencyEntity);  // <---- THIS LINE HERE IS WHAT WE NEED 
                session.send("from is %s to is %s", fromcurrencyEntity, tocurrencyEntity);
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
            if (session.conversationData["Athenticated"] == "true") {
                next();
            }
            else {
                session.beginDialog('Login');
            }
        },
        function (session, results) {

            if (session.conversationData["Athenticated"]!="true") {
                session.send('you were not logged in, Please try again');
               // session.endDialog();
            } else {
                session.send("Retrieving exchange rates of your saved currencies");
                currencies.displaySavedCurrencies(session, session.conversationData["username"]);  // <---- THIS LINE HERE IS WHAT WE NEED 
            }
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

                login.Athenticate(session,session.conversationData['username'], session.conversationData['password']);
                             
                session.send('%s is the username password is %s', session.conversationData['username'], session.conversationData['password']);
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

            //Add this code in otherwise your username will not work.
            if (results.response) {
                session.conversationData["username"] = results.response;
            }

            session.send("You want to delete one of your saved currencies from the list?");

            // Pulls out the food entity from the session if it exists
            var currencyEntity = builder.EntityRecognizer.findEntity(session.dialogData.args.intent.entities, 'currency');

            // Checks if the for entity was found
            if (currencyEntity) {
                session.send('Deleting \'%s\'...', currencyEntity.entity);
                currencies.deleteSavedCurrency(session, session.conversationData['username'], currencyEntity.entity); //<--- CALLL WE WANT
            } else {
                session.send("No currency identified! Please try again");
            }


        }]).triggerAction({
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


    bot.dialog('Welcome', function (session, args) {

        session.send("WelcomeIntent intent found");
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