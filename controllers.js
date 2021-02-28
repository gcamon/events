"use strict";
require('dotenv').config();
var mongoose = require("mongoose");
var ObjectId = mongoose.Types.ObjectId;
var Events = mongoose.model('Events');
var Admin = mongoose.model("Admin");
var EventTypes = mongoose.model("EventTypes");
var Users = mongoose.model("Users");
var passport = require("passport");
var moment = require("moment");
//var moment = require('moment');
var LocalStrategy = require("passport-local").Strategy;
var salt = require('./salt');
var fs = require('fs');
var uuid = require('uuid');

var unauthorized = "unauthorized access.";

passport.use('signup', new LocalStrategy({
	usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true 
},
function(req,email,password,done){

	process.nextTick(function(){
		Admin.findOne({email:email},function(err,user){
			if(err) return done(err);
			if(user){
				return done(null, false, req.flash('signupMessage', 'Email has already been used please find another one'));	
			} else {
				var user = new Admin(req.body);			
				user.password = salt.createHash(password);
				user.save(function(err,info){
					if(err) throw err;
					return done(null,user);
				})
			}
		})
	})
}))



passport.use('user-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function (req, email, password, done) {           

    // find a user whose email is the same as the forms email
    // we are checking to see if the user trying to login already exists;

    var criteria = {email: email,admin: true};//(req.body.isPhoneNumber) ? {phone: username} : {email: username};

    Admin.findOne(criteria, function(err, user) {
        
        // if there are any errors, return the error before anything else
        if (err) {
            return done(err);
        }
        // if no user is found, return the message
        if (!user) {
            return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
        }
        // if the user is found but the password is wrong
        if (!salt.isValidPassword(user,password)) {
            return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
        }
        
        //req.session.user = user;
        // all is well, return successful user
        return done(null, user);
    });

}));


exports.home = function(req,res) {
	Events.find({deleted: false})
	.sort('-created')
	.exec(function(err,events){
		res.render("index",{events: events,moment: moment});
	})	
}

exports.events = function(req,res) { 
	if(req.user){
		EventTypes.findById(req.query.id)
		.populate({path:'event_group',model: 'Events'})
		.exec(function(err,events){
			if(err){
				res.end("Internal server error: 504")
			} else if(!events) {
				res.redirect("/auth/admin/types");
			} else {
				EventTypes.find({deleted: false})
				.exec(function(err,eventTypes){
					if(err){
						res.end("Internal server error: 504")
					} else {
						res.render('events',{evt: events,types: eventTypes,moment: moment})
					}
				})
			}
		})
	} else {
		res.redirect('/login')
	}
}

exports.createEvent = function(req,res){
	if(req.user){
		var evt = new Events(req.body)
		evt.save(function(err,info){
			if(err) throw err;
			saveToType()
		})

		function saveToType() {
			EventTypes.findById(req.body.id)
			.exec(function(err,type){
				if(err) throw err;
				type.event_group.push(evt._id)
				type.save(function(err,info){
					if(err) throw err;
					res.redirect("/auth/admin/events")
				})
			})
		}
	} else {
		res.redirect('/login')
	}
}

exports.updateEvent = function(req,res){
	if(req.user){
		Events.findById(req.query.id)
		.exec(function(err,evt){
			if(err){
				res.end("Internal server error: 504")
			} else if(evt){
				evt.name = req.query.name || evt.name;
				evt.description = req.query.description || evt.description;
				evt.date = req.query.date || evt.date;
				evt.save(function(err,info){
					if(err) throw err;
					res.json({status: true, message: "Update successfully"});
				})
			} else {
				res.json({status: false, message: "Error occurred"});
			}
		})
		
	} else {
		res.end(unauthorized)
	}
}

exports.deleteEvent = function(req,res){
	if(req.user){
		Events.findById(req.query.id)
		.exec(function(err,evt){
			if(err){
				res.end("Internal server error: 504")
			} else if(evt) {
				evt.remove(function(err,info){
					if(err) throw err;
					res.json({status: true, message: "Deleted successfully"});
				})
			} else {
				res.json({status: false, message: "Error occurred"});
			}
		})
	} else {
		res.end(unauthorized)
	}
}

exports.eventsType = function(req,res) { 
	if(req.user){
		EventTypes.find({deleted: false})
		.exec(function(err,eventTypes){
			if(err){
				res.end("Internal server error: 504")
			} else {
				res.render('admin',{evt: eventTypes})
			}
		})
	} else {
		res.redirect('/login')
	}
}

