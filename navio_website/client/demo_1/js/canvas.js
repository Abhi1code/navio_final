var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var $canvas = $("#canvas");
var canvasOffset = $canvas.offset();
var offsetX = canvasOffset.left;
var offsetY = canvasOffset.top;
var scrollX = $canvas.scrollLeft();
var scrollY = $canvas.scrollTop();

var imageDpi = 500;
var isDown = false;
var meta_type = 1;
var startX;
var startY;
var elements = [];
var elements1 = [];
var floor_id = 124;

console.log("canvas started");
document.getElementById("qrdiv").style.display = "none";
document.getElementById("itemdiv").style.display = "none";

var canvas1 = new fabric.Canvas('canvas', { selection: false });
var tempx, tempy;
var line, isDown;
var currx, curry;

canvas1.on('mouse:down', function(o){

var pointer = canvas1.getPointer(o.e);

var temp_flag = false;

    /*elements.forEach(function(element){
            if(Math.pow(pointer.x-element.x,2) + Math.pow(pointer.y-element.y,2) < Math.pow(element.circleSize,2)) {
               element.clicked(); 
               temp_flag = true;
            }
        });*/

    elements1.forEach(function(element){
            if(Math.pow(pointer.x-element.x,2) + Math.pow(pointer.y-element.y,2) < Math.pow(element.circleSize,2)) {
               console.log(element.x + "," + element.y);
               currx = Math.round(element.x);
               curry = Math.round(element.y);
            }
        });

if(meta_type == 1 && !temp_flag){

var local_temp = false;
elements1.forEach(function(element){
            if(Math.pow(pointer.x-element.x,2) + Math.pow(pointer.y-element.y,2) < Math.pow(element.circleSize,2)) {
               isDown = true;
  
  //console.log(pointer.x + " " + pointer.y);
  local_temp = true;
  tempx = Math.round( element.x );
  tempy = Math.round( element.y );
  console.log("line start");

  var points = [ pointer.x, pointer.y, pointer.x, pointer.y ];
  line = new fabric.Line(points, {
    strokeWidth: 5,
    fill: 'red',
    stroke: 'red',
    originX: 'center',
    originY: 'center'
  });
  canvas1.add(line);
            }
        });
if(!local_temp){
    canvas1.remove(line);
}
}

if(meta_type == 2 && !temp_flag){
    /*elements.push({
        color: '#05EFFF',
        circleSize: 5,
        x: pointer.x,
        y: pointer.y,
        clicked: function() {
            alert('This circle has been clicked');
        }
      });
    canvas1.add(makecircle(pointer.x, pointer.y, 'blue'));
    window.saveFloorDetail(1, Math.round(pointer.x), Math.round(pointer.y), "room");
*/
}

if(meta_type == 3 && !temp_flag){
  elements1.push({
        color: '#05EFFF',
        circleSize: 5,
        x: pointer.x,
        y: pointer.y,
        clicked: function() {
            alert('This circle has been clicked');
        }
      });
    canvas1.add(makecircle(pointer.x, pointer.y, 'green'));
    window.savePathnodeDetail(Math.round(pointer.x), Math.round(pointer.y));
    /* TODO Later Add packet send*/
}

if(meta_type == 4 && !temp_flag){
    var isQr = false;
    $("#itemdiv").hide();
    $("#qrdiv").show();

    elements.forEach(function(element){
        if(Math.pow(pointer.x-element.x,2) + Math.pow(pointer.y-element.y,2) < Math.pow(element.circleSize,2)) {
               console.log(element.name);
               isQr = true;
               $("#qrid").hide();
               $("#saveqrid").hide();
               $("#qridtext").show();
               $("#qridtext").text('Id: ' + element.name);
        }
    });
    if(!isQr){
      $("#qrid").show();
      $("#saveqrid").show();
      $("#qridtext").hide();
    }
}

if(meta_type == 5 && !temp_flag){
    var tx, ty, isQr = false;
    $("#qrdiv").hide();
    $("#itemdiv").hide();
    $("#qrid").hide();
    $("#saveqrid").hide();

    elements.forEach(function(element){
        if(Math.pow(pointer.x-element.x,2) + Math.pow(pointer.y-element.y,2) < Math.pow(element.circleSize,2)) {
               console.log(element.name);
               isQr = true;
               $("#qridtext").show();
               $("#qridtext").text('Id: ' + element.name);
               $("#qrdiv").show();
               $("#itemdiv").show();
        }
    });

    if(isQr){
       //console.log("Added " + tx);
       window.getQrItem(currx, curry);
    }
}
});

