const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TransactionSchema = new Schema({

  account1: {type: Schema.Types.String, ref:'Account'},
  account2: {type: Schema.Types.String, ref:'Account'},
  amount: {type: Number, required: true}

});

module.exports = mongoose.model('Transaction', TransactionSchema);
