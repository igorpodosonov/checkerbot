//TURN OFF ADBLOCK FOR PROPER WORK

//MAKE SHURE YOU DISABLED CHROME "NETWORK HISTORY" 
//BY CLICKING ⌘+E OR "STOP RECORDING NETWORK LOG"

var howManyTimes = 1;
var pageNumber = 0;
var errorCount = 0;
var lastErrorSendTime = 0;
var notificationPauseTime = 60 * 30;

var canonicalData;

//People IDs
var igor = 339398505;
var vlad = 266337099;

//Pepole IDs array
var chatIds = [igor, vlad];

//Name of the computer if you run
//this scritp on if you use multiple 
//devices, if not, just live it empty
var conmputerName = "💻 On Vlad-PC";

//Notifications
var successMessage = "✅ Looks like regestration is opened! ";
var errorMessage = "⚠️ Some error occured on the page. Status text: ";

setTimeout(imitateClick, 3000);

function checkForRegestration(){

	result = $('ul.smartColumns').html().trim();

	if(result == ""){
		//If falil return false
		return false;
	} else {
		//If regestration opened, return true
		return true;
	}
	
}

function checkIfAnswerDifferent(answer){
	if(answer != canonicalData){
		return true;
	} else {
		return false;
	}
}

function imitateClick() {
	$('.table td.event-styled:eq(' + pageNumber + ')').trigger("click");

	pageNumber++;

	if(pageNumber == 7){
		pageNumber = 0;
	}

}

function sendNotification(text){
	chatIds.forEach(function(id, i, chatIds) {
	  url = "https://api.telegram.org/{APIKEY}/sendMessage";

	  $.get(url, {chat_id : id, text: text }, function(data, status) { });
    });
}

$.ajaxSetup({
    error: function(event, request, settings){

    	if( errorCount == 0 ) {
        	
        	sendNotification(errorMessage + event.statusText + " " + conmputerName);

        	lastErrorSendTime = Math.floor(Date.now() / 1000);

        	errorCount++;

    	} else if( Math.floor(Date.now() / 1000) - lastErrorSendTime >= notificationPauseTime ){

        	sendNotification(errorMessage + event.statusText + " " + conmputerName);

        	lastErrorSendTime = Math.floor(Date.now() / 1000);	    		

    	}

    	setTimeout(imitateClick, 300);

    },
    success: function(data, textStatus){

    	if(typeof canonicalData == 'undefined') {
    		canonicalData = data;
    	}

    	setTimeout(function(){
	    	//check for regestration 
	    	if((checkForRegestration() || checkIfAnswerDifferent(data)) && data != ""){
				//Notify about regestration status
				sendNotification(successMessage + conmputerName);
	    	} else {
    			//imitate click if registration is not opened
    			imitateClick();
    		}
		}, 300);

    }
});