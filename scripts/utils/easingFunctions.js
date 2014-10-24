define( function easingFunctions ( $ ) {
  return {
    "easeInOutQuad": function easeInOutQuad (t, b, c, d) {
      return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
    }
  }
});