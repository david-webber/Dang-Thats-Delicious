const mongoose = require("mongoose");
const Store = mongoose.model('Store');
const multer = require("multer");
const jimp = require("jimp");
const uuid = require("uuid");



const multerOptions = {
	storage: multer.memoryStorage(),
	fileFilter(req, file, next) {
		const isPhoto = file.mimetype.startsWith('image/');
		if (isPhoto) {
			next(null, true);
		} else {
			next({
				message: "That file type isn't allowed"
			}, false);
		}
	}
};

exports.homePage = (req, res) => {
	res.render("index");
};

exports.addStore = (req, res) => {
	res.render("editStore", {
		title: "Add Store 💩",
	});
};


exports.upload = multer(multerOptions).single('photo');

exports.resize = async (req, res, next) => {
	// check if there is no new file to resize
	if (!req.file) {
		next(); //skip to next middleware (create/update)
		return
	}
	//get extension of file
	const extension = req.file.mimetype.split('/')[1];
	//set the photo name to uniq + ext (save to biody so its saved in DB)
	req.body.photo = `${uuid.v4()}.${extension}`;
	//now we resize
	const photo = await jimp.read(req.file.buffer);
	// width 800 / autoheight
	await photo.resize(800, jimp.AUTO);
	//save to server
	await photo.write(`./public/uploads/${req.body.photo}`);
	//once we have written photo to filesystem - keep going
	next();
}

exports.createStore = async (req, res) => {
	//get the logged in user for saving in stores author field
	req.body.author = req.user._id;
	const store = await (new Store(req.body)).save();
	req.flash('success', `Successfully Created ${store.name}. Care to leave a review?`);
	res.redirect(`/store/${store.slug}`);
};


exports.getStores = async (req, res) => {
	//query DB for list of all stores
	const stores = await Store.find();
	//render all stores
	res.render('stores', {
		title: 'Stores',
		stores
	});
}


const confirmOwner = (store,user) => {
	if(!store.author.equals(user._id)){
		throw Error('you must own the store to edit it!');
	}
}

exports.editStore = async (req, res) => {
	//1. find the store by id.
	const id = req.params.id;
	const store = await Store.findOne({
		_id: id
	});

	//2. confirm owner of store (for edit)
	confirmOwner(store, req.user);
	//3. render out the edit form for updates
	res.render('editStore', {
		title: `Edit ${store.name}`,
		store,
	})
}

exports.updateStore = async (req, res) => {
	//set location to be a point.
	req.body.location.type = 'Point';


	//1 find and update the store
	const store = await Store.findOneAndUpdate({
		_id: req.params.id
	}, req.body, {
		new: true, // return the new store store instead of old...
		runValidators: true, //make sure data passed is valid from model (created in store.js)
	}).exec();
	req.flash('success', `Successfully updated <strong>${store.name}</strong>. <a href="/store/${store.slug}">View Store ➡️</a>`);
	//2. redirect to the store and tell them it worked
	res.redirect(`/stores/${store._id}/edit`);
};

exports.getStoreBySlug = async (req, res, next) => {
	const store = await Store.findOne({
		slug: req.params.slug
	}).populate('author') //.populate will get the rest of the author details from the id.
	if (!store) {
		return next();
	}
	res.render('store', {
		store,
		title: store.name
	})
}


exports.getStoresByTag = async (req, res) => {
	const tag = req.params.tag;
	const tagQuery = tag || {
		$exists: true
	}
	//get the tags
	const tagsPromise = Store.getTagsList();
	//get the stores with this tag. (picked up from request)
	const storesPromise = Store.find({
		tags: tagQuery
	})

	//get both the tags and the stores with promise all (desctructure into tags and stores)
	const [tags, stores] = await Promise.all([tagsPromise, storesPromise]);

	res.render('tags', {
		tags,
		title: 'Tags',
		tag,
		stores
	});
};


exports.searchStores = async (req,res) => {
	// res.json(req.query);
	//find the stores by looking up the text index
	const stores = await Store
	//find stores that match by query param (searching text index)
	.find({
		$text:{
			$search: req.query.q
		}
	},{
		//Add (prooject) score field to results, scored against text frequency
		score: {$meta : 'textScore'} //score results by query
	})
	//sort results by score field
	.sort(
		{score:
			{$meta: 'textScore'}
		})
	//limit to 5 results
	.limit(5)
	res.json(stores);
}