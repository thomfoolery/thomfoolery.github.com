var particles = [],
    interval = 0,

    CLEAR_ON_FRAME_REQUEST 	= false,
    FRAME_FILL_OPACITY 			= .25,

    GRAVITY 				= 10,	// 	px / sec
    FRICTION 				= .9,
    FLOOR_FRICTION 	= 2
    ;

// on mouse down
$( window ).mousedown(function( e ){
    var i = particles.length;
    while ( i-- ){
        particles[ i ].speed += Math.random() * 10  + 1;
        particles[ i ].angle += 270; // up
    }
});

function start_ex_3(){

    ANIMATOR.start();
}

function ANIMATE( timeLapsed ){

        // ignore queued animation frame requests
    if ( timeLapsed > 160 ) return;

    interval += timeLapsed;

    if ( CLEAR_ON_FRAME_REQUEST ) { ctx.clearRect( 0, 0, ctx.canvas.width, ctx.canvas.height ); }

    ctx.fillStyle = 'rgba(0,0,0,' + FRAME_FILL_OPACITY + ')';
    ctx.fillRect( 0, 0, ctx.canvas.width, ctx.canvas.height );

    if ( interval > 2000 ) {

        particles.push( new Particle({
                x: 0,
                y: ctx.canvas.height / 2,
                radius: Math.random() * 12 + 3,
                speed: Math.random() * 10 + 20,
                angle: Math.random() * 90 + 315
            })
        );

        if ( particles.length > 3 ) {
            if ( particles.length > 4 ) {
                particles.splice( 0, 1 );
            }
            particles[ 0 ].fadeOut();
        }

        interval = 0;
    }

    var i = particles.length;
    while ( i-- ){
        particles[ i ].update( timeLapsed );
        particles[ i ].draw();
    }
}

function Particle( properties ){

    this.x = 0;
    this.y = 0;

    this.color = '255,0,0';
    this.opacity = 1;
    this.highlightColor = '255,255,255';
    this.lineWidth = 5;

    this.radius = 10;
    this.angle = 0;
    this.vel = { x: 0, y: 0 };
    this.speed = 0;

    var _isHighlighted = false,
        _isFadingOut = false;

    $.extend( this, properties );

        // convert angle to velocity vector
    this.vel.x = this.speed * Math.cos( degToRad( this.angle ) );
    this.vel.y = this.speed * Math.sin( degToRad( this.angle ) );

    this.update = function( timeLapsed ){

        var timeLapsePercent 	= timeLapsed / 1000,
            gravity 					= GRAVITY * timeLapsePercent,
            friction 					= 1 - FRICTION * timeLapsePercent,
            floorFriction 		= 1 - FLOOR_FRICTION * timeLapsePercent;

            // convert angle to velocity vector
        this.vel.x = this.speed * Math.cos( degToRad( this.angle ) );
        this.vel.y = this.speed * Math.sin( degToRad( this.angle ) );

        this.contain()
            // apply GRAVITY
        this.vel.y += gravity;

            // recalculate speed and angle;
        this.speed = Math.sqrt( ( this.vel.x * this.vel.x ) + ( this.vel.y * this.vel.y ) );
        this.angle = radToDeg( Math.atan2( this.vel.y, this.vel.x ) );

            // apply FRICTION
        this.speed *= friction;
            // apply FLOOR FRICTION
        if ( this.y === canvasHeight - ( this.radius + ( this.lineWidth / 2 ) ) ){
            this.vel.x *= floorFriction;
        }

             // apply velocity vector
        this.x += this.vel.x;
        this.y += this.vel.y;

            // is fading out?
        if ( _isFadingOut ){
            this.opacity -= 1 * timeLapsePercent;
        }

            // is mouse over?
        this.isMouseOver();
    }

    this.contain = function() {
            // left wall
        if ( this.x < this.radius + ( this.lineWidth / 2 ) ){
            this.x = this.radius + ( this.lineWidth / 2 );
            this.vel.x *= -1;
        }
            // ceiling
        if ( this.y < 0 + this.radius + ( this.lineWidth / 2 ) ) {
            this.y = 0 + this.radius + ( this.lineWidth / 2 );
            this.vel.y *= -1;
        }
            // right wall
        if ( this.x > ctx.canvas.width - ( this.radius - ( this.lineWidth / 2 ) ) ){
            this.x = ctx.canvas.width - this.radius - ( this.lineWidth / 2 );
            this.vel.x *= -1;
        }
            // floor
        if ( this.y > canvasHeight - ( this.radius + ( this.lineWidth / 2 ) ) ){
            this.y = canvasHeight - this.radius - ( this.lineWidth / 2 );
            this.vel.y *= -.9;
        }
    }

    this.fadeOut = function(){
        _isFadingOut = true;
    }

    this.isMouseOver = function(){
            // is mouse over?
        if ( mouseX >= this.x - this.radius
            && mouseX <= this.x + this.radius
            && mouseY >= this.y - this.radius
            && mouseY <= this.y + this.radius ){

            _isHighlighted = true;
        }
        else{
            _isHighlighted = false;
        }
    }

    this.draw = function(){

        ctx.lineWidth = this.lineWidth;
        ctx.lineCap = 'round';
        ctx.strokeStyle = 'rgba(' + (( _isHighlighted ) ? this.highlightColor : this.color ) + ',' + this.opacity +')';

        ctx.beginPath();

                // vertical line
            ctx.moveTo( this.x, this.y - this.radius );
            ctx.lineTo( this.x, this.y + this.radius );
            ctx.stroke();

                // horizontal line
            ctx.moveTo( this.x - this.radius, this.y );
            ctx.lineTo( this.x + this.radius, this.y );
            ctx.stroke();

        ctx.closePath();
    };
}

start_ex_3();
