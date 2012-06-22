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

var zoom = 1.25;// 1.5;
 
function init() {

  System.Gadget.onDock   = resizeGadget;
  System.Gadget.onUndock = resizeGadget;

  resizeGadget();
}

function addImageBugFix(oObj, filename, x, y, width, height) {

  // see:
  // http://web.archive.org/web/20081225094409/http://www.aeroxp.org/board/index.php?showtopic=7318
  //

  // get the original image dimensions
  var img = new Image();

  img.src = filename;
 
  // calculate half the difference
  var xOffset = parseInt((img.width - width) / 2);
  var yOffset = parseInt((img.height - height) / 2);

  img = null;

  // add the image
  var gimg = oObj.addImageObject(filename, x - xOffset, y - yOffset);
  gimg.width = width;
  gimg.height = height;

  return gimg;
}


function resizeGadget() {

  var mainBody = document.body;

  var oBackground = document.getElementById("imgBackground");
  var oSupercalc  = document.getElementById("supercalc");
  var oExpr       = document.getElementById("expression");
    
  System.Gadget.beginTransition();

  if(System.Gadget.docked == true) {
     
    mainBody.style.width  = 129;
    mainBody.style.height = 118;

    //var img = addImageBugFix(oBackground, "../img/docked2.png", 0, 0, 129 * zoom, 118 * zoom);
    //img.opacity = 100;

    oBackground.src = "../img/docked2.png";//docked.png";
    oSupercalc.className = "gadgetDocked";

    oExpr.className = "";
  }
  else {
       
    mainBody.style.width  = 300;//258 * zoom; 
    mainBody.style.height = 78 ;//134;

    //var img = addImageBugFix(oBackground, "../img/undocked4.png", 0, 0, 300 * zoom, 78 * zoom);
    //img.opacity = 100;

    oBackground.src = "../img/undocked4.png";
    oSupercalc.className = "gadgetUndocked";
  }

  System.Gadget.endTransition(System.Gadget.TransitionType.morph, 2.0);  
}

document.onreadystatechange = function() {    
  if(document.readyState=="complete") {
    init();
  }        
}