canvas1.on('mouse:move', function(o){
    if(meta_type == 1){
  if (!isDown) return;
  var pointer = canvas1.getPointer(o.e);
  line.set({ x2: pointer.x, y2: pointer.y });
  //console.log(pointer.x + pointer.y);
  canvas1.renderAll();
}
});

canvas1.on('mouse:up', function(o){
    var pointer = canvas1.getPointer(o.e);
    console.log("up triggered");
    if(meta_type == 1){
    elements1.forEach(function(element){
            if(Math.pow(pointer.x-element.x,2) + Math.pow(pointer.y-element.y,2) < Math.pow(element.circleSize,2)) {
               //console.log(pointer.x + " " +  pointer.y);
  if(tempx != Math.round(pointer.x) && tempy != Math.round(pointer.y)){
  window.savePath(tempx, tempy, Math.round(element.x), Math.round(element.y));
  console.log("line ends");
  }
  isDown = false;
            }
        });
    }
});
    
    function makeLine(coords) {

    var Line = new fabric.Line(coords, {
      fill: 'red',
      stroke: 'red',
      strokeWidth: 5,
      selectable: false,
      originX: 'center',
      originY: 'center',
      flipX: false,
      flipY: false,
      invert: false,
      flip: false,
      skew: false,
      lockScalingFlip: true,
      lockRotation: true,
      lockMovementX: true
    });
    return Line;
  }

  function makecircle(left, top, color) {
    var circle = new fabric.Circle({
    left: left,
    top: top,
    radius: 5,
    strokeWidth: 5,
    stroke: color,
    fill: 'white',
    selectable: false,
    originX: 'center', originY: 'center'
  });
    return circle;
  }
    
    /*canvas.addEventListener('click', function(e) {
        var x = e.pageX - canvas.offsetLeft;
        var y = e.pageY - canvas.offsetTop;
        
        console.log("clicked");
        elements.forEach(function(element){
            if(Math.pow(x-element.x,2) + Math.pow(y-element.y,2) < Math.pow(element.circleSize,2)) {
               element.clicked(); 
            }
        });
    });*/

    $('#check').change(function() {
        if(this.checked) {
            meta_type = 2;
        } else {
            meta_type = 1;
        }
    });

    $('#check1').change(function() {
        if(this.checked) {
            meta_type = 3;
        } else {
            meta_type = 1;
        }
    });

    $('#check2').change(function() {
        if(this.checked) {
            meta_type = 4;
        } else {
            meta_type = 1;
        }
    });

    $('#check3').change(function() {
        if(this.checked) {
            meta_type = 5;
        } else {
            meta_type = 1;
        }
    });

    $("#locate").click(function(){
        var data = $("#data").val();
        //console.log(JSON.parse(data));
        drawTestPath(JSON.parse(data));
    });

    $("#addqritem").click(function(){
        var data = $("#qritem").val();
        if(data != ''){
           window.saveQrItemDetail(currx, curry, data);
           $("#qrdiv").hide();
           $("#itemdiv").hide();
        }
    });

    $("#saveqrid").click(function(){
        var data = $("#qrid").val();
        if(data != ''){
          window.saveFloorDetail(1, currx, curry, data);
          elements.push({
        color: '#05EFFF',
        circleSize: 5,
        x: currx,
        y: curry,
        name: data,
        type: 1,
        clicked: function() {
            alert('This circle has been clicked ' + element.name);
        }
    });
          $("#qrdiv").hide();
        }
    });

