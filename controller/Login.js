var rest = require('../API/Restclient');

exports.Athenticate = function getAuthentication(session, username, password) {
    
    var url = 'http://harinducontosobot.azurewebsites.net/tables/Athentication';
    rest.GetSavedAuth(url, session, username, password, handleAuthentication);
};

//check for authentication with username and password
function handleAuthentication(message, session, username, password) {
    var AuthResponse = JSON.parse(message);
    var Authticated = false;
    var crypto = require('crypto'); 
    var hashed = crypto.createHash('md5').update(password).digest('hex');
    console.log(hashed);
    
      
    for (var index in AuthResponse) {
        var usernameReceived = AuthResponse[index].username;
        var passwordReceived = AuthResponse[index].password;

        if (username.toLowerCase() === usernameReceived.toLowerCase()) {

            if (hashed == passwordReceived) {

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
       session.send(hashed);
    }

}


