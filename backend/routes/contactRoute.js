const express = require("express");
const router = express.Router();
const { contactCtrl } = require("../controllers/contactCtrl");

//user/contact-us
router.post("/contact-us", contactCtrl);

module.exports = router;
