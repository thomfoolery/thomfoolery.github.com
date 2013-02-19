function Swim ( base, options ) {

  if ( ! base.properties.dir ) return base;// EXIT

  var Swim = Object.create( base )
    , props = Swim.properties
    ;

  props.dir = {
    d: props.dir,
    a: props.dir,
    v: 1,
    t: 0
  };

  props.vx = Math.cos( ( props.dir.d * Math.PI ) / 180 );
  props.vy = Math.sin( ( props.dir.d * Math.PI ) / 180 );

  Swim.update = function ( timeDelta ) {

    var props = this.properties;

    props.dir.t += 1;
    props.dir.t %= 50;

    if ( props.dir.t === 49 )
      props.dir.a += ( Math.random() > .5 ? 1: -1 ) * Math.ceil( Math.random() * 90 );

    if ( props.dir.d + props.dir.v === props.dir.a + 20
      || props.dir.d + props.dir.v === props.dir.a - 20 )
      props.dir.v *= -1;

    else if ( props.dir.d + props.dir.v > props.dir.a + 20 )
      props.dir.d += -1;

    else if ( props.dir.d + props.dir.v < props.dir.a - 20 )
      props.dir.d += 1;

    else
      props.dir.d += props.dir.v;

    props.vx = Math.cos( ( props.dir.d * Math.PI ) / 180 );
    props.vy = Math.sin( ( props.dir.d * Math.PI ) / 180 );

    base.update.call( this, timeDelta );

  };

  return Swim;
}