function Entity ( ctx, properties ) {

  this.ctx = ctx;
  this.properties = {

    position: properties.position || new Vector(),
    velocity: properties.velocity || new Vector(),
    speed:    ( properties.speed  || 1 ),

    radius: ( properties.radius || 0.5 ),

    color: properties.color || {
      h: 210,
      s: 50,
      l: 50
    }
  };

  if ( properties ) {
    for ( var prop in properties ) {
      if ( this.properties[ prop ] === undefined )
        this.properties[ prop ] = properties[ prop ];
    }
  }

  this.getProperty = function ( name ) {
    return this.properties[ name ];
  };

  this.update = function ( timeDelta ) {

    var props = this.properties;
    props.position.add( props.velocity );
  };

  this.draw = function () {

    var props = this.properties
      , ctx = this.ctx
      ;

    ctx.save();
      ctx.fillStyle = "hsl(" + props.color.h + "," + props.color.s + "%," + props.color.l + "%)";
      ctx.translate( props.position.x, props.position.y );

      ctx.beginPath();
        ctx.arc( -0.5, -0.5, props.radius, 0, 2 * Math.PI );
      ctx.closePath();

      ctx.fill();
    ctx.restore();

  };
}