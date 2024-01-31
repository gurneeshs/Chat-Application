const express = require("express");
const router = express.Router();
const {getInbox} = require("../controller/inboxController");
const decoratehtmlResponse = require("../middlewares/commons/decoratehtmlResponse");
const {checkLogin} = require("../middlewares/commons/checkLogin");


// Login Page
router.get("/",decoratehtmlResponse("Inbox"), checkLogin, getInbox);

module.exports = router;