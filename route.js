module.exports = function(app) {
	var core = require("./controllers");

	app.route('/')
	.get(core.home)

	app.route('/login')
	.get(core.login)

	app.route('/signup')
	.get(core.signuppage)

	app.route('/auth-signup')
	.post(core.signUp)

	app.route('/auth-login')
	.post(core.authLogin)

	app.route('/failed')
	.get(core.loginFail)

	app.route('/auth/admin/events')
	.get(core.events)
	.post(core.createEvent)
	.put(core.updateEvent)
	.delete(core.deleteEvent)

	app.route('/auth/admin/types')
	.get(core.eventsType)
	.post(core.createEventType)
	.put(core.updateEventType)
	.delete(core.deleteEventType)

	app.route("/auth/admin/get-subscriptions")
	.get(core.getSubs)

	app.route("/user/subscriptions")
	.post(core.usersSubscription)

	app.route("/search")
	.get(core.search)

	app.route("/details")
	.get(core.details)

	app.route('/auth/logout')
	.get(core.logOut)
}