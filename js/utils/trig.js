var TRIG = {
	
	// determine the distanc ebetween 2 points
	distance: function ( x1, y1, x2, y2 ) {
		
		var x, y, hypotenuse;
		
		// find horizontal distance (x)
		x = x2 - x1;
		// find vertical distance (y)
		y = y2 - y1;
		
		hypotenuse = Math.sqrt( x*x + y*y );
		
		return hypotenuse;
	},
	
	// determine the angle between 2 points in radians
	angle: function ( x1, y1, x2, y2 ) {
		
		var x, y, radians;
		
		// find horizontal distance (x)
		x = x2 - x1;
		// find vertical distance (x)
		y = y2 - y1;
		
		radians = Math.atan2( y, x );
		
		return radians;
	},
	
	// convert degrees to radians
	degreesToRadians: function ( angle ) {
		
		return ( ( angle * Math.PI ) / 180 );
	},
	
	// convert radians to degrees
	radiansToDegees: function ( angle ) {
		
		return ( ( angle * 180 ) / Math.PI );
	}
}

var PHYSICS = {
	
	// determine the velocity
	velocity: function( speed, angle ){
		
		var vX, vY, velocity;
		
		// determine horizontal velocity (vX)
		vX = speed * Math.cos( angle );
		// determine vertical velocity (vY)
		vY = speed * Math.sin( angle );
		
		velocity = { 'vX': vX, 'vY': vY };
		
		return velocity;
	}
}