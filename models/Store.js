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
});

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

module.exports = mongoose.model('Store', storeSchema);