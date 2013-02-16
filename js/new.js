(function() {
  var $body = document.querySelector('body')
    , $canvas = document.createElement('canvas')
    , ctx = $canvas.getContext('2d')
    , points = []
    ;

  $canvas.style.position = 'absolute';
  $canvas.style.left = 0;
  $canvas.style.top = 0;
  $canvas.style.width = '100%';
  $canvas.style.height = '100%';


  resize();
  function resize () {
    $canvas.width = $body.offsetWidth;
    $canvas.height = $body.offsetHeight;
  }
  window.addEventListener('resize', resize );


  document.querySelector('body').appendChild( $canvas );

  function Particle ( options ) {

    this.x = options.x || 0;
    this.y = options.y || 0;
    this.vx = options.vx || 0;
    this.vy = options.vy || 0;
    this.speed = options.speed || 1;

    this.dcolor = 1;
    this.color =
      this.xcolor =
        options.color || 210;

    this.radius = options.radius || 1;

    this.counter = 0;
    this.interval = ( Math.random() * 50 ) + 50;

    this.update = function () {

      var dx = this.vx * this.speed
        , dy = this.vy * this.speed
        ;

      this.x += dx
      this.y += dy;

      this.xcolor += this.dcolor;

      if ( this.xcolor < this.color - 50 || this.xcolor > this.color + 50 )
        this.dcolor *= -1;

      if ( this.x + dx < 0 || this.x + dx  > ctx.canvas.width )
        this.vx *= -1;

      if ( this.y + dy  < 0 || this.y + dy  > ctx.canvas.height )
        this.vy *= -1;

      this.counter += 1;

      if ( this.counter > this.interval ) {

        this.vx *= 1 - ( Math.round( Math.random() ) *2 );
        this.vy *= 1 - ( Math.round( Math.random() ) *2 );

        this.interval = ( Math.random() * 50 ) + 50;
        this.counter = 0;
      }
    }

    this.draw = function () {

      ctx.fillStyle = "hsl("+this.xcolor+",50%,50%)";
      ctx.translate( this.x, this.y );
      ctx.beginPath();
      ctx.arc( -.5, -.5, this.radius, 0, 2*Math.PI );
      ctx.closePath();
      ctx.fill();
    }
  }

  function addParticle(){

    switch ( Math.ceil( Math.random() *4 ) ) {
      case 1:
        points.push(
          new Particle({
            x:      0,
            y:      0,
            vx:     1,
            vy:     1,
            speed:  1,
            radius: 3
          })
        );
        break;

      case 2:
        points.push(
          new Particle({
            x:      ctx.canvas.width,
            y:      0,
            vx:     -1,
            vy:     1,
            speed:  1,
            radius: 3
          })
        );
        break;

      case 3:
        points.push(
          new Particle({
            x:      0,
            y:      ctx.canvas.height,
            vx:     1,
            vy:     -1,
            speed:  1,
            radius: 3
          })
        );
        break;

      case 4:
        points.push(
          new Particle({
            x:      ctx.canvas.width,
            y:      ctx.canvas.height,
            vx:     -1,
            vy:     -1,
            speed:  1,
            radius: 3
          })
        );
        break;
    }

  }

  addParticle();
  setInterval( addParticle, 100 );

  draw();
  function draw () {

    ctx.fillStyle = "rgba(0,0,0,.025)";
    ctx.fillRect( 0, 0, ctx.canvas.width, ctx.canvas.width );

    for ( var i = 0, len = points.length; i < len; i++ ) {
      ctx.save();
      points[ i ].update();
      points[ i ].draw();
      ctx.restore();
    }

    window.requestAnimationFrame( draw );
  }
})();