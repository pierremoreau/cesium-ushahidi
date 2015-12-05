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

function displayData(output) {
  var viewer = new Cesium.Viewer('cesiumContainer');
  for (i = 1; i < output.length; ++i) {
    viewer.entities.add({
      name : output[i][2],
      position : Cesium.Cartesian3.fromDegrees(output[i][8], output[i][7]),
      point : {
        color : Cesium.Color.RED.withAlpha(0.5),
        outline : true,
        outlineColor : Cesium.Color.BLACK,
        pixelSize: 25
      },
      description : '<h1><a href="' + String(output[i][i]) + '">' + String(output[i][2]) + '</a><h1>' +
                    '<p>' + String(output[i][5].replace(/\n/g,"<br />")) + '</p>'
    });
  }
}
