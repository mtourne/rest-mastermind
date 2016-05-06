'use strict';

let Gamer = require('../src/gamer.js');
let assert = require('assert');
let sinon = require('sinon');

describe('Gamer', () => {
  let mockGenerator;
  let subject;

  beforeEach(() => {
    let generator = { generateWithLength: () => {} };
    mockGenerator = sinon.mock(generator);
    subject = new Gamer('Tester', generator);
  });

  describe('initial state', () => {
    it('should have the user stats', () => {
      var result = subject.getStats();
      assert.deepEqual(result, {
        name: 'Tester',
        wins: 0,
        losses: 0,
        lastGuess: null,
        isPlaying: false
      });
    });
  });

  describe('newGame', () => {
    it('should return data for the user', () => {
      var result = subject.newGame();
      assert.deepEqual(result, {
        secretLength: 6,
        remainingGuesses: 10
      });
    });

    it('should call the secret generator', () => {
      mockGenerator.expects('generateWithLength').once().returns('123456');
      subject.newGame();
      mockGenerator.verify();
    });

    it('should update the isPlaying stat', () => {
      var result = subject.getStats();
      subject.newGame();
      assert(result.isPlaying);
    });
  });

  describe('guess', () => {
    it('should return an error if no game is current', () => {
      var result = subject.guess();
      assert.equal(result.error, 'No current game.');
    });

    it('should return the results of a guess', () => {
      mockGenerator.expects('generateWithLength').once().returns('123456');
      subject.newGame();
      var result = subject.guess('111111');
      assert.deepEqual(result, {
        guess: '111111',
        wasCorrect: false,
        correctDigits: 1,
        misplacedDigits: 0,
        remainingGuesses: 9
      });
    });

    it('should update the status after a correct guess', function () {
      mockGenerator.expects('generateWithLength').once().returns('123456');
      subject.newGame();
      var result = subject.guess('123456');
      var stats = subject.getStats();
      assert.deepEqual(stats, {
        name: 'Tester',
        wins: 1,
        losses: 0,
        lastGuess: result,
        isPlaying: false
      });
    });

    it('should update the status after losing a game', function () {
      mockGenerator.expects('generateWithLength').once().returns('123456');
      subject.newGame();
      subject.guess('000000');
      subject.guess('111111');
      subject.guess('222222');
      subject.guess('333333');
      subject.guess('444444');
      subject.guess('555555');
      subject.guess('666666');
      subject.guess('777777');
      subject.guess('888888');
      var result = subject.guess('999999');
      var stats = subject.getStats();
      assert.deepEqual(stats, {
        name: 'Tester',
        wins: 0,
        losses: 1,
        lastGuess: result,
        isPlaying: false
      });
    });

    it('should not count as a loss if the last guess is correct', function () {
      mockGenerator.expects('generateWithLength').once().returns('123456');
      subject.newGame();
      subject.guess('000000');
      subject.guess('111111');
      subject.guess('222222');
      subject.guess('333333');
      subject.guess('444444');
      subject.guess('555555');
      subject.guess('666666');
      subject.guess('777777');
      subject.guess('888888');
      var result = subject.guess('123456');
      var stats = subject.getStats();
      assert.deepEqual(stats, {
        name: 'Tester',
        wins: 1,
        losses: 0,
        lastGuess: result,
        isPlaying: false
      });
    });
  });
});
