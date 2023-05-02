const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PersonalWord = new Schema(
  {
    user_id: {type: mongoose.Schema.ObjectId, ref: 'users'},
    hierogliphs: { type: Number, required: false, max: 100 },
    writings: { type: String, required: true, max: 100 },
    meaning: { type: String, required: false, max: 150 },
    howToRemember: { type: String, required: false, max: 150 },
    inRow: { type: String, required: false},
    date_to_repeat: Date.now(),
    sign: { type: String, required: false},
    language: { type: String, required: false},
  },
  { collection: 'personalWords' }
);

module.exports = mongoose.model('PersonalWord', PersonalWord);
