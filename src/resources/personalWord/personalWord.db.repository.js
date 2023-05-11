const PersonalWord = require('./personalWord.model');
const dailyStatistics = require('./dailyStatistics.model');
const { NOT_FOUND_ERROR } = require('../../errors/appErrors');
const ENTITY_NAME = 'word';

function defineUpdate(word) {
  let cof;
  switch (word.inRow) {
    case 1:
      cof = 5;
      break;
    case 2:
      cof = 60 * 4;
      break;
    case 3:
      cof = 60 * 24;
      break;
    case 4:
      cof = 60 * 24 * 3;
      break;
    case 5:
      cof = 60 * 24 * 7;
      break;
    case 6:
      cof = 60 * 24 * 14;
      break;
    case 7:
      cof = 60 * 24 * 21;
      break;
    case 8:
      cof = 60 * 24 * 28;
      break;
    case 9:
      cof = 60 * 24 * 30 * 2;
      break;
    case 10:
      cof = 60 * 24 * 30 * 3;
      break;
    case 11:
      cof = 60 * 24 * 30 * 12;
      break;
    default:
      cof = 60 * 24 * 30 * 120;
      break;
  }
  word.date_to_repeat = new Date(Date.now() + 1000 * cof * 60);
}

const createWord = async (userId, wordToCreate) => {
  console.log('precreate', userId, wordToCreate);
  const createdWord = await PersonalWord.create({
    user_id: userId,
    ...wordToCreate
  });

  return createdWord;
};

const updateWord = async (userId, wordId, wordToUpdate) => {
  console.log('updateWord');
  wordToUpdate.inRow = wordToUpdate.inRow + 1;
  defineUpdate(wordToUpdate);
  const doc = await PersonalWord.findByIdAndUpdate(wordId, wordToUpdate, {
    new: true
  });

  const date_to_repeat = new Date().toISOString().slice(0, 10);
  const daily = await dailyStatistics.find({
    user_id: userId,
    date_to_repeat
  });

  if (!daily) {
    console.log('!doest');
    const statistics = {
      date: date_to_repeat,
      repeated: 0,
      new: 0
    };
    await dailyStatistics.create({ user_id: userId, ...statistics });
  }

  if (wordToUpdate.inRow) {
    console.log('inrow');
    await dailyStatistics.findByIdAndUpdate(userId, {
      repeated: daily.repeated || 0 + 1
    });
  } else {
    await dailyStatistics.findByIdAndUpdate(userId, {
      new: daily.new + 1
    });
  }

  return doc;
};

const getPersonalWordsToRepeat = async (userId, body) => {
  const { language, sign } = body;
  console.log(language, sign);
  return PersonalWord.find(
    {
      user_id: { $eq: userId },
      date_to_repeat: { $lte: Date.now() },
      inRow: { $gte: 1 }
    },
    {
      _id: 0,
      id: '$_id',
      hierogliphs: 1,
      writings: 1,
      meaning: 1,
      howToRemember: 1,
      inRow: 1,
      date_to_repeat: 1,
      sign: 1,
      language: 1
    }
  );
};

const getWordsToLearn = async (userId, body) => {
  const { language, sign, limit } = body;
  console.log(language, sign);
  const word = await PersonalWord.find(
    {
      inRow: 0,
      user_id: userId
    },
    {
      _id: 0,
      id: '$_id',
      hierogliphs: 1,
      writings: 1,
      meaning: 1,
      howToRemember: 1,
      inRow: 1,
      date_to_repeat: 1,
      sign: 1,
      language: 1
    }
  ).limit(limit ? limit : 10);
  if (!word) {
    throw new NOT_FOUND_ERROR(`${ENTITY_NAME}not found`);
  }
  return word;
};

module.exports = {
  getPersonalWordsToRepeat,
  getWordsToLearn,
  updateWord,
  createWord
};
