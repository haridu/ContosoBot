var rest = require('../API/Restclient');

exports.Athenticate = function getAuthentication(session, username, password) {
    
    var url = 'http://harinducontosobot.azurewebsites.net/tables/Athentication';
    rest.GetSavedAuth(url, session, username, password, handleAuthentication);
};

function handleAuthentication(message, session, username, password) {
    var favouriteFoodResponse = JSON.parse(message);
    var Authticated = false;
   
    for (var index in favouriteFoodResponse) {
        var usernameReceived = favouriteFoodResponse[index].username;
        var passwordReceived = favouriteFoodResponse[index].favouritecurrencies;

        if (username.toLowerCase() === usernameReceived.toLowerCase()) {

            if (username.toLowerCase() === usernameReceived.toLowerCase()) {

                Authticated = true;
                break;
            }

        }


    }

    if (Authticated == true) {
        session.send("Authenticated");
        session.conversationData['Athenticated'] = 'true';
    }else{
       session.send("Invalid username and password, Please try Again!");
    }

}


