"use strict"

require.config({
  paths: {
    "jquery":       '../bower_components/jquery/dist/jquery'
    ,"velocity":     '../bower_components/velocity/velocity'
    ,"velocity-ui":  '../bower_components/velocity/velocity.ui'
    // ,"bs-affix":      '../bower_components/bootstrap-sass-official/vendor/assets/javascripts/bootstrap/affix'
    // ,"bs-alert":      '../bower_components/bootstrap-sass-official/vendor/assets/javascripts/bootstrap/alert'
    // ,"bs-button":     '../bower_components/bootstrap-sass-official/vendor/assets/javascripts/bootstrap/button'
    // ,"bs-carousel":   '../bower_components/bootstrap-sass-official/vendor/assets/javascripts/bootstrap/carousel'
    // ,"bs-collapse":   '../bower_components/bootstrap-sass-official/vendor/assets/javascripts/bootstrap/collapse'
    // ,"bs-dropdown":   '../bower_components/bootstrap-sass-official/vendor/assets/javascripts/bootstrap/dropdown'
    ,"bs-modal":      '../bower_components/bootstrap-sass-official/vendor/assets/javascripts/bootstrap/modal'
    // ,"bs-popover":    '../bower_components/bootstrap-sass-official/vendor/assets/javascripts/bootstrap/popover'
    // ,"bs-scrollspy":  '../bower_components/bootstrap-sass-official/vendor/assets/javascripts/bootstrap/scrollspy'
    // ,"bs-tab":        '../bower_components/bootstrap-sass-official/vendor/assets/javascripts/bootstrap/tab'
    // ,"bs-tooltip":    '../bower_components/bootstrap-sass-official/vendor/assets/javascripts/bootstrap/tooltip'
    ,"bs-transition": '../bower_components/bootstrap-sass-official/vendor/assets/javascripts/bootstrap/transition'
  },
  shim: {
    "velocity":      { deps: ['jquery'] }
    ,"velocity-ui":   { deps: ['velocity'] }
    // ,"bs-affix":      { deps: ['jquery'] }
    // ,"bs-alert":      { deps: ['jquery','bs-transition'] }
    // ,"bs-button":     { deps: ['jquery'] }
    // ,"bs-carousel":   { deps: ['jquery','bs-transition'] }
    // ,"bs-collapse":   { deps: ['jquery','bs-transition'] }
    // ,"bs-dropdown":   { deps: ['jquery'] }
    ,"bs-modal":      { deps: ['jquery','bs-transition'] }
    // ,"bs-popover":    { deps: ['jquery','bs-tooltip'] }
    // ,"bs-scrollspy":  { deps: ['jquery'] }
    // ,"bs-tab":        { deps: ['jquery','bs-transition'] }
    // ,"bs-tooltip":    { deps: ['jquery','bs-transition'] }
    ,"bs-transition": { deps: ['jquery'] }
  }
});

require(['app','velocity','velocity-ui','jquery','bs-modal','utils/requestAnimationFrame'],
  function ( app, velocity, velocityUI, $ ) {
    'use strict';
    console.log( app );
    console.log('Running jQuery %s', $().jquery );
  }
);