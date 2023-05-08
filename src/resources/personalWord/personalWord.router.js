const { OK } = require('http-status-codes');
const router = require('express').Router();

const wordService = require('./personalWord.service');
const { BAD_REQUEST_ERROR, UNAUTHORIZED } = require('../../errors/appErrors');
const extractQueryParam = require('../../utils/getQueryNumberParameter');

router.route('/:userId').post(async (req, res) => {
  const word = await wordService.createWord(req.params.userId, req.body);
  res.status(OK).send(word.map(elem => elem.toResponse()));
});

router.route('/:userId/:wordId').put(async (req, res) => {
  const userId = extractQueryParam(req.query.userId);
  const wordId = extractQueryParam(req.query.wordId);
  // dto
  if (!userId && !wordId) {
    throw new BAD_REQUEST_ERROR(
      'Wrong query parameters: the userId, wordId numbers should be in query string'
    );
  }

  const word = await wordService.updateWord(userId, wordId, req.body);
  res.status(OK).send(word.toResponse());
});

router.route('/:userId/repeat').get(async (req, res) => {
  const userId = extractQueryParam(req.query.userId);

  if (!userId) {
    throw new UNAUTHORIZED('Please log in');
  }
  const word = await wordService.getPersonalWordsToRepeat(
    req.params.userId,
    req.body
  );
  res.status(OK).send(word.toResponse());
});

router.route('/:userId/learn').get(async (req, res) => {
  const userId = extractQueryParam(req.query.userId);

  if (!userId) {
    throw new UNAUTHORIZED('Please log in');
  }

  const word = await wordService.getWordsToLearn(req.params.userId, req.body);
  res.status(OK).send(word.toResponse());
});

module.exports = router;
