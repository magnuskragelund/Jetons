jetons = require( '../lib/jetons')
testgame = 'test-game-id'
testplayer1 = 'test-game-player-1'
testplayer2 = 'test-game-player-2'
testplayer3 = 'test-game-player-3'

describe 'Jetons', ->
	it 'should exist', -> jetons.exist

	it 'should be able to create a game', (done) ->
		jetons.createGame testgame, 50, (success, game) ->
			success.should.equal true,
			game.initialCredits.should.equal 50
			done()

	it 'should allow players to join a game', (done) ->
		jetons.createGame testgame, 50, (success, game) ->
			jetons.joinGame testgame, testplayer1, 'my-nick', (success) ->
				success.should.equal true
			done()

	it 'should allow a game to start', (done) -> 
		jetons.createGame testgame, 50, (success, game) ->
			jetons.joinGame testgame, testplayer1, 'player1', (success) ->
			jetons.joinGame testgame, testplayer2, 'player2', (success) ->
			jetons.startGame testgame, (success) ->
			done()

	it 'should not allow users to join a started game', (done) -> 
			jetons.createGame testgame, 50, (success, game) ->
			jetons.joinGame testgame, testplayer1, 'player1', (success) ->
			jetons.joinGame testgame, testplayer2, 'player2', (success) ->
			jetons.startGame testgame, (success) ->
			jetons.joinGame testgame, testplayer3, 'player3', (success, data) ->
				success.should.equal false
				data.message.should.equal 'game already started'
			done()
	
	it 'should not allow two users to use the same nick', -> false

	it 'must not start a game before more than one players has joined', (done) ->
			jetons.createGame testgame, 50, (success, game) ->
			jetons.startGame testgame, (success) ->
				success.should.equal false
			done()
