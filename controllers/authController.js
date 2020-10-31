const passport = require('passport');
const crypto = require('crypto');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const promisify = require('es6-promisify')
const mail = require('../handlers/mail');

//create login middleware using passport middlweare for local login auth
exports.login = passport.authenticate('local', {
	failureRedirect: './login',
	failureFlash: 'Failed Login!',
	successRedirect: '/',
	successFlash: 'Login successful!'
})


exports.logout = (req,res) => {
	req.logout();
	req.flash('success', ' You are now logged out! 👋🏻');
	res.redirect('/');
}



exports.isLoggedIn = (req,res,next) => {
	//first check user is authenticated
	//will use passport to check is authenticated (.isAuthenticated is part of passport)
	if(req.isAuthenticated()) {
		next();
		return;
	}else{
		req.flash('error', 'You must be logged in to do that');
		res.redirect('/login');
	}
}


exports.forgot = async (req,res) => {
	//check user exists
	const user = await User.findOne({email:req.body.email});
	if(!user){
		req.flash('error','No account for that email address');
		return res.redirect('/login');
	}
	//set reset tokens and expiry on account
	//get secure random string (using crypto (built into node))
	user.resetPasswordToken = crypto.randomBytes(20).toString('hex');
	user.resetPasswordExpires = Date.now() + 3600000;
	await user.save();
	//send email with token
	const resetURL = `http://${req.headers.host}/account/reset/${user.resetPasswordToken}`;
	await mail.send({
		user:user,
		subject: 'Password reset',
		resetURL,
		filename: 'password-reset' //pug file
	});
	req.flash('success', 'You have been emailed a password reset link.');

	//redirect to login page after token has been sent
	res.redirect('/login');
}

exports.reset = async (req,res) => {
	const user = await User.findOne({
		resetPasswordToken:req.params.token,
		resetPasswordExpires: {$gt: Date.now()} // check the expiry date is greater than now.
	});
	if(!user){
		req.flash('error', 'Token invalid or expired');
		return res.redirect('/login');
	}
	//if user and token good, show reset password form
	res.render('reset',{title:'Reset your password'})
}

exports.confirmPasswords = (req,res,next) => {
	if(req.body.password == req.body['confirm-password']){
		next();
		return;
	}
	req.flash('error','password and confirm are not the same');
	res.redirect('back');
}

exports.update = async (req,res) => {
	//find user again to check token hasn't expired
	const user = await User.findOne({
		resetPasswordToken:req.params.token,
		resetPasswordExpires: {$gt: Date.now()}
	});
	if(!user){
		req.flash('error', 'Token invalid or expired');
		return res.redirect('/login');
	}
	//create a new method on user (through promisify)
	const setPassword = promisify(user.setPassword,user);
	await setPassword(req.body.password);

	//gett rid of expires and token
	user.resetPasswordExpires = undefined;
	user.resetPasswordToken = undefined;
	//save changes
	const updatedUser = await user.save();
	//log user in (through passportJs)
	await req.login(updatedUser);
	req.flash('success', '🕺 Nice! Your password has been reset! You are now logged in');
	res.redirect('/');
}