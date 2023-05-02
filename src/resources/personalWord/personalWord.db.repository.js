const PersonalWord = require('./personalWord.model');
const dailyStatistics = require('./dailyStatistics.model');
const { NOT_FOUND_ERROR } = require('../../errors/appErrors');
const ENTITY_NAME = 'word';


const createWord = async  (userId, wordToCreate) => {
  const createdWord = await PersonalWord.create(userId, wordToCreate);

  return createdWord
};

const updateWord = async (userId, wordId, updatedWord) => {
  const doc = await PersonalWord.findByIdAndUpdate(wordId, updatedWord, {
    new: true,
  });

  if (!doc) {
    return next(new AppError('Didnt find word to update', 404));
  }

  const daily = await dailyStatistics.find({user_id: userId})

  if(!daily) {
    const date = new Date(); 
    date.setHours(0, 0, 0, 0); 
    const statistics = {date, repeated_today: 0, new_words_today: 0}
    await dailyStatistics.create(userId, statistics)
  }

  if (updatedWord.inRow) {
    await dailyStatistics.findByIdAndUpdate(userId, { repeated_today: daily.repeated_today + 1 })
  } else {
    await dailyStatistics.findByIdAndUpdate(userId, { new_words_today: daily.new_words_today + 1 })
  }

  return doc
};

const getPersonalWordsToRepeat = async (userId, body) => {
  const { sign } = body;
  return PersonalWord.find({date_to_repeat: { $lte: Date.now()}, user_id: { $eq: userId }, inRow: { $gte: 1}});
};

const getWordsToLearn = async (userId, body) => {
  const { language, sign, limit } = body
  const word = await PersonalWord.find({inRow: { $eq: 0 }, user_id: { $eq: userId }}).limit(limit);
  if (!word) {
    throw new NOT_FOUND_ERROR(ENTITY_NAME, { id });
  }
  return word;
};

module.exports = { getPersonalWordsToRepeat, getWordsToLearn, updateWord, createWord };
