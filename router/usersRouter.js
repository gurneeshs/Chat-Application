const express = require("express");
const router = express.Router();
const {getUser, addUser, removeUser} = require("../controller/userController");
const decoratehtmlResponse = require("../middlewares/commons/decoratehtmlResponse");
const avatarUpload = require("../middlewares/users/avatarUpload");
const { addUserValidators, addUserValidationHandler } = require("../middlewares/users/userValidator");
const {checkLogin} = require("../middlewares/commons/checkLogin");



// User Page
router.get("/", decoratehtmlResponse("Users"),checkLogin, getUser);

router.post("/", avatarUpload,addUserValidators,addUserValidationHandler,addUser);

router.delete("/:id",removeUser);

module.exports = router;