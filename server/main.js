import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  Messages.rawCollection().drop();
  nrOfMessages = Messages.find().count();
});

Messages = new Mongo.Collection('messages');
nrOfMessages = Messages.find().count();


Meteor.methods({
  messageSent:function (message) {
      
    // Require apiai to communicate with API.ai  
    var apiai = require('apiai');
 
    var app = apiai("973358090a8a43b6a627f103379fda0f"); 
    var request = app.textRequest(message, {sessionId: '<unique session id>'});
    
    // On-request do ->
    request.on('response', Meteor.bindEnvironment(function(response) {
      var answer = "";
      var command = response.result.fulfillment.speech.split(" ");  
      
      
      switch(command[0]) {
        case "CALCULATE":
            var method = response.result.parameters.Method;
            var nr1 = parseInt(response.result.parameters.number);
            var nr2 = parseInt(response.result.parameters.number1);
            
            switch(method) {
                case "+":
                case "sum":
                case "plus":
                case "add":
                    answer = nr1+nr2;
                    sendMessageAsBot("If im right. But I am always right. It is :" + answer);
                    break;
                case "-":
                case "minus":
                    answer = nr1-nr2;
                    sendMessageAsBot("Subtraction is not my cup of tea, but is it? : " + answer);
                    break;
                case "divide":
                case "/":
                    answer = nr1/nr2;
                    sendMessageAsBot("Aaah... that I know: " + answer);
                    break;
                case "*":
                case "times":
                case "multiply":
                    answer = nr1 * nr2;
                    sendMessageAsBot("Hmm... really?? it's : " + answer);
                    break;
                default:
                    console.log(method);
                    answer="Sorry my head hurts. Is it 5??"
                    sendMessageAsBot(answer);
                    break;
            }
            break;
        case "TRANSLATE":
            var translate = require('node-google-translate-skidz');
            var textSource = message.split("\"");
            if (textSource.length >= 1){
                console.log(textSource);
                translate({
                    text: textSource[1],
                    source: 'auto',
                    target: 'en'
                }, Meteor.bindEnvironment(function(result) {
                    answer = "Translation for given string is : " + result.translation;
                    sendMessageAsBot(answer);
            }));
            }else{
                answer = "To translate estonian sentences to english write something like \"translate \"tere\"";
            }
            break;
        case "CURRENCY":
            answer = "Not jet implemented."
            sendMessageAsBot(answer);  
            break;
        default:
            console.log("I'm in DEFAULT!!")  
            answer = response.result.fulfillment.speech;
            sendMessageAsBot(answer);  
            break;
        }
    }));
      
    request.on('error', function(error) {
        console.log(error);
    });
 
      request.end();  
    },
    
  
});

function sendMessageAsBot(message){
    Messages.insert({
        message: message,
        timestamp: new Date(),
        username: 'gotoAndBot'
    });      
  }
