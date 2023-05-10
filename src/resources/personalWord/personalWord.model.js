const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PersonalWord = new Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: [true, 'user_id is required']
    },
    hierogliphs: { type: String, required: false, max: 100, unique: true },
    writings: { type: String, required: true, max: 100 },
    meaning: { type: String, required: true, max: 150 },
    howToRemember: { type: String, required: false, max: 150 },
    inRow: { type: Number, default: 0 },
    date_to_repeat: { type: Date, default: Date.now() },
    sign: { type: String, required: false },
    language: { type: String, required: false }
  },
  { collection: 'personalWords' }
);

module.exports = mongoose.model('PersonalWord', PersonalWord);
