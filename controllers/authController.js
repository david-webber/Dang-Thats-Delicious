const passport = require('passport');

//create login middleware using passport middlweare for local login auth
exports.login = passport.authenticate('local', {
	failureRedirect: './login',
	failureFlash: 'Failed Login!',
	successRedirect: '/',
	successFlash: 'Login successful!'
})