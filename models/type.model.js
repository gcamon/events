'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var TypesSchema = new Schema ({
    name: {
        type: String,
        default: ""
    },

    event_group: [{
        type: String,
        ref: "Events"
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


mongoose.model('EventTypes', TypesSchema);