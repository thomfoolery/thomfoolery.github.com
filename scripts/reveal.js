define(['jquery','utils/windowWatcher','velocity-ui'],
  function reveal ( $, WW ) {

    // setTimeout( function () {
    //   reveal( $('h1') );
    // }, 1000 );

    $( document ).on('scroll', function() {
      window.requestAnimationFrame( onScrollReveal );
    });

    function onScrollReveal () {

      if ( WW.scrollDir == 'up' ) {
        $('.revealed:not(.reveal-child)').each( function ( index, item ) {
          var $item = $(item);
          if ( WW.scrollTop + WW.height < $item.offset().top )
            conseal( $item );
        });
      }

      else {
        $('.reveal').each( function ( index, item ) {
          var $item = $(item);
          if ( $item.offset().top + 100 <= WW.scrollTop + WW.height )
            reveal( $item );
        });
      }
    }

    function reveal ( $item ) {

      var transition = $item.data('revealTransition') || 'transition.slideDownBigIn'
        , opacity    = 0
        , options    = {}
        , $children  = $item.data('$children')
        ;

      if ( $item.data('revealDelay') ) {
        options.delay = $item.data('revealDelay');
      }

      if ( $item.data('revealDuration') ) {
        options.duration = $item.data('revealDuration');
      }

      if ( $children === undefined ) {
        $children = $item.find('.reveal-child')
        $item.data('$children', $children );
      }

      $item
        .removeClass('reveal')
      ;

      if ( $children.size() ) {
        options.stagger = $item.data('revealStagger') || 200;
        $item.css('opacity', 1 ).addClass('revealed');
        $item = $children;
      }

      $item
        .addClass('revealed')
        .velocity(
          transition,
          options
        )
      ;
    }

    function conseal ( $item ) {
      $item
        .css('opacity', 0 )
        .addClass('reveal')
        .removeClass('revealed')
      .find('.reveal-child')
        .removeClass('revealed')
        .css('opacity', 0 )
      ;
    }

  }
);