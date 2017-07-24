import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  Messages.rawCollection().drop();
  nrOfMessages = Messages.find().count();
});

Messages = new Mongo.Collection('messages');
nrOfMessages = Messages.find().count();


Meteor.methods({
  messageSent:function (message) {
    var apiai = require('apiai');
 
    var app = apiai("973358090a8a43b6a627f103379fda0f"); 
    var request = app.textRequest(message, {
        sessionId: '<unique session id>'
    });

    request.on('response', Meteor.bindEnvironment(function(response) {
      var answer = "";
      var command = response.result.fulfillment.speech.split(" ");  
    
      console.log(command);
      console.log(command == "CALCULATE");    
      switch(command[0]) {
        case "CALCULATE":
            console.log("I'm in CALCULATE!");
            var method = response.result.parameters.Method;
            var nr1 = parseInt(response.result.parameters.number);
            var nr2 = parseInt(response.result.parameters.number1);
            
            switch(method) {
                case "+":
                case "sum":
                case "plus":
                case "add":
                    answer = nr1+nr2;
                    break;
                case "-":
                case "minus":
                    answer = nr1-nr2;
                    break;
                case "divide":
                case "/":
                    answer = nr1/nr2;
                    break;
                case "*":
                case "times":
                case "multiply":
                    answer = nr1 * nr2;
                    break;
                default:
                    console.log(method);
                    console.log("DEFAULT");
                    answer="Sorry my head hurts. Is it 5??"
                    break;
            }
            break;
        case "TEST":
            console.log("I'm in EMPTY!");
            var translate = require('node-google-translate-skidz');
 
            translate({
                text: 'tere vana kere',
                source: 'auto',
                target: 'en'
            }, function(result) {
                console.log(result);    
            });  
            break;
        default:
            console.log("I'm in DEFAULT!!")  
            answer = response.result.fulfillment.speech;
            break;
        } 
      Messages.insert({
        message: answer,
        timestamp: new Date(),
        username: 'gotoAndBot'
      });
    }));
      
    request.on('error', function(error) {
        console.log(error);
    });
 
      request.end();  
    }  
});

