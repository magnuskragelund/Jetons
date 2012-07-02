var jetons = require('./lib/jetons');

jetons.createGame('test-game', 100, function(success, game) {
	console.log(game.id + ' created');

	jetons.startGame('test-game');

	jetons.joinGame('test-game', 'test-player', 'magnus', function(success, data){
		if(success) {
			console.log('successfully joined');
		} else {
			console.log(data.message);
		}
	});
});
