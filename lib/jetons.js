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
				callback(_games[i]);
				return;
			}
		}

		callback(null);
	};	

	var _createGame = function (id, initialCredits, callback) {

		var existingGame;
		
		_getGame(id, function(game){
			existingGame = game;
		});
		
		if(existingGame){
			callback(new Error('A game with that id already exists'));
			return;
		}
		
		var game = {
			id: id,
			initialCredits: initialCredits,
			players: [],
			started: false
		};

		_games.push(game);

		callback(null, game);
	};

	var _flushGames = function() {
		_games = [];
	}

	var _joinGame = function (gameId, playerId, nickname, callback) {
		
		_getGame(gameId, function(game) {
			if(game.started) {
				callback(new Error('game already started'));
				return;
			}

			if(_getPlayer(game, playerId)) callback(new Error('player already joined'));

			for(var i = 0; i < game.players.length; i++) {
				if(game.players[i].nickname === nickname) {
					callback(new Error('nickname is already taken'));
					return;
				}
			}

			game.players.push({
				id: playerId,
				nickname: nickname,
				credits: game.initialCredits
			});

			callback(null);
		});
	};

	var _startGame = function(id, callback) {
		_getGame(id, function(game) {
			if(game.players.length > 1 && !game.started) {
				game.started = true;
				callback(null);
			} else {
				callback(new Error('game cannot start because of current game state'));
			}
		});
	}

	return  {
		createGame: _createGame,
		joinGame: _joinGame,
		startGame: _startGame,
		getGame: _getGame,
		flushGames: _flushGames
	};
}();

module.exports = Jetons;