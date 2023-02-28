const Word = require('./word.model');
const { NOT_FOUND_ERROR } = require('../../errors/appErrors');
const ENTITY_NAME = 'word';

const getAll = async conditions => {
  const { group, page, wordsPerPage } = conditions;

  const searchQuery = { group };

  if (!Object.is(null, page)) {
    searchQuery.page = page;
  }

  return Word.find(searchQuery).limit(wordsPerPage);
};

const get = async id => {
  const word = await Word.findOne({ _id: id });
  if (!word) {
    throw new NOT_FOUND_ERROR(ENTITY_NAME, { id });
  }
  return word;
};

module.exports = { getAll, get };