function drawTestPath(data){
    console.log(data);
    
    for(var i=0;i<(data.length);i++){
        console.log(data[i]);
       for(var j=0;j<data[i].length-1;j++){
        var node1 = data[i][j];
        var node2 = data[i][j+1];
        //console.log(node1 + "," + node2);
        var poi = [ Math.round(node1[1]),  Math.round(node1[2]),  
            Math.round(node2[1]),  Math.round(node2[2]) ];
        var Line = new fabric.Line(poi, {
      fill: 'blue',
      stroke: 'blue',
      strokeWidth: 5,
      selectable: false,
      originX: 'center',
      originY: 'center',
      lockScalingFlip: true,
      lockRotation: true,
      lockMovementX: true
    });
    canvas1.add(Line);
    canvas1.add(makecircle(Math.round(node1[1]), Math.round(node1[2]), 'green'));
    canvas1.add(makecircle(Math.round(node2[1]), Math.round(node2[2]), 'green'));
       }
    }
}          

function drawPath(data){

  $.each(data.data, function(index, e) {
        //console.log(e.xcord + "," + e.ycord + "," + e.xcordf
        //    + "," + e.ycordf);
        var poi = [ Math.round(e.xcord),  Math.round(e.ycord),  
            Math.round(e.xcordf),  Math.round(e.ycordf) ];
    var Line = new fabric.Line(poi, {
      fill: 'red',
      stroke: 'red',
      strokeWidth: 5,
      selectable: false,
      originX: 'center',
      originY: 'center',
      lockScalingFlip: true,
      lockRotation: true,
      lockMovementX: true
    });
    canvas1.add(Line);

    //canvas1.renderAll();
        /*ctx.beginPath();
        ctx.arc(element.xcord, element.ycord, 2, 0, Math.PI * 2, true);
        ctx.fillStyle = '#FF0000';
        ctx.fill();
        ctx.closePath();*/
        //console.log("canvas triggered");
        //canvas1.add(makeLine([ e.xcord, e.ycord, e.xcordf, e.ycordf ]));
  /*if(element.xcord < 100 && element.xcordf < 100){
canvas1.add(makeLine([ element.xcord, element.ycord, element.xcordf, element.ycordf ]));
  } else {
    if((element.xcord < 100 && element.xcordf > 100) || (element.xcord > 100 && element.xcordf < 100)){
        canvas1.add(makeLine([ element.xcordf, element.ycord, element.xcord, element.ycordf ]));
    } else {
canvas1.add(makeLine([ element.xcord, element.ycord, element.xcordf, element.ycordf ]));
    }
  }*/
        //canvas1.renderAll();
    });
}      

function drawFloorDetail(data){
  console.log(data);
  $.each(data.data, function(index, element) {
    //console.log(element);
        elements.push({
        color: '#05EFFF',
        circleSize: 5,
        x: element.xcord,
        y: element.ycord,
        name: element.name,
        type: element.type,
        clicked: function() {
            alert('This circle has been clicked ' + element.name);
        }
    });
    });
}

function drawPathnodeDetail(data){
    console.log(data);
    $.each(data.data, function(index, element) {
        console.log(element);
        elements1.push({
        color: '#05EFFF',
        circleSize: 5,
        x: element.xcord,
        y: element.ycord,
        clicked: function() {
            alert('This circle has been clicked ' + element.name);
        }
    });
    });

    elements1.forEach(function(element) {
        //var circle = new makeCircle(ctx, element.x, element.y, element.color, element.circleSize);
        canvas1.add(makecircle(element.x, element.y, 'green'));
        //console.log(circle);
    });
}

function drawQrItemDetail(data){
    console.log(data);
    var d = "Items: ";
    $.each(data.data, function(index, element) {
        //console.log(element);
        d += element.value + "  ";
    });
    $("#qritemtext").text(d);
}