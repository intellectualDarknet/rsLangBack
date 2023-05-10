const { OK } = require('http-status-codes');
const router = require('express').Router();

const wordService = require('./personalWord.service');
const { BAD_REQUEST_ERROR } = require('../../errors/appErrors');
const extractQueryParam = require('../../utils/getQueryNumberParameter');

router.route('/:userId').post(async (req, res) => {
  const word = await wordService.createWord(req.params.userId, req.body);
  res.status(OK).send(word);
});

router.route('/:userId/:wordId').put(async (req, res) => {
  const userId = req.params.userId;
  const wordId = req.params.wordId;
  console.log(userId, wordId);
  if (!(userId && wordId)) {
    throw new BAD_REQUEST_ERROR(
      'Wrong query parameters: the userId, wordId numbers should be in query string'
    );
  }
  const word = await wordService.updateWord(userId, wordId, req.body);
  res.status(OK).send(word);
});

router.route('/:userId/repeat').get(async (req, res) => {
  const userId = extractQueryParam(req.query.userId);
  console.log(userId);

  const word = await wordService.getPersonalWordsToRepeat(
    req.params.userId,
    req.body
  );
  res.status(OK).send(word);
});

router.route('/:userId/learn').get(async (req, res) => {
  const params = req.params.userId;
  console.log('params', params);

  const word = await wordService.getWordsToLearn(req.params.userId, req.body);
  res.status(OK).send(word);
});

module.exports = router;
