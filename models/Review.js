const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const reviewSchema = new mongoose.Schema({
	created: {
		type:Date,
		default:Date.now
	},
	author:{
		type: mongoose.Schema.ObjectId,
		ref: 'User', //ref user model
		required: 'You must supply an author!'
	},
	store:{
		type: mongoose.Schema.ObjectId,
		ref: 'Store', //ref store model
		required: 'You must supply a store!'
	},
	text:{
		type: String,
		required: 'your review must have text'
	},
	rating:{
		type:Number,
		min:1,
		max:5
	},
});


function autoPopulate(next){
	this.populate('author');
	next()
}

//hooks to run autopopulate on find and fineone
reviewSchema.pre('find', autoPopulate);
reviewSchema.pre('findOne', autoPopulate);

module.exports = mongoose.model('Review', reviewSchema);