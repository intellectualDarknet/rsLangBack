const wordRepo = require('./personalWord.db.repository');

const createWord = async (userId, wordToCreate) => wordRepo.createWord(userId, wordToCreate);

const updateWord = async (userId, wordId, updatedWord) => wordRepo.updateWord(userId, wordId, updatedWord);

const getPersonalWordsToRepeat = async (userId, body) => wordRepo.getPersonalWordsToRepeat(userId, body);

const getWordsToLearn = async (userId, body) => wordRepo.getWordsToLearn(userId, body);

module.exports = { createWord, updateWord, getPersonalWordsToRepeat,getWordsToLearn };
