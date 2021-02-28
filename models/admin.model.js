'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;



var AdminSchema = new Schema ({
    firstname: {
        type: String,
        default: ""
    },

    lastname: {
        type: String,
        default: ""
    },

    phone: {
        type: String,
        default: ""
    },

    /*events: [{
        type: String,
        ref: 'Events'
    }],*/

    email: {
        type: String,
        default: ""
    },

    city: {
        type: String,
        default: "Umuahia"
    },

    username: {
        type: String,
    },

    password: {
        type: String,
    },

    created: {
        type: Date,
        default: Date.now
    },

    deleted: {
        type: Boolean,
        default: false
    },

    admin: {
        type: Boolean,
        default: true
    }

})


mongoose.model('Admin', AdminSchema);