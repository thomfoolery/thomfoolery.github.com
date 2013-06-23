function ColorShift ( base, options ) {

  var ColorShift = Object.create( base )
    , props = ColorShift.properties
    , options = options || {}

    , range     = options.range || 100
    , alpha     = props.color.h
    , direction = 1
    ;

  ColorShift.update = function ( timeDelta ) {

    var props = this.properties;

    if ( props.color.h +1 > alpha + (range/2)
      || props.color.h -1 < alpha - (range/2) )
      direction *= -1;

    props.color.h += direction;

    base.update.call( this, timeDelta );
  }

  return ColorShift;
}