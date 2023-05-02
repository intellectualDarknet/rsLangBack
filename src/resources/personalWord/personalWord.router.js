const { OK } = require('http-status-codes');
const router = require('express').Router();

const wordService = require('./personalWord.service');
const { BAD_REQUEST_ERROR } = require('../../errors/appErrors');
const extractQueryParam = require('../../utils/getQueryNumberParameter');

router.route('/:userId').post(async (req, res) => {
  const word = await wordService.createWord(req.params.userId, req.body);
  res.status(OK).send(word.map(word => word.toResponse()));
});

router.route('/:userId/:wordId').put(async (req, res) => {
  const word = await wordService.updateWord(req.params.userId, req.params.wordId, req.body);
  res.status(OK).send(word.toResponse());
});

router.route('/repeat/:userId').get(async (req, res) => {
  const word = await wordService.getPersonalWordsToRepeat(req.params.userId, req.body);
  res.status(OK).send(word.toResponse());
});

router.route('/learn/:userId').get(async (req, res) => {
  const word = await wordService.getWordsToLearn(req.params.userId, req.body);
  res.status(OK).send(word.toResponse());
});

module.exports = router;
