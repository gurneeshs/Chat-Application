const express = require("express");
const router = express.Router();
const {getLogin, login, logout} = require("../controller/loginController");
const decoratehtmlResponse = require("../middlewares/commons/decoratehtmlResponse");
const { doLoginValidators, doLoginValidationHandler } = require("../middlewares/login/loginValidator");
const { redirectLoggedIn } = require("../middlewares/commons/checkLogin");

const page_title = "Login"

// Login Page
router.get("/",decoratehtmlResponse(page_title),redirectLoggedIn, getLogin);

router.post("/",decoratehtmlResponse(page_title),doLoginValidators,doLoginValidationHandler,login);

// Logout
router.delete("/", logout);

module.exports = router;