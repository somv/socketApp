var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('home/index', { title: 'Express' });
});

router.post('/config', function (req, res) {
   if(req.body.blockingTime != '') req.app.locals.blockingTime = req.body.blockingTime;
   if(req.body.noOfPlayers != '') req.app.locals.players = req.body.noOfPlayers;
   if(req.body.minPlayers != '') req.app.locals.minPlayer = req.body.minPlayers;
   if(req.body.maxPlayers != '') req.app.locals.maxPlayer = req.body.maxPlayers;
   res.redirect("/");
});

module.exports = router;
