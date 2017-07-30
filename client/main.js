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
                return Spacebars.SafeString('message-row-bot');
            }
            
        }
        
    }
    
});

Template.messages.events({
    'keypress textarea': function(e, instance) {
        
        if (e.keyCode == 13) { //enter key pressed
            e.preventDefault();
            var name = Meteor.userId();
            if(name == null){
                Messages.insert({
                    message: "Please log in, before you ask anything",
                    timestamp: new Date(),
                    username: "gotoAndBot"
                });
            }else{
                name = Meteor.userId();
                var value = instance.find('textarea').value;
                instance.find('textarea').value = '';
                Messages.insert({
                    message: value,
                    timestamp: new Date(),
                    user: name
                });
                Meteor.call('messageSent', value);
            }
            // Message sent move scrollbar to bottom
            var element = instance.find("ul");
            element.scrollTop = element.scrollHeight;
        }

    }
});

Accounts.ui.config({
   passwordSignupFields: "USERNAME_AND_OPTIONAL_EMAIL"
});


