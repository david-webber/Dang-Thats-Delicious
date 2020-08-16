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


exports.editStore = async (req, res) => {
	//1. find the store by id.
	const id = req.params.id;
	const store = await Store.findOne({
		_id: id
	});

	//2. confirm owner of store (for edit)

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
	req.flash('seccuss', `Successfully updated <strong>${store.name}</strong>. <a href="/stores/${store.slug}">View Store ➡️</a>`);
	//2. redirect to the store and tell them it worked
	res.redirect(`/stores/${store._id}/edit`);
};