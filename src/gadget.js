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

var zoom = 1.0;// 1.5;
 
function init() {

  System.Gadget.onDock   = resizeGadget;
  System.Gadget.onUndock = resizeGadget;

  resizeGadget();
}

function resizeGadget() {

  var mainBody = document.body;

  var oBackground = document.getElementById("imgBackground");
  var oBackground2 = document.getElementById("Bg2");
  var oSupercalc  = document.getElementById("supercalc");

  var oExpr =  document.getElementById("expression");
    
  System.Gadget.beginTransition();

  oBackground.removeObjects();

  if(System.Gadget.docked == true) {
     
    mainBody.style.width  = 129;
    mainBody.style.height = 134;

   // System.Gadget.background = "../img/docked.png";//docked.png";
    //System.Gadget.background = "../img/docked.png";    
    //
    var img = oBackground.addImageObject("../img/docked.png", 0,0);
    img.opacity = 100;
    img.width   = img.width * zoom;//129 * zoom;
    img.height  = img.height * zoom;//134 * zoom;

    oBackground.src = "../img/back1.png";//docked.png";
    oSupercalc.className = "gadgetDocked";

    oExpr.className = "";

   // oSupercalc.src = '../img/docked.png';
  }
  else {
       
    mainBody.style.width  = 300;//258 * zoom; 
    mainBody.style.height = 78 ;//134;

    var img = oBackground.addImageObject("../img/undocked4.png", 0,0);
    img.opacity = 100;  
    img.width   = img.width * zoom;//129 * zoom;
    img.height  = img.height * zoom;  

    //oBackground.src = "../img/undocked2.png";
    //System.Gadget.background = "../img/undocked2.png";
    oSupercalc.className = "gadgetUndocked";
  }

  System.Gadget.endTransition(System.Gadget.TransitionType.morph, 2.0);  

  // fix
  window.setTimeout(fixgBackground, transitionDelay*1000 + 300);
    System.Gadget.background   = System.Gadget.background;

}

document.onreadystatechange = function() {    
  if(document.readyState=="complete") {
    init();
  }        
}


