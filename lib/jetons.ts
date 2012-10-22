///<reference path='../node.d.ts'/>

class Game {
    id: number;
    initialCredits: number;
    players: Player[];
    started: bool;
    pot: number;
}

class Player {
    id: number;
    name: string;
    credits: number;
}

export class Server {

    private games: Game[];

    constructor () {
        this.games = new Array();
    }

    public getPlayer(game: Game, playerId: number) {
        for (var i = 0; i < game.players.length; i++) {
            if (game.players[i].id === playerId) return game.players[i];
        }
    }

    public getGame(id, callback) {

        for (var i = 0; i < this.games.length; i++) {
            if (this.games[i].id === id) {
                return callback(null, this.games[i]);
            }
        }

        callback(null, null);
    };

    public createGame(id, initialCredits, callback) {

        var existingGame;

        this.getGame(id, (err, game) => {

            if (err)
                return callback(err);

            existingGame = game;
        });

        if (existingGame) {
            return callback(new Error('A game with that id already exists'));
        }

        var game: Game = new Game();
        game.id = id;
        game.initialCredits = initialCredits;
        game.players = new Player[],
        game.started = false;
        game.pot = 0;


        this.games.push(game);

        callback(null, game);
    };

    public flushGames() {
        this.games = new Game[];
    }

    public joinGame(gameId, playerId, nickname, callback) {
        this.getGame(gameId, (err, game) => {

            if (err)
                return callback(err);

            if (game.started)
                return callback(new Error('game already started'));


            if (this.getPlayer(game, playerId)) return callback(new Error('player already joined'));

            for (var i = 0; i < game.players.length; i++) {
                if (game.players[i].nickname === nickname) {
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
    }

    public startGame(id, callback) {
        this.getGame(id, (err, game) => {

            if (err)
                return callback(err);

            if (game.players.length > 1 && !game.started) {
                game.started = true;
                return callback(null);
            } else {
                return callback(new Error('game cannot start because of current game state'));
            }
        });
    }

    public bet(gameId, playerId, amount, callback) {
        this.getGame(gameId, (err, game) => {
            var player = this.getPlayer(game, playerId);

            if (err)
                return callback(err);

            if (player.credits < amount)
                return callback(new Error('bet exceeds credits'));

            game.pot += amount;
            player.credits -= amount;

            return callback(null);
        })
    }
}
