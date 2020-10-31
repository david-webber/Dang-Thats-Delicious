const express = require("express");
const router = express.Router();
const storeController = require('../controllers/storeController');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const {
	catchErrors
} = require('../handlers/errorHandlers');

//routes are wrapped inside the catchErrors middleware so all errors will be caught there instead of having to write new try ctach blocks on all aync calls.

router.get("/", catchErrors(storeController.getStores));
router.get("/stores", catchErrors(storeController.getStores));
router.get("/add", authController.isLoggedIn, storeController.addStore);


router.post("/add",
	storeController.upload,
	catchErrors(storeController.resize),
	catchErrors(storeController.createStore)
);

router.post("/add/:id",
	storeController.upload,
	catchErrors(storeController.resize),
	catchErrors(storeController.updateStore)
);

router.get("/stores/:id/edit", catchErrors(storeController.editStore));


router.get("/store/:slug", catchErrors(storeController.getStoreBySlug))

router.get("/tags", catchErrors(storeController.getStoresByTag));
router.get("/tags/:tag", catchErrors(storeController.getStoresByTag));

// Do work here
// router.get("/", (req, res) => {
//   // res.send("Hey! It works!");
//   // res.render("hello", {
//   //   name: "Dave",
//   //   dog: "Snickers",
//   //   search: req.query.search,
//   //   title: 'food'
//   // });
// });

// router.get("/reverse/:name", (req, res) => {
//   const reverse = [...req.params.name].reverse().join("");
//   res.send(reverse);
// });

router.get('/login', userController.loginForm);
router.post('/login', authController.login);

router.get('/register', userController.registerForm);

router.post('/register',
	// 1.validate the Data
	userController.validateRegister,
	// 2.register the user
	userController.registerUser,
	// 3.log the user in with the authcontroller
	authController.login
);


router.get('/logout', authController.logout);


router.get('/account', authController.isLoggedIn, userController.account);
router.post('/account', authController.isLoggedIn, catchErrors(userController.updateAccount));

router.post('/account/forgot', catchErrors(authController.forgot));

router.get('/account/reset/:token', catchErrors(authController.reset))
router.post('/account/reset/:token',
authController.confirmPasswords,
catchErrors(authController.update))

/*
API
*/

router.get('/api/search', catchErrors(storeController.searchStores));

module.exports = router;