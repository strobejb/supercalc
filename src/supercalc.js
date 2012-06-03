/*
 * supercalc.js
 *
 * www.catch22.net
 *
 * Copyright (C) 2012 James Brown
 * Licenced under the MIT licence
 * Please refer to the file LICENCE.TXT for copying permission
 */

var BITWIDTH='32';
var BITWIDTH_VALS =  [ '8','16','32','64'];

var MODE='Prg';
var MODE_VALS = ['Prg', 'Sci', 'Fra'];
var NUMBASE='Dec';
var NUMBASE_VALS = [ 'Bin', /*'Oct',*/ 'Dec', 'Hex' ];
var NUMTYPE='Sci';
var NUMTYPE_VALS = [ 'Fra', 'Sci', 'Prg' ];
var SIGMODE='+/-';
var SIGMODE_VALS = [ '+/-', '+' ];


var ANGLEMODE = 'Deg';
var ANGLEMODE_VALS = ['Deg','Rad'];
var FRACMODE = 'Rat';
var FRACMODE_VALS = ['Rat','Irr'];
var EXPMODE = 'Fix';
var EXPMODE_VALS = ['Fix','Exp'];

/*

var Supercalc;
Supercalc = Supercalc || {};

Supercalc.Mode = {
  PROGRAMMER: 'Prg',
  SCIENTIFIC: 'Sci',
  FRACTION:   'Fra'
}

Supercalc.NumBase = {
  BIN: 'Bin',
  DEC: 'Dec',
  HEX: 'Hex'
}

Supercalc.SignMode = {
  SIGNED: '+/-',
  UNSIGNED: '+'
}

Supercalc.AngleMode = {
  DEGREES: 'Deg',
  RADIANS: 'Rad',
}

Supercalc.FloatMode {
  FIXED: 'Fix',
  FLOAT: 'Exp',
}

Supercalc.FractionMode {
  RATIONAL: 'Rat',
  IRRATIONAL: 'Irr'
}

Supercalc.ModeList = [ PROGRAMMER, SCIENTIFIC, FRACTION ];
Supercalc.BaseList = [ BIN,DEC,HEX]
Supercalc.SignList = [ SIGNED, UNSIGNED ]
Supercalc.AngleList = [ DEGREES, RADIANS ]
Supercalc.FloatList = [ FIXED, FLOAT ]
Supercalc.FractList = [ RATIONAL, IRRATIONAL ]

Supercalc.Smeg = function() {

  var mode       = Supercalc.PROGRAMMER;
  var sign_mode  = Supercalc.SIGNED;
  var angle_mode = Supercalc.DEGREES;
  var numbase    = Supercalc.DECIMAL;
  var float_mode = Supercalc.FIXED;
  var fract_mode = Supercalc.RATIONAL;

  function nextmode() {
    var but = document.getElementById('but1');

    mode = nextval(ModeList, mode);
    but.innerText = mode;

    // change button 2+3 text
    switch(mode) {
      case Supercalc.PROGRAMMER:
        but = document.getElementById('but2');
        but.innerText = numbase;
        but = document.getElementById('but3');
        but.innerText = sign_mode;
        break;

      case Supercalc.SCIENTIFIC:
        but = document.getElementById('but2');
        but.innerText = angle_mode;
        but = document.getElementById('but3');
        but.innerText = float_mode;    
        break;

      case Supercalc.FRATION:
        but = document.getElementById('but2');
        but.innerText = angle_mode;
        but = document.getElementById('but3');
        but.innerText = fract_mode;    
        break;
    }  
  }

  return {
    smeg: Smeg
  }
}
*/

/*function butclick() {

  var but=document.getElementById("imgTest");

  but.src = 'but2.png';//gimage:///but2.png';

  but=document.getElementById("but2");
  but.style.backgroundColor="#ff0000";
}*/

function butover(elem) {
  var but = document.getElementById(elem);
  but.className = "button hover";
}

function butout(elem) {
   var but = document.getElementById(elem);
   but.className = "button";
}

function contains(a, obj) {
    
    return -1;
}

function nextval(a,val) {

  for (var i = 0; i < a.length; i++) {
        if (a[i] === val) {
            i = i + 1;
            if(i >= a.length) {
              i = 0;
            }
            return a[i];
        }
    }

  return -1;
}





function bitwidth_click() {

  var but = document.getElementById('but1');

  BITWIDTH = nextval(BITWIDTH_VALS, BITWIDTH);
  but.innerText = BITWIDTH;
}

function mode_click() {

  var but = document.getElementById('but1');

  MODE = nextval(MODE_VALS, MODE);
  but.innerText = MODE;

  // change button 2+3 text
  switch(MODE) {
    case 'Prg':
      but = document.getElementById('but2');
      but.innerText = NUMBASE;
      but = document.getElementById('but3');
      but.innerText = SIGMODE;
      break;

    case 'Sci':
      but = document.getElementById('but2');
      but.innerText = ANGLEMODE;
      but = document.getElementById('but3');
      but.innerText = EXPMODE;    
      break;

    case 'Fra':
      but = document.getElementById('but2');
      but.innerText = ANGLEMODE;
      but = document.getElementById('but3');
      but.innerText = FRACMODE;    
      break;
  }

  eval();
}


function but3_click() {

  var but = document.getElementById('but3');

  switch(MODE) {
    case 'Prg':
      SIGMODE = nextval(SIGMODE_VALS, SIGMODE);
      but.innerText = SIGMODE;
      break;

    case 'Sci': 
      EXPMODE = nextval(EXPMODE_VALS, EXPMODE);
      but.innerText = EXPMODE;
      break;

    case 'Fra':
      FRACMODE = nextval(FRACMODE_VALS, FRACMODE);
      but.innerText = FRACMODE;
      break;
  }
      
  eval();
}

function but2_click() {

  var but = document.getElementById('but2');

  switch(MODE) {
    case 'Prg':
      NUMBASE = nextval(NUMBASE_VALS, NUMBASE);
      but.innerText = NUMBASE;
      break;

    case 'Sci': case 'Fra':
      ANGLEMODE = nextval(ANGLEMODE_VALS, ANGLEMODE);
      but.innerText = ANGLEMODE;
      break;
  }

  eval();
}

function formatValue(num, base, signed, width) {

  if(base != 10) {
    signed = true;
  }

  if(num < 0) {
    num = 0xFFFFFFFF + num + 1;
  }

  var valstr = num.toString(base).toUpperCase();

  if(base != 10) {
    width = width / 4;
   // alert(width);
    while (valstr.length < width) {
        valstr = "0" + valstr;
    }
  }
  
  return valstr;
}

function eval() {

  // to hex
  var base = {'Bin':2, 'Oct':8, 'Dec':10, 'Hex':16};
  var mode = MODE;
  base = base[NUMBASE];

  var e = Parser.Evaluator();
  var inp = document.getElementById('expression');

  // do the calculation!
  //
  var val = e.evalulate(inp.value, mode);

  switch(mode) {
    
    case 'Prg':
      // convert to whole number
      val = Math.floor(val);
      val = formatValue(val, base, false, parseInt(BITWIDTH));
      break;

    case 'Sci':
      // its already a floating-point number, do nothing
      if(EXPMODE == 'Fix') {
        //val = val.toFixed();
      }
      else {
        val = val.toExponential();
      }
      break;

    case 'Fra':
      // convert to fraction
      val = makefraction(val);
      val = fracToString(val, FRACMODE == 'Rat' ? true : false);
      break;
  }

  var res = document.getElementById('result');
  res.value = val;

}

function oof() {

  if(event.keyCode == 13) {

    eval();
  }
  event.returnValue=true;
}