exports.createEventType = function(req,res){
	if(req.user){	
		EventTypes.findOne({name: req.body.name})
		.exec(function(err,evtType){
			if(err) {
				res.end("Internal server error: 504");
			} else {
				if(evtType){
					res.json({status: true,message: "Event type already exist"})
				} else {
					var evts = new EventTypes(req.body)
					evts.save(function(err,info){
						if(err) {
							res.end("Internal server error: 504")
						} else {
							res.redirect("/auth/admin/types")
						}

					})

				}
			}
		})
	} else {
		res.end(unauthorized)
	}
}

exports.updateEventType = function(req,res){
	if(req.user){
		EventTypes.findById(req.query.id)
		.exec(function(err,evtype){
			if(err) {
				res.end("Internal server error: 504");
			} else if(evtype){		
				evtype.name = req.query.name;		
				evtype.save(function(err,inf){
					if(err) throw err;
					res.json({status: true, message: "Recieved with thanks"})
				})
			} else {
				res.json({status: false, message: "Error occurred"});
			}
		});		
	} else {
		res.end(unauthorized)
	}
}

exports.deleteEventType = function(req,res){
	if(req.user){
		EventTypes.findById(req.query.id)
		.exec(function(err,evtype){
			if(err) {
				res.end("Internal server error: 504");
			} else if(evtype) {				
				evtype.remove(function(err,inf){
					if(err) throw err;
					res.json({status: true, message: "Recieved with thanks"})
				})
			} else {
				res.json({status: false, message: "Error occurred"});
			}
		});		
	} else {
		res.end(unauthorized)
	}
}

exports.getSubs = function(req,res){
	if(req.user){
		Events.findById(req.query.id)
		.populate({path: "subscriptions",model: "Users"})
		.exec(function(err,users){
			if(err) {
				res.end("Internal server error: 504");
			} else if(users){
				res.json({status:true,sub: users.subscriptions})
			} else {
				res.json({status: false, message: "Error occurred",data:[]});
			}
		})
		
	} else {
		res.end(unauthorized)
	}
}

exports.usersSubscription = function(req,res){		
	var evtId = req.body.id;
	delete req.body.id;
	var user = new Users(req.body)
	user.save(function(err,info){
		if(err) {
			res.end("Internal server error: 504");
		} else {
			Events.findById(evtId)
			.exec(function(err,evt){
				if(err) throw err;
				evt.subscriptions.push(user._id)
				evt.save(function(err,info){
					if(err) throw err;
					res.render('comfirmation',{evt: evt})
				})
			})
		}

	})
}

exports.search = function(req,res){
	var str = new RegExp(req.query.qstr.replace(/\s+/g,"\\s+"), "gi");              
  var criteria1 = { name : { $regex: str, $options: 'i' },deleted: false};
  var criteria2 = { description : { $regex: str, $options: 'i' },deleted:false};
  var resultArr = [];
  Events.find(criteria1).
  exec(function(err,evt1){
  	if(err) throw err;
  	Events.find(criteria2).
	  exec(function(err,evt2){
	  	var elemPos;
	  	if(err) throw err;
	  	res.render("search-result",{events: evt1, events2: evt2, moment: moment,name: req.query.qstr})
	  })
  })
	
}

exports.details = function(req,res){
	Events.findById(req.query.evtId)
	.exec(function(err,evt){
		if(err) {
			res.end("Internal server error: 504");
		} else if(evt){
			res.render("details",{evt: evt,moment: moment})
		} else {
			res.end("Event not found! 404 Error")
		}
	})
}

exports.login = function(req,res) {
   res.render('login')
}	

exports.authLogin = passport.authenticate('user-login', {
  successRedirect : '/auth/admin/types', // redirect to the secure profile section
  failureRedirect : '/failed', // redirect back to the signup page if there is an error
  failureFlash : true // allow flash messages
})

exports.loginFail = function(req,res){
	res.redirect('/login')
}

exports.signuppage = function(req,res){
	res.render('signup')
}

exports.signUp = function(req,res,next){	
	passport.authenticate('signup', function(err, user, info) {   
		if (err) {
		  return next(err); // will generate a 500 error
		} else {			
			//res.json({error: false, message: "Sign up was successfully done! Please login."})
			res.redirect("/login")
		}	
	})(req, res, next)
}

exports.logOut = function(req,res){
	req.logout();
  res.redirect('/login');
}








