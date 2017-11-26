var rest = require('../API/Restclient');

exports.displaySavedCurrencies = function getSavedCurrencies(session, username){
    var url = 'http://harinducontosobot.azurewebsites.net/tables/CostosoTable';
    rest.GetSaved(url, session, username, handleSavedCurrenciesResponse);
};

exports.AddToSavedCurrencies = function postSavedCurrencies(session, username, currency){
    var url = 'http://harinducontosobot.azurewebsites.net/tables/CostosoTable';
    rest.postToSaved(url, username, currency);
};


exports.deleteFavouriteFood = function deleteFavouriteFood(session,username,favouriteFood){
    var url  = 'http://harinducontosobot.azurewebsites.net/tables/CostosoTable';


    rest.getFavouriteFood(url,session, username,function(message,session,username){
     var   allFoods = JSON.parse(message);

        for(var i in allFoods) {

            if (allFoods[i].favouriteFood === favouriteFood && allFoods[i].username === username) {


                rest.deleteFavouriteFood(url,session,username,favouriteFood, allFoods[i].id ,handleDeletedFoodResponse)

            }
        }


    });


};

function handleDeletedFoodResponse(body,session,username, favouritecurrencies){

        console.log('Done');


}





function handleSavedCurrenciesResponse(message, session, username) {
    var favouriteFoodResponse = JSON.parse(message);
    var allCurrencies = [];
    
    for (var index in favouriteFoodResponse) {
        var usernameReceived = favouriteFoodResponse[index].username;
        console.log(favouriteFoodResponse[index]);
        var favouritecurrencies = favouriteFoodResponse[index].favouritecurrencies;
        

        //Convert to lower case whilst doing comparison to ensure the user can type whatever they like
        if (username.toLowerCase() === usernameReceived.toLowerCase()) {
            //Add a comma after all favourite foods unless last one
            if(favouriteFoodResponse.length - 1) {
                allCurrencies.push(favouritecurrencies);
            }
            else {
                allCurrencies.push(favouritecurrencies + ', ');
            }
        }        
    }
    
    if(allCurrencies.length==0){
        session.send("%s, you dont have any currencies saved in your account", username);
    }else{
 // Print all favourite foods for the user that is currently logged in
    session.send("%s, your save currencies  are: %s", username, allCurrencies);        
    }
           
    
}