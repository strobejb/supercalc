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
      but.title = "Mode: Programmer";
      but = document.getElementById('but2');
      but.innerText = NUMBASE;
      but = document.getElementById('but3');
      but.innerText = SIGMODE;
      break;

    case 'Sci':
      but.title = "Mode: Scientific";
      but = document.getElementById('but2');
      but.innerText = ANGLEMODE;
      but = document.getElementById('but3');
      but.innerText = EXPMODE;    
      break;

    case 'Fra':
      but.title = "Mode: Fraction";
      but = document.getElementById('but2');
      but.innerText = ANGLEMODE;
      but = document.getElementById('but3');
      but.innerText = FRACMODE;    
      break;
  }

  evaluate();
  update_tips();
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
      
  evaluate();
  update_tips();
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

  evaluate();
  update_tips();
}

function update_tips() {

    var but1 = document.getElementById('but1');
    var but2 = document.getElementById('but2');
    var but3 = document.getElementById('but3');

    var tip_mode = { 'Prg': 'Mode: Programmer', 'Sci': 'Mode: Scientific', 'Fra': 'Mode: Fractions' };
    var tip_angl = { 'Deg': 'Angle: Degrees', 'Rad': 'Angle: Radians' };    
    var tip_base = { 'Bin': 'Base: Binary', 'Dec': 'Base: Decimal', 'Oct': 'Base: Octal', 'Hex': 'Base: Hexadecimal' };
    var tip_sign = { '+': 'Unsigned', '+/-': 'Signed' };
    var tip_expn = { 'Exp': 'Exponent', 'Fix': 'Fixed point' };
    var tip_frac = { 'Rat': 'Rational numbers', 'Irr': 'Irrational numbers' };

    but1.title = tip_mode[MODE];

    switch(MODE) {
      case 'Prg':
        but2.title = tip_base[NUMBASE];
        but3.title = tip_sign[SIGMODE];
        break;

      case 'Sci': 
        but2.title = tip_angl[ANGLEMODE];
        but3.title = tip_expn[EXPMODE];
        break;
      
      case 'Fra':
        but2.title = tip_angl[ANGLEMODE];
        but3.title = tip_frac[FRACMODE];
        break;
    }

}

function formatValue(num, base, signed, width) {

  // force hex (base16) and binary (base2) to be unsigned always
  if(base != 10) {
    signed = false;
  }

  if(signed == false && num < 0) {
    num = 0xFFFFFFFF + num + 1;
  }

  var valstr = num.toString(base).toUpperCase();

  // 0-pad hex and binary numbers
  if(base != 10) {
    width = width / 4;

    while (valstr.length < width) {
        valstr = "0" + valstr;
    }
  }

  if(base == 2) {
    valstr = valstr.split('').reverse().join('');
    var v = valstr.match(/.{1,8}/g);
    for(var i = 0; i < v.length; i++) {
      v[i] = v[i].split('').reverse().join('');
    }
    valstr = v.reverse().join(' ');
  }
  
  return valstr;
}

function evaluate() {

  // to hex
  var base = {'Bin':2, 'Oct':8, 'Dec':10, 'Hex':16};
  var mode = MODE;
  base = base[NUMBASE];
 
  var signed = SIGMODE == '+' ? false : true;

  var e = Parser.Evaluator();
  var inp = document.getElementById('expression');

  //
  // do the calculation!
  //
  var val = e.evaluate(inp.value, mode);
  inp.title = "";

  if(val != null) {
    //
    //  Interpret the result, depending on if we are
    //  in programmer, scientific or fraction mode
    //
    switch(mode) {
    
      case 'Prg':

        // convert to whole number
        val = Math.floor(val);
        val = formatValue(val, base, signed, parseInt(BITWIDTH));
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
  }
  else {
    val = 'ERR';
  }

  var res = document.getElementById('result');
  res.value = val;
  res.title = val.toString();
}

function showPopup() {

  var str = '<table><tr><th>Name</th><th>Value</th></tr>';

  // VarMap defined in parser.js
  for(var k in VarMap) {
    if(VarMap.hasOwnProperty(k)) {
      str += "<tr><td class='name'>" + k  + '</td><td>' + VarMap[k].toString() + '</td></tr>';
    }
  }

  str += '</table>';

  var url = System.Gadget.path + '\\src\\varmap.html';
  showModelessDialog(url, str, 'dialogWidth:300px;dialogHeight:400px;resizable:1');
}

function loadSettings() {

  var fso = new ActiveXObject("Scripting.FileSystemObject");
  var path = System.Gadget.path + '\\varmap.txt';

  var txtFile = fso.OpenTextFile(path, 1, true, 0);  
  var e = Parser.Evaluator();

  while(!txtFile.AtEndOfStream) {
    var expression = txtFile.ReadLine();
    e.evaluate(expression, '');
  }

  txtFile.Close();
  fso = null;
}

function saveSettings() {

  var fso = new ActiveXObject("Scripting.FileSystemObject");
  var path = System.Gadget.path + '\\varmap.txt';

  var txtFile = fso.OpenTextFile(path, 2, true, 0);  
  
  for(var k in VarMap) {
    if(VarMap.hasOwnProperty(k)) {
      txtFile.WriteLine(k + ' = ' + VarMap[k].toString());
    }
  }

  txtFile.Close();
  fso = null;
}

function calc() {

  // enter pressed: calculate the expression
  if(event.keyCode == 13) {

    var inp = document.getElementById('expression');

    // show list of variables in popup window
    if(inp.value == '?') {
      inp.value = '';
      showPopup();
    }
    // otherwise do the calculation
    else {
      evaluate();
      saveSettings();
    }

    event.returnValue = true;
  }
  // escape pressed: clear the expression
  else if(event.keyCode == 27) {
    var inp = document.getElementById('expression');
    inp.value = '';

    event.returnValue = true;
  }
  // question-mark
  else if(event.keyCode == 191 && event.ctrlKey) {
    showPopup();
    event.returnValue = false;
  }
}


