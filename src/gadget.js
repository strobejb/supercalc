/*
 * gadget.js
 *
 * www.catch22.net
 *
 * Copyright (C) 2012 James Brown
 * Licenced under the MIT licence
 * Please refer to the file LICENCE.TXT for copying permission
 */

var oGadgetDocument = System.Gadget.document;
 
function init() {

  System.Gadget.onDock   = resizeGadget;
  System.Gadget.onUndock = resizeGadget;

  resizeGadget();
}

function resizeGadget() {

  var mainBody = document.body;

  var oBackground = document.getElementById("imgBackground");
  var oSupercalc  = document.getElementById("supercalc");
    
  System.Gadget.beginTransition();

  if(System.Gadget.docked == true) {
     
    mainBody.style.width  = 129;
    mainBody.style.height = 134;

    oBackground.src = "../img/docked.png";
    oSupercalc.className = "gadgetDocked";
  }
  else {
       
    mainBody.style.width  = 258; 
    mainBody.style.height = 134;

    oBackground.src = "../img/undocked.png";
    oSupercalc.className = "gadgetUndocked";
  }

  System.Gadget.endTransition(System.Gadget.TransitionType.morph, 2.0);  
}

document.onreadystatechange = function() {    
  if(document.readyState=="complete") {
    init();
  }        
}


