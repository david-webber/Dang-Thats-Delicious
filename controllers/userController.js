const mongoose = require("mongoose");
const User = mongoose.model('User') //imported in start.js
const promisify = require('es6-promisify');

exports.loginForm = (req, res) => {
	res.render('login', {
		title: 'Login Form'
	})
}

exports.registerForm = (req, res) => {
	res.render('register', {
		title: 'Register'
	})
}


//create a middleware for registration
exports.validateRegister = (req, res, next) => {
	req.sanitizeBody('name')
	req.checkBody('name', 'You must supply a name!').notEmpty();
	req.checkBody('email', 'That Email is not valid!').isEmail();
	req.sanitizeBody('email').normalizeEmail({
		remove_dots: false,
		remove_extension: false,
		gmail_remove_subaddress: false
	})
	req.checkBody('password', 'Password cannot be blank!').notEmpty();
	req.checkBody('password-confirm', 'Confirmed Password cannot be blank!').notEmpty();
	req.checkBody('password-confirm', 'Oops! Your passwords do not match').equals(req.body.password);

	const errors = req.validationErrors();
	if (errors) {
		req.flash('error', errors.map(err => err.msg));
		res.render('register', {
			title: 'Register',
			body: req.body,
			flashes: req.flash()
		});
		return; //(stop fn running)
	}
	next(); // there were no errors
};


exports.registerUser = async (req, res, next) => {
	const user = new User({
		email: req.body.email,
		name: req.body.name
	});
	//.user.register is picked up from the passport package
	const registerWithPromise = promisify(User.register, User);
	await registerWithPromise(user, req.body.password);
	next(); //nextt will call authcontroller

}



exports.account = (req,res) =>{
	res.render('account', {title:'Edit your account'})
}

exports.updateAccount = async(req,res) => {
	//get data from posted form
	const updates = {
		name: req.body.name,
		email: req.body.email
	}
	//use mongo find one and update (query,user,options)
	const user = await User.findOneAndUpdate(
		{ _id: req.user._id},
		{ $set: updates}, //set the update options ontop of the data (if you are only updating a couple of pieces)
		{ new: true, runValidators: true, context: 'query'}
	);

	req.flash('success', 'Account updated');
	res.redirect('/account')
}