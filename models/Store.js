const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const slug = require('slugs');

const storeSchema = new mongoose.Schema({
	name: {
		type: String,
		trim: true,
		//instead of setting to true, pass error msg back.
		required: 'Please enter a store name!'
	},
	slug: String,
	description: {
		type: String,
		trim: true,
	},
	//array of strings
	tags: [String],
	created: {
		type: Date,
		default: Date.now
	},
	location: {
		type: {
			type: String,
			default: 'Point'
		},
		coordinates: [{
			type: Number,
			required: 'You must supply coordinates'
		}],
		address: {
			type: String,
			required: 'You must supply an address!'
		}
	},
	photo: String,
	author: {
		type: mongoose.Schema.ObjectId,
		ref: 'User',
		required: 'You must supply an author'
	}
}, {
	toJSON: {virtuals: true},
	toObject: {virtuals: true} //show virtual fields, good for debugging
});

//Define indexes on database
storeSchema.index({
	name: 'text',
	description: 'text'
});


storeSchema.index({location: '2dsphere'});


//set a slug before save, when name is modified
storeSchema.pre('save', async function (next) {
	if (!this.isModified('name')) {
		next();
		return;
	}
	this.slug = slug(this.name);
	//check if there are any other stores with the same slug
	//find other slugs with the same name ie store, store-1, store-2
	const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i')
	//regexp -> starts with slug optional - number at end
	const storesWithSlug = await this.constructor.find({
		slug: slugRegEx
	});
	//this.constructor will be the same as Store.find, but it does not exist yet.
	if (storesWithSlug.length) {
		this.slug = `${this.slug}-${storesWithSlug.length + 1}`;
	}

	next();
	//TODO make unique slugs
})


storeSchema.statics.getTagsList = function () {
	return this.aggregate([
		//google mongodb aggregate operators for more options / info
		{
			//unwind will split each 'tag' into it's own store (if one store had two tags, you will get two store instances back from the database, easy to count the tags up from this)
			$unwind: '$tags'
		},
		{
			//group everything based on tab  fields and create a new count, which will increment by '1' in this instance (basically add for the uniqid (tag))
			$group: {
				_id: '$tags',
				count: {
					$sum: 1
				}
			}
		},
		{
			//sort by the count property (asc or desc (1,-1))
			$sort: {
				_id: 1
			}
		}
	]);
}

storeSchema.statics.getTopStores = function(){
	//aggregate is a query function (like, .find, but can do more);
	return this.aggregate([
		//lookup stores, and populate their reviews. (like a join)
		{$lookup: {from: 'reviews', localField: '_id', foreignField: 'store', as: 'reviews'}},
		//filter for stores that only have 2 or more reviews
		// reviews.0 would be the 0 index, reviews.1 is the 1 index (so filter if there are more than one)
		{$match: {'reviews.1': {$exists:true}}},
		// add the average reviews field
		{$project: {
			//use mongo avg to add an avergaerating field
			averageRating: { $avg: '$reviews.rating' },
			//project will replace the existing data with just the average reviews. on another version of mongo (>3.4 and not on atlas tier) you could use $add instead. We are sticking with project and will manually add the other required fields.
			photo: '$$ROOT.photo', //use $$root to grab the original values back
			name: '$$ROOT.name',
			reviews: '$$ROOT.reviews',
			slug: '$$ROOT.slug',
		}},
		//sort by new (average) highest first
		{$sort: {averageRating: -1}}, //highest to lowest
		//limit to 10 results
		{$limit: 10},
	]);
}


//go pick up the reviews (like a join)
// fin reviews where store _id property === reviews store property
storeSchema.virtual('reviews', {
	ref: 'Review', //which model to link //join on local field == foreign field
	localField: '_id', //  (which field on the store?)
	foreignField: 'store' // which field on the review?
})


function autoPopulate(next){
	this.populate('reviews');
	next();
}

//hooks to run autopopulate on find and fineone
storeSchema.pre('find', autoPopulate);
storeSchema.pre('findOne', autoPopulate);


module.exports = mongoose.model('Store', storeSchema);