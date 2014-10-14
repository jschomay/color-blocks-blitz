var game = new Phaser.Game(320, 480, Phaser.AUTO, 'game');
// var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, 'game');

game.score = {correct:0,total:0};

GameState = require('./states/play');
Intro = require('./states/intro');
LevelEnd = require('./states/level-end');
game.state.add('intro', Intro, true);
game.state.add('play', GameState);
game.state.add('levelEnd', LevelEnd);

window.game = game;
