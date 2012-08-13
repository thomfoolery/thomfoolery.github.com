/*
 * extend a subclass with a superclass */
function extend ( subClass, superClass ) {
	
	function F () {}
	F.prototype = superClass.prototype;
	subClass.prototype = new F();
	subClass.prototype.constructor = subClass;
	
	subClass.superClass = superClass.prototype;
	if ( superClass.prototype.constructor == Object.prototype.constructor ){
		superClass.prototype.constructor = superClass;
	}
}

/*
 * Clone an object ( or Class ) */
function clone ( object ) {
	
	function F () {}
	F.prototype = object;
	return F;
}

/*
 * Mix the interface of one class into another */
function augment ( recievingClass, givingClass ) {
	
	if ( arguments[ 2 ] ) { // only provided method names
		
		var i, len = arguments.length;
		
		for ( i = 2; i < len; i++ ){
			recievingClass.prototype[ arguments[ i ] ] = givingClass.prototype[ arguments[ i ] ];
		} 
	}
	else {
		
		var methodName;
		
		for ( methodName in givingClass.prototype ){
			if ( ! recievingClass.prototype[ methodName ] ){
				recievingClass.prototype[ methodName ] = givingClass.prototype[ methodName ];
			}
		}
	}
}

/*
 * CLASSES
 * =======
 * 
 * - Point
 * - Vector
 * - Circle
 * - Ball
 * 
 */

/*
 * Point :: Class 
 * =====
 *   
 *   properties:
 *     x, y
 *   
 *   methods:
 *     draw()
 * */
function Point ( opt ) {
	
	// attributes
	this.x		= opt.x		|| 0;
	this.y		= opt.y		|| 0;
	this.color	= opt.color	|| 'black';
	
	// methods
	this.draw = function () { /* TO DO */ };
};

/*
 * Circle :: Class - subclass of Point
 * ======
 *   
 *   properties:
 *     x, y, radius
 *   
 *   methods:
 *     draw()
 * */
function Circle ( opt ) {
	
	// call super constructor
	Circle.superClass.constructor.call( this, opt );
	
	// attributes
	this.radius	= opt.radius || 10;
	
	// methods
	this.draw = function () {
		
		ctx.fillStyle	= this.color;
		ctx.lineWidth	= 0;
		
		//draw a circle
		ctx.beginPath();
		ctx.arc( this.x, this.y, this.radius, 0, Math.PI*2, true); 
		ctx.closePath();
		ctx.fill();
	};
};
extend( Circle, Point );

/*
 * Velocity :: Class - subclass of Point
 * ======
 *   
 *   properties:
 *     x, y, speed, angle, gravity, friction
 *   
 *   methods:
 *     getVelocityData()
 * */
Velocity = function () {};
Velocity.prototype = {
	// properties
	'vx':		0,
	'vy':		0,
	'speed':	100, // pixels / second
	'angle':	0,
	'gravity':	0,
	'friction':	0,
	
	// methods
	'getVelocityData': function () {
		
		this.vx = this.speed * Math.cos( TRIG.degreesToRadians( this.angle ) );
		this.vy = this.speed * Math.sin( TRIG.degreesToRadians( this.angle ) );
	}
};

/*
 * Gravity :: Mix In
 * ======
 *   
 *   properties:
 *     x, y, gravity
 *   
 *   methods:
 *     applyGravity()
 * */
function Gravity () {}
Gravity.prototype = {
	// properties
	'gravity': 0,
	
	// methods
	'applyGravity': function () {
		
		if ( this.gravity ) {
			this.y += this.gravity
		}
	}
};

/*
 * Friction :: Mix In
 * ======
 *   
 *   properties:
 *     x, y, friction
 *   
 *   methods:
 *     applyFriction()
 * */
function Friction () {}
Friction.prototype = {
	// properties
	'friction': 0,
	
	// methods
	'applyFriction': function () {
		
		if ( this.friction ) {
			this.speed *= this.friction;
		}
	}
};

/*
 * Ball :: Class - subclass of Vector
 * ====
 *   
 *   properties:
 *     x, y, speed, angle, gravity, friction, radius
 *   
 *   methods:
 *     update()
 *     draw()
 * */
function Ball ( opts ){
	
	// call super constructor
	Ball.superClass.constructor.call( this, opts );
	
	// properties
	this.radius		= 10;
	this.color		= 'black';
	
	for ( var opt in opts ) {
		if ( this[ opt ] != undefined ) {
			this[ opt ] = opts[ opt ];
		}
	}
	
	// methods
	this.update = function ( timeToCall ) {
		
		// apply gravity if not below the screen 
		if ( this.y < canvas.height - this.radius -2) {
			this.applyGravity();
		}
		
		// apply friction
		this.applyFriction();
		
		// get velocity data
		this.getVelocityData();
		
		if ( this.x < 0 + this.radius ){ //}&& this.vx < 0 ){
			this.x = this.radius;
			this.vx *= -1
		}
		if ( this.x > canvas.width - this.radius ){ //&& this.vx > 0 ) {
			this.x = canvas.width - this.radius;
			this.vx *= -1
		}
		if ( this.y < 0 + this.radius ){ //&& this.vy < 0 ){
			this.y = this.radius;
			this.vy *= -1
		}
		if ( this.y > canvas.height - this.radius ){ //&& this.vy > 0 ) {
			this.y = canvas.height - this.radius;
			this.vy *= -1
		}
		
		this.speed = Math.sqrt( ( this.vx * this.vx ) + ( this.vy * this.vy ) );
		this.angle = TRIG.radiansToDegees( Math.atan2( this.vy, this.vx ) );
		
		this.x += this.speed * Math.cos( TRIG.degreesToRadians( this.angle ) );
		this.y += this.speed * Math.sin( TRIG.degreesToRadians( this.angle ) );
		
		balls[ i ].draw();
	};
	
	this.draw = function () {
		
		ctx.fillStyle	= this.color;
		ctx.lineWidth	= 0;
		
		//draw a circle
		ctx.beginPath();
		ctx.arc( this.x, this.y, this.radius, 0, Math.PI*2, true); 
		ctx.closePath();
		ctx.fill();
	};
}

extend( Ball, Point );

augment( Ball, Gravity );
augment( Ball, Friction );
augment( Ball, Velocity );