var conn = new WebSocket('ws://localhost:8282');
var floor_id = 124;

$(document).ready(function(){
      
      conn.onopen = function(e) {
      console.log("Connection established!");
      getFloorDetail();
      getPathNode();
      /*var data = {
               meta : 'online',
               id : 'id'
            };
      conn.send(JSON.stringify(data)); */
      };

      conn.onmessage = function(e) {
      //console.log(e.data);
      var data = JSON.parse(e.data);

      if (data.meta == 'pathdata') {
            window.drawPath(data);
      }

      if(data.meta == 'floordetaildata'){
        window.drawFloorDetail(data);
      }
      
      if(data.meta == 'pathnodedata'){
        window.drawPathnodeDetail(data);
        getPath();
      }

      if(data.meta == 'qritemnodedata'){
        window.drawQrItemDetail(data);
      }

      };

      conn.onclose = function(e) {
         console.log("Connection closed..");
      };
      
      

      $("#close").click(function(){
          $.ajax({
            url: "logout.php",
            method: "post",
            data: "userid="+id+"&status=leave",
            success: function(result){
              var stat = JSON.parse(result);
                if (stat.status == 1) {
                   var data = {
                   meta : 'offline',
                   id : id
                    };
                    conn.send(JSON.stringify(data));
                  conn.close();
                  location = "index.php";
                    
            }
                }
            
          });
          });

      $('#msg').keydown(function(event) {
         // enter has keyCode = 13, change it if you want to use another button
         if (event.keyCode == 13) {
           send();
         return true;
          }
       });

      $('#send').click(function(){
        send();
      });
     
    });

function savePath(startX, startY, endX, endY){
          var data = {
            id : floor_id,
            meta : 'insertpath',
            xcord : startX,
            ycord : startY, 
            xcordf : endX, 
            ycordf : endY
            };
          conn.send(JSON.stringify(data));
}

function saveFloorDetail(type, startX, startY, name){
          var data = {
            id : floor_id,
            meta : 'insertfloordetail',
            type : type,
            xcord : startX,
            ycord : startY,
            name : name
            };
          conn.send(JSON.stringify(data));
}

function savePathnodeDetail(startX, startY){
          var data = {
            id : floor_id,
            meta : 'insertPathnodedetail',
            xcord : startX,
            ycord : startY
            };
          conn.send(JSON.stringify(data));
}

function saveQrItemDetail(startX, startY, value){
          var data = {
            id : floor_id,
            meta : 'insertQrItemDetail',
            xcord : startX,
            ycord : startY,
            value : value
            };
          conn.send(JSON.stringify(data));
}

function getPath(){
  var data = {
    id : floor_id,
    meta : 'extractpath'
  };
  conn.send(JSON.stringify(data));
}      

function getFloorDetail(){
  var data = {
    id : floor_id,
    meta : 'extractFloorDetails'
  };
  conn.send(JSON.stringify(data));
}   

function getPathNode(){
  var data = {
    id : floor_id,
    meta : 'extractPathnodeDetails'
  };
  conn.send(JSON.stringify(data));
}   

function getQrItem(xcord, ycord){
  var data = {
    id : floor_id,
    meta : 'extractQrItemDetail',
    xcord : xcord,
    ycord : ycord
  };
  conn.send(JSON.stringify(data));
}   