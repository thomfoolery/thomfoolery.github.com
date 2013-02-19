function Point ( ctx, properties ) {

  this.ctx = ctx;
  this.properties = {

    x: properties.x || 0,
    y: properties.y || 0,
    vx: properties.vx || 1,
    vy: properties.vy || 1,
    dx: properties.dx || 1,
    dy: properties.dy || 1,

    speed: properties.speed || 1,
    radius: properties.radius || 1,

    color: properties.color || {
      h: 210,
      s: 50,
      l: 50
    }
  }

  if ( properties ) {
    for ( var prop in properties ) {
      if ( this.properties[ prop ] === undefined )
        this.properties[ prop ] = properties[ prop ];
    }
  }

  this.getProperty = function ( name ) {
    return this.properties[ name ];
  }

  this.update = function update ( timeDelta ) {

    var props = this.properties;

    props.dx = props.vx * props.speed;
    props.dy = props.vy * props.speed;

    props.x += props.dx;
    props.y += props.dy;
  }

  this.draw = function draw () {

    var props = this.properties
      , ctx = this.ctx
      ;

    ctx.fillStyle = "hsl(" + props.color.h + "," + props.color.s + "%," + props.color.l + "%)";
    ctx.translate( props.x, props.y );

    ctx.beginPath();
      ctx.arc( -.5, -.5, props.radius, 0, 2*Math.PI );
    ctx.closePath();

    ctx.fill();

  }

}