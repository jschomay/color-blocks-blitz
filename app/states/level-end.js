function LevelEnd() {}

LevelEnd.prototype = {
    preload: function() {

    },
    create: function() {
      // level #
      var style = { font: 'bold 40px Arial', fill: '#ffffff', align: 'center'};
      this.titleText = this.game.add.text(this.game.world.centerX, 100, 'Level '+this.game.pacing.level+'\nFinished', style);
      this.titleText.anchor.setTo(0.5, 0.5);

      // draw star outlines
      this.drawStars(3, true);

      // score
      this.scoreText = game.add.text(this.game.world.centerX, 300, 'Score: 0', { font: '36px Arial', fill: '#ffffff', align: 'left'});
      this.scoreText.anchor.setTo(0.5, 0.5);

      // try again
      this.tryAgain = game.add.text(this.game.width / 4, 400, 'TRY\nAGAIN', { font: '26px Arial', fill: '#ffffff', align: 'center'});
      this.tryAgain.anchor.setTo(0.5, 0.5);
      this.tryAgain.inputEnabled = true;

      // next level
      this.nextLevel = game.add.text(this.game.width * 3 / 4, 400, 'NEXT\nLEVEL', { font: '26px Arial', fill: '#ffffff', align: 'center'});
      this.nextLevel.anchor.setTo(0.5, 0.5);
      this.nextLevel.inputEnabled = true;
      this.nextLevel.alpha = 0.2;

      // progress bar
      this.drawProgressBar({x: this.game.width * 0.1, y: 330});

      // beta notice
      this.betaNotice = game.add.text(this.game.world.centerX, this.game.world.height - 20, 'This is a beta version\nLeave feedback and get updates here', { font: '16px Arial', fill: 'red', align: 'center'});
      this.betaNotice.anchor.setTo(0.5, 0.5);
      this.betaNotice.inputEnabled = true;
      this.betaNotice.events.onInputDown.add(function(){window.location.href="http://codeperfectionist.com/portfolio/games/color-blindness-blitz/";});
    },
    update: function() {
      // try again
      if(this.tryAgain.input.justPressed()) {
        this.tryAgain.input.destroy();
        this.startLevel();
      }
      // next level
      if(this.game.score.levelStars >= 2 && this.nextLevel.input.justPressed()) {
        this.nextLevel.input.destroy();
        this.game.pacing.level++;
        // speed up next round
        this.game.pacing.baseSpeedMultiplier *= this.game.pacing.levelSpeedIncrease;
        this.startLevel();
      }
    }
  };

LevelEnd.prototype.startLevel = function () {
  // clean things up
  this.progressTween.stop();
  this.progressTween = null;
  this.titleText = null;
  this.scoreText = null;
  this.tryAgain = null;
  this.nextLevel = null;
  this.betaNotice = null;

  // load next state
  this.game.state.start('level');
};

LevelEnd.prototype.drawProgressBar = function(position){
  console.log("you scored", this.game.score.levelScore, 'out of', this.game.score.maxLevelScore);

  var percentage;
  if(this.game.score.levelScore > this.game.score.maxLevelScore) {
    // could happen with bonuses
    percentage = 1;
  } else {
    percentage = this.game.score.levelScore / this.game.score.maxLevelScore;
  }

  var color = 0xffd900;

  var bestScore = game.add.graphics(position.x, position.y);
  // set a fill and line style
  bestScore.beginFill();
  bestScore.lineStyle(20, color, 0.5);
  // draw best possible score
  bestScore.moveTo(0, 0);
  bestScore.lineTo(this.game.width * 0.8, 0);
  bestScore.endFill();

  var playerScore = game.add.graphics(position.x, position.y);
  // set a fill and line style
  playerScore.beginFill();
  playerScore.lineStyle(20, color, 1);
  // draw player's score
  playerScore.moveTo(0, 0);
  playerScore.lineTo(percentage * this.game.width * 0.8, 0);
  playerScore.endFill();


  playerScore.scale.x = 0;
  var score = 0;
  this.progressTween = game.add.tween(playerScore.scale).to({x: 1}, 3500, Phaser.Easing.Quadratic.Out, true)
    .onUpdateCallback(function(){
        score = Math.round(this.game.score.levelScore * playerScore.scale.x);
        this.scoreText.text =  'Score: ' + score;
        if (score / this.game.score.maxLevelScore >= this.game.pacing.starBreakPoints[this.game.score.levelStars]) {
          this.drawStars(++this.game.score.levelStars);
          if (this.game.score.levelStars >= 2) {
            this.nextLevel.alpha = 1;
          }
        }
    }, this);
};

LevelEnd.prototype.drawStars = function (num, outline) {
  var starColors = [
    "blue",
    "purple",
    "green",
  ];
  var alpha;
  if (outline) {
    alpha = 0.2;
  } else {
    alpha = 1;
  }
  for (var i = 0; i < num; i++) {
    var position = {x: this.game.width * (i + 1) / 4, y: 220};
    drawStar(position.x, position.y, this.game.COLORS[starColors[i]], alpha);
  }
};

// thanks to http://stackoverflow.com/questions/25837158/how-to-draw-a-star-by-using-canvas-html5
function drawStar(cx,cy, color, alpha){
  var spikes = 5;
  var outerRadius = 30;
  var innerRadius = 10;
  var rot=Math.PI/2*3;
  var x=cx;
  var y=cy;
  var step=Math.PI/spikes;
  var star = this.game.add.graphics(0,0);

  star.beginFill(color, alpha);
  star.moveTo(cx,cy-outerRadius);
  for(i=0;i<spikes;i++){
    x=cx+Math.cos(rot)*outerRadius;
    y=cy+Math.sin(rot)*outerRadius;
    star.lineTo(x,y);
    rot+=step;

    x=cx+Math.cos(rot)*innerRadius;
    y=cy+Math.sin(rot)*innerRadius;
    star.lineTo(x,y);
    rot+=step;
  }
  star.lineTo(cx,cy-outerRadius);
}

module.exports = LevelEnd;
