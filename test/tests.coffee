should = require('should')
jetons = require( '../lib/jetons')
testgame = 'test-game-id'
testplayer1 = 'test-game-player-1'
testplayer2 = 'test-game-player-2'
testplayer3 = 'test-game-player-3'

describe 'Jetons', ->

	beforeEach ->
		jetons.flushGames()

	it 'should exist', -> jetons.exist

	it 'should be able to create a game', (done) ->
		jetons.createGame testgame, 50, (err, game) ->
			should.not.exist err
			game.initialCredits.should.equal 50
			done()

	it 'should allow players to join a game', (done) ->
		jetons.createGame testgame, 50, (err, game) ->
			jetons.joinGame testgame, testplayer1, 'my-nick', (err) ->
				should.not.exist err
			done()

	it 'should allow a game to start', (done) -> 
		createStartedGame testgame, (game) ->
			should.exist game
			done()

	it 'should not allow creating a game with an id already in use', (done) ->
		jetons.createGame testgame, 50, (err, game) ->
			should.not.exist err
		jetons.createGame testgame, 50, (err, game) ->
			should.exist err
		done()

	it 'should not allow users to join a started game', (done) -> 
		createStartedGame testgame, (game) ->
			jetons.joinGame testgame, testplayer3, 'player3', (err, data) ->
				should.exist err
				err.message.should.equal 'game already started'
				done()

	it 'should not allow two users to use the same nick', (done) -> 
		jetons.createGame testgame, 50, (err, game) ->
			jetons.joinGame testgame, testplayer1, 'duped nick', (err) ->
				jetons.joinGame testgame, testplayer2, 'duped nick', (err) ->
					should.exist err
					err.message.should.equal 'nickname is already taken'
					done()

	it 'must not start a game before more than one players has joined', (done) ->
		jetons.createGame testgame, 50, (err, game) ->
		jetons.startGame testgame, (err) ->
			should.exist err
		done()

	it 'should let players bet', (done) ->
		createStartedGame testgame, (game) ->
			jetons.bet testgame, testplayer1, 10, (err) ->
				game.pot.should.equal 10

				for player in game.players
					if player.id == testplayer1
						player.credits.should.equal 40

				done()

	it 'should not let players bet more than they have', (done) ->
		createStartedGame testgame, (game) ->
			jetons.bet testgame, testplayer1, 60, (err) ->
				game.pot.should.equal 0

				for player in game.players
					if player.id == testplayer1
						player.credits.should.equal 50

				err.should.exist
				err.message.should.equal 'bet exceeds credits'
				done()


createStartedGame = (gameId, callback) ->
	_game = null
	jetons.createGame gameId, 50, (err, game) ->
		_game = game
		jetons.joinGame gameId, testplayer1, 'nick1', (err) ->
			jetons.joinGame gameId, testplayer2, 'nick2', (err) ->
				jetons.startGame gameId, (err) ->
					callback(game)
