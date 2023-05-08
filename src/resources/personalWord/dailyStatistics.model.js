const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DailyStatistics = new Schema(
  {
    user_id: { type: mongoose.Schema.ObjectId, ref: 'users' },
    date: { type: Number, required: true, max: 100 },
    repeated_today: { type: Number, required: true, max: 100 },
    new_words_today: { type: String, required: true, max: 100 }
  },
  { collection: 'dailyStatistics' }
);

module.exports = mongoose.model('DailyStatistics', DailyStatistics);
