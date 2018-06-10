import { FlowRouter } from "meteor/kadira:flow-router"
import { Notifications } from '/imports/api/notifications/both/notificationsCollection'
import { Problems } from '/imports/api/documents/both/problemCollection'

import './header.html'

Template.header.onCreated(function() {
    this.searchFilter = new ReactiveVar(undefined);

	this.autorun(() => {
        this.subscribe('problems')

		if (Meteor.userId()) {
			this.subscribe('notifications')
        }

        let searchFilter = Template.instance().searchFilter.get();
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
    },
    'click .sidebar-toggler': function() {
        // toggle "sidebar-show" class to show/hide sidebar
        $('body').toggleClass("sidebar-lg-show")
    },
    'keyup #searchFilterHeader': function (event) {
        event.preventDefault();
        let query = $('#searchFilterHeader').val();
        let documentsIndex = $("div.documents-index")
        
        if (documentsIndex.length === 0) {
            let queryParam = { query: query }
            let path = FlowRouter.path('/', {}, queryParam)
            FlowRouter.go(path)
        }
    
        //clear filter if no value in search bar
        if (query.length < 1) {
            Blaze.getView($("div.documents-index")[0])._templateInstance.searchFilter.set(undefined)
        }
        
        if (query) {
            Blaze.getView($("div.documents-index")[0])._templateInstance.searchFilter.set(query)
        }
    }
})

Template.header.helpers({
	notificationsCount: () => Notifications.find({
    	userId: Meteor.userId(),
    	read: false
    }).count(),
    resolvedProblemsCount: () => Problems.find({
        createdBy: Meteor.userId(),
        status: 'ready for review'
    }).count()
})