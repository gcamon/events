"use strict";

//start db connections
require('./mongoose'); 

require('./models/admin.model');

require('./models/events.model');

require('./models/type.model');

require('./models/users.model');


require('./controllers');


var express = require('express'),       
  config = require('./config'),    
  route = require('./route'),
  app = express(),
  //router = express.Router(),
  http = require('http').Server(app),
  //moment = require('moment'),
  port = process.env.PORT || 3004;


var options = {
  debug: true
}

http.listen(port,function(){
    console.log('listening on *: ' + port);
});


config(app);
route(app)
 





