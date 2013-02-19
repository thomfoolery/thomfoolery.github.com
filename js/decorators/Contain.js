function Contain ( base ) {

  var Contain = Object.create( base );

  if ( Contain.properties.dir ) {

    Contain.update = function ( timeDelta ) {

      var props = this.properties
        , ctx = this.ctx
        ;

      if ( props.x + props.dx < 0 ) {
        props.x = ctx.canvas.width;
      }
      else if ( props.x + props.dx > ctx.canvas.width ) {
        props.x = 0;
      }

      if ( props.y + props.dy < 0 ) {
        props.y = ctx.canvas.height;
      }
      else if ( props.y + props.dy > ctx.canvas.height ) {
        props.y = 0;
      }

      base.update.call( this, timeDelta );
    };
  }
  else {
    Contain.update = function ( timeDelta ) {

      var props = this.properties
        , ctx = this.ctx
        ;

      if ( props.x + props.dx < 0 || props.x + props.dx  > ctx.canvas.width )
        props.vx *= -1;

      if ( props.y + props.dy  < 0 || props.y + props.dy  > ctx.canvas.height )
        props.vy *= -1;

      base.update.call( this, timeDelta );
    };
  }

  return Contain;
}