const express = require("express");
const router = express.Router();
const storeController = require('../controllers/storeController');
const {
	catchErrors
} = require('../handlers/errorHandlers');

//routes are wrapped inside the catchErrors middleware so all errors will be caught there instead of having to write new try ctach blocks on all aync calls.

router.get("/", catchErrors(storeController.getStores));
router.get("/stores", catchErrors(storeController.getStores));
router.get("/add", storeController.addStore);

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

module.exports = router;