var jetons = require('./lib/jetons');
jetons.createGame('test-game', 100, function (err, game) {
    console.log(game.id + ' created');
    jetons.startGame('test-game', function (err) {
        if(err) {
            console.log(err);
        }
        console.log('game started');
    });
    jetons.joinGame('test-game', 'test-player', 'magnus', function (err) {
        console.log('successfully joined game');
    });
});
