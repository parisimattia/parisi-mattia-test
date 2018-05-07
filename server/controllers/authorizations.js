var jwt = require('jwt-simple');
var Account = require('../models/Account');

var secret = 'xxx';

var auth = function(req, res, next) {
    if (req.query.token === undefined) return res.status(401).json({message:'Unothorized'})
    var id = jwt.decode(req.query.token, secret);
    Account.findById(id, function(err, account) {
        if (err) return res.status(500).json({message: err});
        req.account = account;
        next();
    })
}

var findAccountByIban = function(req, res, next) {
  Account.findOne({iban: req.body.iban}, function(err, account){
    if (err) return res.status(500).json({message: err});
    req.account2 = account;
    next();
  })
}

var checkCredit = function(req, res, next) {
  if(req.account.balance >= req.body.amount && req.account.balance > 0){
    next();
  } else {
    res.status(404).json({message: "You don't have enough credit"})
  }
}

module.exports.auth = auth;
module.exports.byIban = findAccountByIban;
module.exports.checkCredit = checkCredit;
