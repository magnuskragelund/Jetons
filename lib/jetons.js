var Game = (function () {
    function Game() { }
    return Game;
})();
var Player = (function () {
    function Player() { }
    return Player;
})();
var Server = (function () {
    function Server() {
        this.games = new Array();
    }
    Server.prototype.getPlayer = function (game, playerId) {
        for(var i = 0; i < game.players.length; i++) {
            if(game.players[i].id === playerId) {
                return game.players[i];
            }
        }
    };
    Server.prototype.getGame = function (id, callback) {
        for(var i = 0; i < this.games.length; i++) {
            if(this.games[i].id === id) {
                return callback(null, this.games[i]);
            }
        }
        callback(null, null);
    };
    Server.prototype.createGame = function (id, initialCredits, callback) {
        var existingGame;
        this.getGame(id, function (err, game) {
            if(err) {
                return callback(err);
            }
            existingGame = game;
        });
        if(existingGame) {
            return callback(new Error('A game with that id already exists'));
        }
        var game = new Game();
        game.id = id;
        game.initialCredits = initialCredits;
        game.players = new Array() , game.started = false;
        game.pot = 0;
        this.games.push(game);
        callback(null, game);
    };
    Server.prototype.flushGames = function () {
        this.games = new Array();
    };
    Server.prototype.joinGame = function (gameId, playerId, nickname, callback) {
        var _this = this;
        this.getGame(gameId, function (err, game) {
            if(err) {
                return callback(err);
            }
            if(game.started) {
                return callback(new Error('game already started'));
            }
            if(_this.getPlayer(game, playerId)) {
                return callback(new Error('player already joined'));
            }
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
    Server.prototype.startGame = function (id, callback) {
        this.getGame(id, function (err, game) {
            if(err) {
                return callback(err);
            }
            if(game.players.length > 1 && !game.started) {
                game.started = true;
                return callback(null);
            } else {
                return callback(new Error('game cannot start because of current game state'));
            }
        });
    };
    Server.prototype.bet = function (gameId, playerId, amount, callback) {
        var _this = this;
        this.getGame(gameId, function (err, game) {
            var player = _this.getPlayer(game, playerId);
            if(err) {
                return callback(err);
            }
            if(player.credits < amount) {
                return callback(new Error('bet exceeds credits'));
            }
            game.pot += amount;
            player.credits -= amount;
            return callback(null);
        });
    };
    return Server;
})();
exports.Server = Server;

