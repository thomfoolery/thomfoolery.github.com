function Flock ( base, options ) {

  var Flock = Object.create( base )
    , props = Flock.properties
    ;

  Flock.update = function ( timeDelta ) {

    var props = this.properties
      , neighbours = []
      ;

    loop:
    for ( index in options.entities ) {

      if ( options.entities[ index ] === this )
        continue loop; // EXIT

    }

    base.update.call( this, timeDelta );
  }

  return Flock;
}