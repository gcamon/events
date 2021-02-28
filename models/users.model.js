'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var EventUsersSchema = new Schema ({
    name: {
      type: String,
      default: ""
    },

    address: {
      type: String,
      default: ""
    },

    phone: {
      type: String,
      default: ""
    },

    email: {
      type: String,
      default: ""
    },

    created: {
      type: Date,
      default: Date.now
    },

    deleted: {
      type: Boolean,
      default: false
    },

})


mongoose.model('Users', EventUsersSchema);