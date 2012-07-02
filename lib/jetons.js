var Jetons = function() {
		
	var _games = [];

	var _getPlayer = function (game, playerId) {
		for(var i = 0; i < game.players.length; i++) {
			if(game.players[i].id === playerId) return game.players[i];
		}
	}

	var _createGame = function (id, initialCredits, callback) {
		
		var game = {
			id: id,
			initialCredits: initialCredits,
			players: [],
			started: false
		};

		_games.push(game);

		callback(true, game);
	};

	var _joinGame = function (gameId, playerId, nickname, callback) {
		
		_getGame(gameId, function(game) {
			if(game.started) {
				callback(false, { message: 'game already started' });
				return;
			}

			if(_getPlayer(game, playerId)) callback(false, { message: 'player already joined' });

			game.players.push({
				id: playerId,
				nickname: nickname,
				credits: game.initialCredits
			});

			callback(true);
		});
	};

	var _startGame = function(id, callback) {
		_getGame(id, function(game) {
			if(game.players.length > 1 && !game.started) {
				game.started = true;
				callback(true);
			} else {
				callback(false);
			}
		});
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

	return  {
		createGame: _createGame,
		joinGame: _joinGame,
		startGame: _startGame,
		getGame: _getGame
	};
}();

module.exports = Jetons;