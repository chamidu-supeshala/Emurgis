import './header.html'

import { Notifications } from '/imports/api/notifications/both/notificationsCollection'

Template.header.onCreated(function() {
	this.autorun(() => {
		if (Meteor.userId()) {
			this.subscribe('notifications')
		}
	})
})

Template.header.events({
    'click .sign-in': function(event) {
        event.preventDefault();
        console.log("called")
    
        Meteor.loginWithGoogle({}, (err) => {
            if (err) { 
                notify("Invalid login", "error")
            return 
            }
            var redirectTo = window.last || '/'
            FlowRouter.go(redirectTo)
        })
    },
    'click .sign-out': (event) => {
        event.preventDefault()

        if (Meteor.userId()) {
            Meteor.logout()   
        }
    }
})

Template.header.helpers({
	notificationsCount: () => Notifications.find({
    	userId: Meteor.userId(),
    	read: false
    }).count()
})