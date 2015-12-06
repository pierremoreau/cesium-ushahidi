var g_enabledCategories = new Map();
var g_viewer;
var g_points = new Map();


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

function extractPoints(output) {
  g_viewer = new Cesium.Viewer('cesiumContainer');
  var entities = new Set();

  for (i = 1; i < output.length; ++i) {
    var point = new Cesium.Entity({
      name : output[i][2],
      position : Cesium.Cartesian3.fromDegrees(output[i][8], output[i][7]),
      point : {
        color : getColorForStatus(output[i]).withAlpha(0.8),
        outlineColor : Cesium.Color.BLACK,
        outlineWidth : 2,
        pixelSize: 10
      },
      description : '<h1><a href="' + String(output[i][i]) + '">' + String(output[i][2]) + '</a><h1>' +
                    '<p>' + output[i][5].replace(/\\n/g,"<br />") + '</p>'
    });
    var subcategories = output[i][6].split(',');
    for (j = 0; j < subcategories.length; ++j) {
      if (subcategories[j] != "") {
        var key = subcategories[j].trim();
        if (!g_points.has(key)) {
          g_points.set(key, Array.of(point));
        } else {
          var array = g_points.get(key);
          array.push(point);
          g_points.set(key, array);
        }
      }
    }
  }
}

function displayData() {
  var entities = new Set();

  g_viewer.entities.removeAll();
  for (var [key, value] of g_points) {
    if (g_enabledCategories.get(key)) {
      for (i = 0; i < value.length; ++i) {
        entities.add(value[i]);
      }
    }
  }
  var tmpArray = Array.from(entities);
  for (i = 0; i < tmpArray.length; ++i)
    g_viewer.entities.add(tmpArray[i]);
}

function extractCategories(output) {
  var categories = new Set();
  for (i = 1; i < output.length; ++i) {
    var subcategories = output[i][6].split(',');
    for (j = 0; j < subcategories.length; ++j) {
      if (subcategories[j] != "")
        categories.add(subcategories[j].trim());
    }
  }
  return categories;
}

function togglingCategories(state) {
  g_enabledCategories.set(this.id, this.checked);
  displayData();
}

function checkAll(state) {
  for (var [key, value] of g_enabledCategories) {
    document.getElementById(key).checked = true;
    g_enabledCategories.set(key, true);
  }
  displayData();
}

function uncheckAll(state) {
  for (var [key, value] of g_enabledCategories) {
    document.getElementById(key).checked = false;
    g_enabledCategories.set(key, false);
  }
  displayData();
}

function addCheckboxesForCategories(categories) {
  var table = document.getElementById('checkboxesTable');

  var row = table.insertRow(table.rows.length);
  var checkall = row.insertCell(0);
  var buttonCheck = document.createElement("input");
  buttonCheck.type = "button";
  buttonCheck.value = "Check All";
  buttonCheck.onclick = checkAll;
  checkall.appendChild(buttonCheck);

  var uncheckall = row.insertCell(1);
  var buttonUncheck = document.createElement("input");
  buttonUncheck.type = "button";
  buttonUncheck.value = "Uncheck All";
  buttonUncheck.onclick = uncheckAll;
  uncheckall.appendChild(buttonUncheck);

  for (i = 0; i < categories.length; ++i) {
    row = table.insertRow(table.rows.length);

    var label = row.insertCell(0);
    label.innerHTML = categories[i];

    var checkbox = row.insertCell(1);
    var element = document.createElement("input");
    element.id = categories[i];
    element.type = "checkbox";
    element.checked = false;
    element.onclick = togglingCategories;
    checkbox.appendChild(element);

    g_enabledCategories.set(element.id, element.checked);
  }
}



var g_xhr = new XMLHttpRequest();
g_xhr.open( 'GET', 'quakemap.csv', true );
g_xhr.onreadystatechange = function() {
  if ( g_xhr.readyState === 4 && g_xhr.status === 200 ) {
    var parse = require('csv-parse');
    parse(g_xhr.responseText, function(err, output) {
      var categories = extractCategories(output);
      addCheckboxesForCategories(Array.from(categories));
      extractPoints(output);
      displayData();
    });
  }
}
g_xhr.send(null);
