import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

Messages = new Mongo.Collection('messages');

Template.messages.helpers({
    messages: function () {
        return Messages.find();
    }
});

Template.message.helpers({
    user: function(){
        if (this.username == null){
            return Meteor.users.findOne({_id: this.user}).username; 
        }else {
            return this.username;
        }
          
    },
    
    time: function(){
        return moment(this.timestamp).format('h:mm a');
    },
    
    botOrNot: function(){
        if (!Meteor.user()){
            return Spacebars.SafeString('message-row-bot');
        }else {
            try {
                if ( Meteor.users.findOne({_id: this.user}).username == Meteor.user().username){
                    return Spacebars.SafeString('message-row');
                }
                else{
                    return Spacebars.SafeString('message-row-bot');
                }
            }
            catch(err) {
                console.log("this message has no user linked to");
                return Spacebars.SafeString('message-row-bot');
            }
            
        }
        
    }
    
});

Template.messages.events({
    'keypress textarea': function(e, instance) {
        
        if (e.keyCode == 13) { //enter key pressed
            
            e.preventDefault();
            var value = instance.find('textarea').value;
            instance.find('textarea').value = '';
            var name = null;
            try {
                name = Meteor.userId();
            }
            catch(err) {
                console.log("User not logged in");
            }
            
            Messages.insert({
                message: value,
                timestamp: new Date(),
                user: name
             });
            
            // Message sent move scrollel to bottom
            var element = instance.find("ul");
            element.scrollTop = element.scrollHeight;
            Meteor.call('messageSent', value);
        }

    }
});

Accounts.ui.config({
   passwordSignupFields: "USERNAME_AND_OPTIONAL_EMAIL" 
});


