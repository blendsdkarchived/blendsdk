var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function(req, res, next) {
    res.render("index", { title: "Express" });
});

router.get("/error", function(req, res) {
    res.status(500).send("Internal Server Error");
});

router.get("/ping", function(req, res) {
    res.send("pong");
});

module.exports = router;
