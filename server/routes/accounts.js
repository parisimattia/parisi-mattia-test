var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var jwt = require('jwt-simple');
var Account = require('../models/Account');
var Transaction = require('../models/Transaction');
var authorizations = require('../controllers/authorizations');
var secret = 'xxx';

// CREATE AN ACCOUNT
router.post('/signup', function(req, res) {
    var account = new Account();

    account.name = req.body.name;
    account.surname = req.body.surname;
    account.password = bcrypt.hashSync(req.body.password, 10);
    account.email = req.body.email;
    account.iban = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    account.balance = 1000;

    account.save(function(err, accountCreated) {
        if (err) return res.status(400).json(err);
        res.status(201).json(accountCreated);
    })
})

// LOGIN IN YOUR ACCOUNT
router.post('/login', function(req, res) {
    Account.findOne({email: req.body.email}, function(err, account){
        if (account === null) {
            return res.status(404).json({message: 'User not found'})
        } else if (bcrypt.compareSync(req.body.password, account.password)) {
            var token = jwt.encode(account._id, secret);
            return res.json({token: token});
        } else {
            return res.status(401).json({message: 'password not valid'});
        }

    })

})

// SEE MY ACCOUNT
router.get('/me', authorizations.auth, function(req, res) {
    res.json(req.account);
});

// CREATE A NEW TRANSACTION
router.post('/transactions',  authorizations.auth, authorizations.byIban, authorizations.checkCredit, function(req, res){
  var trans = new Transaction();

  trans.account1 = req.account.iban;
  trans.account2 = req.body.iban;
  trans.amount = req.body.amount;

  req.account.balance = parseInt(req.account.balance) - parseInt(req.body.amount);
  req.account2.balance = parseInt(req.account2.balance) + parseInt(req.body.amount);

  trans.save(function (err, savedTrans) {
    if (err) return res.status(500).json(err);
    req.account.transactions.push(savedTrans)
    req.account2.transactions.push(savedTrans)
    req.account.save();
    req.account2.save();
    return res.status(201).json(savedTrans)
  })


})

// GET PUSHED TRANSACTIONS
router.get('/transactions/send', authorizations.auth, function(req, res) {

  Account.findById(req.account._id)
  .populate("transactions")
  .exec(function(err, trans){
        if (err) return res.status(500).json({message: err});
        if (!trans) return res.status(404).json({message: 'U have not transactions'});
        return res.status(200).json(trans)

    })
});


module.exports = router;
