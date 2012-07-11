var Jetons = function() {
		
	var _games = [];

	var _getPlayer = function (game, playerId) {
		for(var i = 0; i < game.players.length; i++) {
			if(game.players[i].id === playerId) return game.players[i];
		}
	}

	var _getGame = function (id, callback) {
		
		for(var i = 0; i < _games.length; i++)
		{
			if(_games[i].id === id) {
				return callback(null, _games[i]);
			}
		}

		callback(null, null);
	};	

	var _createGame = function (id, initialCredits, callback) {

		var existingGame;
		
		_getGame(id, function(err, game){
			
			if(err)
				return callback(err);

			existingGame = game;
		});
		
		if(existingGame){
			return callback(new Error('A game with that id already exists'));
		}
		
		var game = {
			id: id,
			initialCredits: initialCredits,
			players: [],
			started: false,
			pot: 0
		};

		_games.push(game);

		callback(null, game);
	};

	var _flushGames = function() {
		_games = [];
	}

	var _joinGame = function (gameId, playerId, nickname, callback) {
		_getGame(gameId, function (err, game) {
			
			if(err)
				return callback(err);

			if(game.started) 
				return callback(new Error('game already started'));
			

			if(_getPlayer(game, playerId)) return callback(new Error('player already joined'));

			for(var i = 0; i < game.players.length; i++) {
				if(game.players[i].nickname === nickname) {
					return callback(new Error('nickname is already taken'));
				}
			}

			game.players.push({
				id: playerId,
				nickname: nickname,
				credits: game.initialCredits
			});

			return callback(null);
		});
	};

	var _startGame = function (id, callback) {

		_getGame(id, function (err, game) {
			
			if(err)
				return callback(err);

			if(game.players.length > 1 && !game.started) {
				game.started = true;
				return callback(null);
			} else {
				return callback(new Error('game cannot start because of current game state'));
			}
		});
	}

	var _bet = function (gameId, playerId, amount, callback) {
		_getGame(gameId, function (err, game) {
			var player = _getPlayer(game, playerId);

			if(err)
				return callback(err);

			if(player.credits < amount)
				return callback(new Error('bet exceeds credits'));

			game.pot += amount;
			player.credits -= amount;
			
			return callback(null);
		}) 
	}

	return  {
		createGame: _createGame,
		joinGame: _joinGame,
		startGame: _startGame,
		getGame: _getGame,
		flushGames: _flushGames,
		bet: _bet
	};
}();

module.exports = Jetons;