var builder = require('botbuilder');
var currencies = require("./Favouritecurrencies");
var currenciesexchange=require("./EchangeRate");
var qna=require("./QnAMaker");
var customVision = require('./CognitiveDialog');
// Some sections have been omitted
var isAttachment = false;


function isAttachment(session) { 
    var msg = session.message.text;
    if ((session.message.attachments && session.message.attachments.length > 0) || msg.includes("http")) {
        //call custom vision
        session.send("Calling custom vision");
        customVision.retreiveMessage(session);

        return true;
    }
    else {
        return false;
    }
}

exports.startDialog = function (bot) {
    // Replace {YOUR_APP_ID_HERE} and {YOUR_KEY_HERE} with your LUIS app ID and your LUIS key, respectively.
    var recognizer = new builder.LuisRecognizer('https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/e4a99a2c-0797-4fc8-be41-c1f5d5c4e439?subscription-key=70a969c682e94fb0a047edde403fe126&verbose=true&timezoneOffset=0&q=');
    
    bot.recognizer(recognizer);


    bot.dialog('GetSpecifcCurrencyExchangeRates', [
        
        function (session, results, next) {

                session.send("Converting the currencies");
                currenciesexchange.displaySpecificcurrencyexchangerate(session, session.conversationData["fromcurrency"]);  // <---- THIS LINE HERE IS WHAT WE NEED 
        }
    ]).triggerAction({
        matches: 'GetSpecifcCurrencyExchangeRates'
    });

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

    bot.dialog('GetFavoriteCurrencies', [
        function (session, args, next) {
            session.dialogData.args = args || {};        
            if (!session.conversationData["username"]) {
                builder.Prompts.text(session, "Please enter your username so I can retrive saved currencies");                
            } else {
                next(); // Skip if we already have this info.
            }
        },
        function (session, results, next) {

                if (results.response) {
                    session.conversationData["username"] = results.response;
                }

                session.send("Retrieving exchange rates of your saved currencies");
                currencies.displayFavouriteCurrencies(session, session.conversationData["username"]);  // <---- THIS LINE HERE IS WHAT WE NEED 
            
        }
    ]).triggerAction({
        matches: 'GetFavoriteCurrencies'
    });



  bot.dialog('DeleteFavourite', [
        function (session, args, next) {
            session.dialogData.args = args || {};
            if (!session.conversationData["username"]) {
                builder.Prompts.text(session, "Enter a username to setup your account.");
            } else {
                next(); // Skip if we already have this info.
            }
        },
        function (session, results,next) {
            
            //Add this code in otherwise your username will not work.
            if (results.response) {
                session.conversationData["username"] = results.response;
            }

            session.send("You want to delete one of your favourite foods.");

            // Pulls out the food entity from the session if it exists
            var foodEntity = builder.EntityRecognizer.findEntity(session.dialogData.args.intent.entities, 'food');

            // Checks if the for entity was found
            if (foodEntity) {
                session.send('Deleting \'%s\'...', foodEntity.entity);
                food.deleteFavouriteFood(session,session.conversationData['username'],foodEntity.entity); //<--- CALLL WE WANT
            } else {
                session.send("No food identified! Please try again");
            }
        

    }]).triggerAction({
        matches: 'DeleteFavourite'
    });



    bot.dialog('WantFood', function (session, args) {
        
        session.send("WantFood intent found");
    
    }).triggerAction({
        matches: 'WantFood'
    });

    bot.dialog('WelcomeIntent', function (session, args) {
        
        session.send("WelcomeIntent intent found");
    
    }).triggerAction({
        matches: 'WelcomeIntent'
    });

    bot.dialog('LookForFavourite', [
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
                var foodEntity = builder.EntityRecognizer.findEntity(session.dialogData.args.intent.entities, 'food');
    
                // Checks if the food entity was found
                if (foodEntity) {
                    session.send('Thanks for telling me that \'%s\' is your favourite food', foodEntity.entity);
                    food.sendFavouriteFood(session, session.conversationData["username"], foodEntity.entity); // <-- LINE WE WANT
    
                } else {
                    session.send("No food identified!!!");
                }
            }
        
    ]).triggerAction({
        matches: 'LookForFavourite'
    });
    

}