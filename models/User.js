const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
const md5 = require('md5');
const validator = require('validator');
const mongodbErrorHandler = require('mongoose-mongodb-errors');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
	email: {
		type: String,
		unique: true,
		lowercase: true,
		trim: true,
		validate: [validator.isEmail, 'Invalid Email Address'],
		required: 'Please supply an email address'
	},
	name: {
		type: String,
		required: 'Please supply a name',
		trim: true
	},
	resetPasswordToken: String,
	resetPasswordExpires: Date,
	hearts: [
		//expecting id, related to store
		{type: mongoose.Schema.ObjectId, ref: 'Store'}
	],
});

userSchema.virtual('gravatar').get(function(){
	const hash = md5(this.email);
	return `https://gravatar.com/avatar/${hash}?s=200`;
})

//handle password/.sessions etc with passportlocalmongoose
userSchema.plugin(passportLocalMongoose, {
	usernameField: 'email'
});
//convert ugly mongo errors into nice errers
userSchema.plugin(mongodbErrorHandler);
module.exports = mongoose.model('User', userSchema);