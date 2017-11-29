var restify = require('restify');
var builder = require('botbuilder');
var luis = require('./controller/LuisDialog');
var customVision = require('./controller/CustomVision');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});

// Create chat connector for communicating with the Bot Framework Service

var connector = new builder.ChatConnector({
    appId: "df48ac09-174a-4986-bfc9-9281fd9d6544",
    appPassword: "llhRUQXD499(}hsdxWM60$|"
});

/*
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
*/

// Listen for messages from users 
server.post('/api/messages', connector.listen());

// Receive messages from the user
var bot = new builder.UniversalBot(connector, function (session) {
    
    if(isAttachment(session)){

        session.send('converting image');
    }else{
        session.send('Sorry, I did not understand \'%s\'. Type \'help\' if you need assistance.', session.message.text);
    }

   
});

//check if the attachemnt is a url
function isAttachment(session) { 
    var msg = session.message.text;
    if ((session.message.attachments && session.message.attachments.length > 0) || msg.includes("http")||msg.includes("https")||msg.includes("png")||msg.includes("jpg")) {
        customVision.retreiveMessage(session);

        return true;
    }
    else {
        return false;
    }
}

//used for start dialog when chat opens
bot.on('conversationUpdate', function (message) {
    if (message.membersAdded) {
        message.membersAdded.forEach(function (identity) {
            if (identity.id === message.address.bot.id) {
                bot.beginDialog(message.address, 'start');
            }
        });
    }
});
    

luis.startDialog(bot);