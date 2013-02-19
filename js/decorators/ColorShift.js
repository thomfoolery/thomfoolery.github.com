function ColorShift ( base ) {

  var ColorShift = Object.create( base )
    , props = ColorShift.properties
    ;

  props.color.a = props.color.h;
  props.color.v = 1;

  ColorShift.update = function ( timeDelta ) {

    var props = this.properties;

    if ( props.color.h +1 > props.color.a +50 )
      props.color.v *= -1;

    else if ( props.color.h -1 < props.color.a -50 )
      props.color.v *= -1;

    props.color.h += props.color.v;

    base.update.call( this, timeDelta );
  }

  return ColorShift;
}