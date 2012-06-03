/*
 * fraction.js
 *
 * www.catch22.net
 *
 * Copyright (C) 2012 James Brown
 * Licenced under the MIT licence
 * Please refer to the file LICENCE.TXT for copying permission
 */

// greatest common divisor
function gcd(x, y) {

  while (y != 0) {
    var z = x % y;
    x = y;
    y = z;
  }

  return Math.floor(x);
}

function newfraction0(num, den) {
  return { numerator: num, denominator: den };
}

function normalise_fraction(frac) {

  var num = frac.numerator;
  var den = frac.denominator;

  if(den < 0) {
    num = -num;
    den = -den;
  }

  return newfraction0(num, den);
}

function reduce_fraction(frac) {

  var num = frac.numerator;
  var den = frac.denominator;

  if(frac.numerator != 0 && frac.denominator != 0) {

    var g = gcd(frac.numerator);

    num = Math.floor(num / g);
    den = Math.floor(den / g);
  }

  return normalise_fraction(newfraction0(num,den));
}

// make fraction from decimal/floating number
// returns [numerator,denominator]
function makefraction(floatval) {

  var EPS = 0.0000001;

  var a, b, num, den, ratio;  // floats
  var c, d, e, f, mult;       // ints
  
  a = floatval;
  b = 1.0;
  c = 1;
  d = 0;
  e = 0;
  f = 1;
  
  for(var count = 0; count < 100; count++) {
    mult = Math.floor(a / b);
    a -= mult * b;
    c -= mult * d;
    e -= mult * f;
    num = -e;
    den = c;
    ratio = num / den;
  
    if(floatval - ratio < EPS) {
      return { numerator: -e, denominator: c };
    }
    
    mult = Math.floor(b / a);
    b -= mult * a;
    d -= mult * c;
    f -= mult * e;
    num = f;
    den = -d;
    ratio = num / den;
    
    if(ratio - floatval < EPS) {
      return { numerator: f, denominator: -d };
    }
  }

  // shouldn't ever get here
  return { numerator: 0, denominator: 0 };
}

function fracToString(frac, asRational) {

  var n = Math.abs(frac.numerator);
  var d = frac.denominator;

  var str = '';

  if(n == 0) {
    str = '0';
  }
  else if(n == d) {
    str = '1';
  }
  else if(n < d) {
    str = n.toString() + '/' + d.toString();
  }
  else if(d == 1) {
    str = n.toString();
  }
  else {
    if(asRational) {
      // rational fraction
      var w = Math.floor(n / d);
      n = Math.floor(n % d);
      str = w.toString() + ' ' + n.toString() + '/' + d.toString();
    }
    else {
      // irrational fraction
      str = n.toString() + '/' + d.toString();
    }
  }

  if(frac.numerator < 0) {
    str = '-' + str;
  }
  
  return str;
}

function testfrac() {

  if(event.keyCode == 13) {
     var num = document.getElementById('num');
    num = parseFloat(num.value);


    var frac = makefraction(num);
    var str = fracToString(frac, true);
    console.log(str);

    var res = document.getElementById('res');
    res.value = str;
  }
  event.returnValue=true;
}
