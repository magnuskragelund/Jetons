///<reference path='node.d.ts'/>

import Jetons = module('./lib/jetons');

var jetons: Jetons.Server = new Jetons.Server();

jetons.createGame('test-game', 100, function(err, game) {
	
	console.log(game.id + ' created');

	jetons.joinGame('test-game', 'test-player', 'magnus', function(err){
		console.log('successfully joined game');
		
	});

	jetons.startGame('test-game', function (err){
		if (err) console.log(err);
		console.log('game started');
	});

});
