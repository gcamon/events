'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var EventSchema = new Schema ({
    name: {
        type: String,
        default: ""
    },

    description: {
        type: String,
        default: ""
    },

    date: {
        type: Date,
        default: Date.now
    },

    subscriptions: [{
        type: String,
        ref: "Users"
    }],

    created: {
        type: Date,
        default: Date.now
    },

    deleted: {
        type: Boolean,
        default: false
    },

})


mongoose.model('Events', EventSchema);