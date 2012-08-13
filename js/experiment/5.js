var TBY = TBY || {};
if ( ! TBY.experiment ) TBY.experiment = {};

TBY.experiment[ 5 ] = ( function () {
  var scoreBoard = null,
      particles = [],
      player = null,
      flag = null,

      health = 3,
      points = 0,

      SPAWN_INTERVAL = 2000,
      TIME_SINCE_SPAWN = 0,
      PLAYER_RESET_INTERVAL = 1000,
      TIME_SINCE_RESET = 3000,

      CLEAR_ON_FRAME_REQUEST 	= false,
      FRAME_FILL_OPACITY 			= .25,

      GRAVITY 				= 10,	// 	px / sec
      FRICTION 				= .9,
      FLOOR_FRICTION 	= 2
      ;

  function _draw( timeLapsed ){

          // ignore queued animation frame requests
      if ( timeLapsed > 160 ) return;

      TIME_SINCE_SPAWN += timeLapsed;
      TIME_SINCE_RESET += timeLapsed;

      if ( CLEAR_ON_FRAME_REQUEST ) { ctx.clearRect( 0, 0, ctx.canvas.width, ctx.canvas.height ); }

      ctx.fillStyle = 'rgba(0,0,0,' + FRAME_FILL_OPACITY + ')';
      ctx.fillRect( 0, 0, ctx.canvas.width, ctx.canvas.height );

      if ( TIME_SINCE_SPAWN > SPAWN_INTERVAL ) {

          particles.push( new Particle({
                  x: 0,
                  y: ctx.canvas.height / 2,
                  radius: Math.random() * 12 + 3,
                  speed: Math.random() * 10 + 20,
                  angle: Math.random() * 90 + 315
              })
          );

          if ( particles.length > 3 ) {
              if ( particles.length > 4 ) {
                  particles.splice( 0, 1 );
              }
              particles[ 0 ].die();
          }

          TIME_SINCE_SPAWN = 0;
      }

      var i = particles.length;
      while ( i-- ){
          particles[ i ].update( timeLapsed );
          particles[ i ].draw();
          if ( !player.isDead() && !particles[ i ].isDead() && BBhitTest( particles[ i ], player ) ) {
              if ( player.color != '255,0,0' ){
                  scoreBoard.health -= 10;
                  if ( scoreBoard.health <= 0){
                      player.die();
                  }
              }
              player.color = '255,0,0';
              TIME_SINCE_RESET = 0;
          }
      }

      if ( TIME_SINCE_RESET >= PLAYER_RESET_INTERVAL ){
          player.color = '255,255,255';
      }

      player.update( timeLapsed );

      if ( !player.isDead() && BBhitTest( flag, player ) ) {
          scoreBoard.score += 100;

          if ( flag.x < ctx.canvas.width / 2 ){
              flag.x = ctx.canvas.width - 50;
          }
          else{
              flag.x = 50;
          }
      }

      flag.draw();
      player.draw();
      scoreBoard.draw();
  }

  function Particle( properties ){

      var _isHighlighted = false,
          _isDead = false;

      this.x = 0;
      this.y = 0;

      this.color = '255,0,0';
      this.opacity = 1;
      this.highlightColor = '255,255,255';
      this.lineWidth = 5;

      this.radius = 10;
      this.angle = 0;
      this.vel = { x: 0, y: 0 };
      this.speed = 0;

      $.extend( true, this, properties );

          // convert angle to velocity vector
      this.vel.x = this.speed * Math.cos( degToRad( this.angle ) );
      this.vel.y = this.speed * Math.sin( degToRad( this.angle ) );

      this.update = function( timeLapsed ){

          var timeLapsePercent 	= timeLapsed / 1000,
              gravity 					= GRAVITY * timeLapsePercent,
              friction 					= 1 - FRICTION * timeLapsePercent,
              floorFriction 		= 1 - FLOOR_FRICTION * timeLapsePercent;

              // convert angle to velocity vector
          this.vel.x = this.speed * Math.cos( degToRad( this.angle ) );
          this.vel.y = this.speed * Math.sin( degToRad( this.angle ) );

          this.contain()
              // apply GRAVITY
          this.vel.y += gravity;

              // recalculate speed and angle;
          this.speed = Math.sqrt( ( this.vel.x * this.vel.x ) + ( this.vel.y * this.vel.y ) );
          this.angle = radToDeg( Math.atan2( this.vel.y, this.vel.x ) );

              // apply FRICTION
          this.speed *= friction;
              // apply FLOOR FRICTION
          if ( this.y === canvasHeight - ( this.radius + ( this.lineWidth / 2 ) ) ){
              this.vel.x *= floorFriction;
          }

               // apply velocity vector
          this.x += this.vel.x;
          this.y += this.vel.y;

              // is fading out?
          if ( _isDead ){
              this.opacity -= timeLapsed / SPAWN_INTERVAL;
          }

              // is mouse over?
          this.isMouseOver();
      }

      this.contain = function() {
              // left wall
          if ( this.x < this.radius + ( this.lineWidth / 2 ) ){
              this.x = this.radius + ( this.lineWidth / 2 );
              this.vel.x *= -1;
          }
          /*  // ceiling
          if ( this.y < 0 + this.radius + ( this.lineWidth / 2 ) ) {
              this.y = 0 + this.radius + ( this.lineWidth / 2 );
              this.vel.y *= -1;
          }
          */  // right wall
          if ( this.x > ctx.canvas.width - ( this.radius - ( this.lineWidth / 2 ) ) ){
              this.x = ctx.canvas.width - this.radius - ( this.lineWidth / 2 );
              this.vel.x *= -1;
          }
              // floor
          if ( this.y > canvasHeight - ( this.radius + ( this.lineWidth / 2 ) ) ){
              this.y = canvasHeight - this.radius - ( this.lineWidth / 2 );
              this.vel.y *= -.9;
          }
      }

      this.die = function(){
          _isDead = true;
      };

      this.isDead = function(){
          return _isDead;
      };

      this.isMouseOver = function(){
              // is mouse over?
          if ( MOUSE_X >= this.x - this.radius
              && MOUSE_X <= this.x + this.radius
              && MOUSE_Y >= this.y - this.radius
              && MOUSE_Y <= this.y + this.radius ){

              _isHighlighted = true;
          }
          else{
              _isHighlighted = false;
          }
      }

      this.draw = function(){

          ctx.beginPath();
              ctx.lineWidth = this.lineWidth;
              ctx.lineCap = 'round';
              ctx.strokeStyle = 'rgba(' + (( _isHighlighted ) ? this.highlightColor : this.color ) + ',' + this.opacity +')';
          ctx.closePath();

          ctx.beginPath();
                  // vertical line
              ctx.moveTo( this.x, this.y - this.radius );
              ctx.lineTo( this.x, this.y + this.radius );
              ctx.stroke();

                  // horizontal line
              ctx.moveTo( this.x - this.radius, this.y );
              ctx.lineTo( this.x + this.radius, this.y );
              ctx.stroke();
          ctx.closePath();
      };

      this.getBoundingBox = function(){

          return {
              x: ( this.x - this.radius ),
              y: ( this.y - this.radius ),
              width: ( this.radius * 2 ),
              height: ( this.radius * 2 )
          };
      };
  }

  function Player( properties ){

      var _isDead = false;

      this.x = 0;
      this.y = 0;

      this.width = 0;
      this.height = 0;

      this.color = '255,0,0';
      this.opacity = 1;
      this.highlightColor = '255,255,255';

      this.angle = 0;
      this.vel = { x: 0, y: 0 };
      this.speed = 0;

      $.extend( true, this, properties );

          // convert angle to velocity vector
      this.vel.x = this.speed * Math.cos( degToRad( this.angle ) );
      this.vel.y = this.speed * Math.sin( degToRad( this.angle ) );

      this.update = function( timeLapsed ){

          var timeLapsePercent 	= timeLapsed / 1000,
              gravity 					= GRAVITY * timeLapsePercent,
              friction 					= 1 - FRICTION * timeLapsePercent,
              floorFriction 		= 1 - FLOOR_FRICTION * timeLapsePercent;

              // convert angle to velocity vector
          this.vel.y = this.speed * Math.sin( degToRad( this.angle ) );

          if ( KEY_UP && player.y > ctx.canvas.height - 1 ){
              player.vel.y -= 5;
          }
          else if ( KEY_LEFT ){
              player.x -= 2;
          }
          if ( KEY_RIGHT ){
              player.x += 2;
          }

          this.contain()
              // apply GRAVITY
          this.vel.y += gravity;

              // recalculate speed and angle;
          this.speed = Math.sqrt( ( this.vel.x * this.vel.x ) + ( this.vel.y * this.vel.y ) );
          this.angle = radToDeg( Math.atan2( this.vel.y, this.vel.x ) );

               // apply velocity vector
          this.y += this.vel.y;
      }

      this.contain = function() {
              // left wall
          if ( this.x < this.width / 2 ) {
              this.x = this.width / 2;
              this.vel.x *= -1;
          }
              // ceiling
          if ( this.y < this.height ) {
              this.y = 0 + this.height;
              this.vel.y *= -1;
          }
              // right wall
          if ( this.x > ctx.canvas.width - ( this.width / 2 ) ) {
              this.x = ctx.canvas.width - ( this.width / 2 );
              this.vel.x *= -1;
          }
              // floor
          if ( this.y >= canvasHeight ) {
              this.y = canvasHeight;
              if ( this.vel.y > 0 ) {
                  this.vel.y = 0;
                  this.angle = 0;
              }
          }
      };

      this.die = function(){
          _isDead = true;
      };

      this.isDead = function(){
          return _isDead;
      };

      this.draw = function(){

           if ( _isDead ) return;

          ctx.beginPath();
                  // vertical line
              ctx.fillStyle = 'rgba(' + this.color +',' + this.opacity + ')';
              ctx.fillRect( this.x - ( this.width / 2 ), this.y - this.height, this.width, this.height );
          ctx.closePath();
      };

      this.getBoundingBox = function(){

          var halfWidth = this.width / 2;
          return {
              x: ( this.x - halfWidth ),
              y: ( this.y - this.height ),
              width: this.width,
              height: this.height
          };
      };
  }

  function Flag( properties ){

      this.x = 0;
      this.y = 0;

      this.width = 0;
      this.height = 0;

      this.radius = 0

      this.color = '255,0,0';

      $.extend( true, this, properties );

      this.draw = function(){

          ctx.beginPath();
              ctx.fillStyle = 'white';
              ctx.lineCap = 'butt';
              ctx.arc( this.x, this.y, this.radius, 0, Math.PI, true );
              ctx.fill();
          ctx.closePath();

          ctx.beginPath();
              ctx.lineWidth = 1;
              ctx.strokeStyle = 'white';
              ctx.moveTo( this.x, this.y );
              ctx.lineTo( this.x, this.y - this.height );
              ctx.stroke();
          ctx.closePath();

          ctx.beginPath();
              ctx.fillStyle = 'red';
              ctx.moveTo( this.x + 2, this.y - this.height );
              ctx.lineTo( this.x + 12, this.y - this.height + 5 );
              ctx.lineTo( this.x + 2, this.y - this.height + 10 );
              ctx.fill();
          ctx.closePath();
      };

      this.getBoundingBox = function(){

          return {
              x: ( this.x - this.radius ),
              y: ( this.y - this.height ),
              width: this.width,
              height: this.height
          };
      };
  }

  function ScoreBoard( properties ){

      this.score = 0;
      this.health = 1;

      this.x = 0;
      this.y = 0;

      this.width = 0;
      this.height = 15;

      $.extend( true, this, properties );

      this.draw = function(){

          var metrics,
              text = 'Health: ' + this.health + ' / Score: ' + this.score;

          ctx.beginPath();
              ctx.fillStyle = 'black';
              ctx.fillRect( this.x, this.y, this.width, this.height );
          ctx.closePath();

          ctx.font = this.height + 'px Arial';
          ctx.fillStyle = 'white';
          ctx.fillText( text, this.x, this.y + this.height );

          metrics = ctx.measureText( text );
          this.width = metrics.width;
      };
  }
  return {

    init: function(){

      var playerWidth = 10,
          playerHeight = 30;

      scoreBoard = new ScoreBoard({
          health: 100,
          x: 20,
          y: 10
      });

      player = new Player({
          x: ctx.canvas.width - 50,
          y: ctx.canvas.height / 2,
          width: playerWidth,
          height: playerHeight,
          color: '255,255,255'
      });

      flag = new Flag({
          x: 50,
          y: ctx.canvas.height,
          width: 10,
          height: 50,
          radius: 5
      });

      ANIMATOR.draw = _draw;

      this.start();
    },

    start: function(){
      ANIMATOR.start();
    },

    stop: function(){
      ANIMATOR.stop();
    },

    destroy: function(){

      ANIMATOR.stop();
      ANIMATOR.draw = function(){};
    },

    clear: function(){
      ctx.clearRect( 0, 0, ctx.canvas.width, ctx.canvas.height );
    }
  }
})();
