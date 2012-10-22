var createStartedGame, jetons, jetonsModule, should, testgame, testplayer1, testplayer2, testplayer3;

should = require('should');

jetonsModule = require('../lib/jetons');

jetons = new jetonsModule.Server();

testgame = 'test-game-id';

testplayer1 = 'test-game-player-1';

testplayer2 = 'test-game-player-2';

testplayer3 = 'test-game-player-3';

describe('Jetons', function() {
  beforeEach(function() {});
  return jetons.flushGames();
});

it('should exist', function() {
  return jetons.exist;
});

it('should be able to create a game', function(done) {
  return jetons.createGame(testgame, 50, function(err, game) {
    should.not.exist(err);
    game.initialCredits.should.equal(50);
    return done();
  });
});

it('should allow players to join a game', function(done) {
  return jetons.createGame(testgame, 50, function(err, game) {
    jetons.joinGame(testgame, testplayer1, 'my-nick', function(err) {
      return should.not.exist(err);
    });
    return done();
  });
});

it('should allow a game to start', function(done) {
  return createStartedGame(testgame, function(game) {
    should.exist(game);
    return done();
  });
});

it('should not allow creating a game with an id already in use', function(done) {
  jetons.createGame(testgame, 50, function(err, game) {
    return should.not.exist(err);
  });
  jetons.createGame(testgame, 50, function(err, game) {
    return should.exist(err);
  });
  return done();
});

it('should not allow users to join a started game', function(done) {
  return createStartedGame(testgame, function(game) {
    return jetons.joinGame(testgame, testplayer3, 'player3', function(err, data) {
      should.exist(err);
      err.message.should.equal('game already started');
      return done();
    });
  });
});

it('should not allow two users to use the same nick', function(done) {
  return jetons.createGame(testgame, 50, function(err, game) {
    return jetons.joinGame(testgame, testplayer1, 'duped nick', function(err) {
      return jetons.joinGame(testgame, testplayer2, 'duped nick', function(err) {
        should.exist(err);
        err.message.should.equal('nickname is already taken');
        return done();
      });
    });
  });
});

it('must not start a game before more than one players has joined', function(done) {
  jetons.createGame(testgame, 50, function(err, game) {});
  jetons.startGame(testgame, function(err) {
    return should.exist(err);
  });
  return done();
});

it('should let players bet', function(done) {
  return createStartedGame(testgame, function(game) {
    return jetons.bet(testgame, testplayer1, 10, function(err) {
      var player, _i, _len, _ref;
      game.pot.should.equal(10);
      _ref = game.players;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        player = _ref[_i];
        if (player.id === testplayer1) {
          player.credits.should.equal(40);
        }
      }
      return done();
    });
  });
});

it('should not let players bet more than they have', function(done) {
  return createStartedGame(testgame, function(game) {
    return jetons.bet(testgame, testplayer1, 60, function(err) {
      var player, _i, _len, _ref;
      game.pot.should.equal(0);
      _ref = game.players;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        player = _ref[_i];
        if (player.id === testplayer1) {
          player.credits.should.equal(50);
        }
      }
      err.should.exist;
      err.message.should.equal('bet exceeds credits');
      return done();
    });
  });
});

createStartedGame = function(gameId, callback) {
  var _game = null;
  return jetons.createGame(gameId, 50, function (err, game) {
    _game = game;
    return jetons.joinGame(gameId, testplayer1, 'nick1', function(err) {
      return jetons.joinGame(gameId, testplayer2, 'nick2', function(err) {
        return jetons.startGame(gameId, function(err) {
          return callback(game);
        });
      });
    });
  });
};
