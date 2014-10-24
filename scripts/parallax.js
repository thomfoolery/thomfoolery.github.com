define(['jquery','utils/windowWatcher','utils/easingFunctions'],
  function( $, WW, EF ) {

    var $parallaxContainers = $('[parallax-container]');

    $('[data-toggle]').on('click', function () {
      $($(this).toggleClass('toggled').data('toggle')).slideToggle({
        "step": function () { $(document).scroll(); }
      });
    });

    if ( WW.breakpoint != 'xs' ) {
      $(document).on('scroll', function () {
        requestAnimationFrame(onScroll)
      }).scroll();
    }

    WW.onBreakpointChange( function( breakpoint ) {
      if ( WW.breakpoint != 'xs' ) {
        $(document).on('scroll.parallax', function () {
          requestAnimationFrame(onScroll)
        }).scroll();
      } else {
        reset();
        $(document).off('scroll.parallax');
      }
    });

    function onScroll () {
      $parallaxContainers.each( function ( index, container ) {
        var $container = $(container)
          , p = (WW.scrollTop + WW.height - $container.offset().top) / ($container.outerHeight() + WW.height)
          ;
        if ( p < 0 ) return false; // exit
        if ( p > 1 ) return; // exit
        $container.find('[parallax-element]').each( function ( index2, item ){
          var $item = $(item)
            , parallax = $item.data('parallax-scale') || 0.2
            , y
            ;
          if ( $item.hasClass('layer-background') ) {
            y = Math.round((WW.scrollTop + WW.height - $container.offset().top ) * parallax );
          } else {
            y = Math.round((($container.offset().top + ($container.outerHeight() / 2 )) - (WW.scrollTop + (WW.height / 2 ))) * parallax );
            $item.css('opacity', EF.easeInOutQuad(p,0,1,.5).toFixed(2) );
          }
          $item.css('transform', 'translate3d(0,'+y+'px,0)');
        });
      });
    }

    function reset () {
      $('[parallax-element]').css('transform', 'translate3d(0,0,0)');
    }

  }
);