var output = [];
var xhr = new XMLHttpRequest();
xhr.open( 'GET', 'quakemap.csv', true );
xhr.onreadystatechange = function() {
  if ( xhr.readyState === 4 && xhr.status === 200 ) {
    var parse = require('csv-parse');
    parse(xhr.responseText, function(err, output) {
      displayData(output);
    });
  }
}
xhr.send(null);

function getColorForStatus(data) {
  var wasVerified = data[23];
  var wasActionTaken = data[25];
  var isUrgent = data[26];
  var wasClosed = data[27];
  if (wasClosed == 'YES')
    return Cesium.Color.GREY;
  else if (wasActionTaken == 'YES')
    return Cesium.Color.GREEN;
  else if (isUrgent == 'YES')
    if (wasVerified == 'YES')
      return Cesium.Color.RED;
    else
      return Cesium.Color.BLUE;
}

function displayData(output) {
  var viewer = new Cesium.Viewer('cesiumContainer');
  for (i = 1; i < output.length; ++i) {
    viewer.entities.add({
      name : output[i][2],
      position : Cesium.Cartesian3.fromDegrees(output[i][8], output[i][7]),
      point : {
        color : getColorForStatus(output[i]).withAlpha(0.8),
        outline : true,
        outlineColor : Cesium.Color.BLACK,
        pixelSize: 25
      },
      description : '<h1><a href="' + String(output[i][i]) + '">' + String(output[i][2]) + '</a><h1>' +
                    '<p>' + String(output[i][5].replace(/\n/g,"<br />")) + '</p>'
    });
  }
}
