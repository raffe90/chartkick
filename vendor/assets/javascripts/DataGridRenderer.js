//
//  DataGridRenderer.js
//  Part of Mr-Data-Converter
//
//  Created by Shan Carter on 2010-10-18.
//

function multiDateParser(date){

  // var dateString = yyyy +'-'+(mm[1]?mm:"0"+mm[0]) +'-' + (dd[1]?dd:"0"+dd[0]);

  if(date.indexOf("th") > -1){
    var parsedDate = d3.time.format("%B %_dth, %Y").parse(date);
    return  parsedDate !== null ? parsedDate : d3.time.format("%B %_dth %Y").parse(date);
  }
  else{
    parsedDate = new Date(Date.parse(date));
  }
  // return new Date(Date.parse(date));
  //
  var yyyy = parsedDate.getFullYear().toString();
  var mm = (parsedDate.getMonth()+1).toString(); // getMonth() is zero-based
  var dd  = parsedDate.getDate().toString();
  return yyyy +'-'+(mm[1]?mm:"0"+mm[0]) +'-' + (dd[1]?dd:"0"+dd[0]);
}

var DataGridRenderer = {

  //---------------------------------------
  // Actionscript
  //---------------------------------------

  as: function (dataGrid, headerNames, headerTypes, indent, newLine) {
    //inits...
    var commentLine = "//";
    var commentLineEnd = "";
    var outputText = "[";
    var numRows = dataGrid.length;
    var numColumns = headerNames.length;

    //begin render loops
    for (var i=0; i < numRows; i++) {
      var row = dataGrid[i];
      outputText += "{";
      for (var j=0; j < numColumns; j++) {
        if ((headerTypes[j] == "int")||(headerTypes[j] == "float")) {
          var rowOutput = row[j] || "null";
        } else {
          var rowOutput = '"'+( row[j] || "" )+'"';
        };
        outputText += (headerNames[j] + ":" + rowOutput)
        if (j < (numColumns-1)) {outputText+=","};
      };
      outputText += "}";
      if (i < (numRows-1)) {outputText += ","+newLine};
    };
    outputText += "];";


    return outputText;
  },


  //---------------------------------------
  // ASP / VBScript
  //---------------------------------------

  asp: function (dataGrid, headerNames, headerTypes, indent, newLine) {
    //inits...
    var commentLine = "'";
    var commentLineEnd = "";
    var outputText = "";
    var numRows = dataGrid.length;
    var numColumns = headerNames.length;

    //begin render loop
    for (var i=0; i < numRows; i++) {
      var row = dataGrid[i];
      for (var j=0; j < numColumns; j++) {
        if ((headerTypes[j] == "int")||(headerTypes[j] == "float")) {
          var rowOutput = row[j] || "null";
        } else {
          var rowOutput = '"'+( row[j] || "" )+'"';
        };
      outputText += 'myArray('+j+','+i+') = '+rowOutput+newLine;
      };
    };
    outputText = 'Dim myArray('+(j-1)+','+(i-1)+')'+newLine+outputText;

    return outputText;
  },


  //---------------------------------------
  // HTML Table
  //---------------------------------------

  html: function (dataGrid, headerNames, headerTypes, indent, newLine, inputNames, size) {
    //inits...
    var commentLine = "<!--";
    var commentLineEnd = "-->";
    var outputText = "";
    var numRows = dataGrid.length;
    var numColumns = headerNames.length;

    //begin render loop
    // outputText += "<table class='table table-striped copy-paste-data'>"+newLine;
    // outputText += indent+"<thead class=''>"+newLine;
    // outputText += indent+indent+"<tr>"+newLine;

    // for (var j=0; j < numColumns; j++) {
    //   outputText += indent+indent+indent+'<th class="'+headerNames[j]+'-cell">';
    //   outputText += headerNames[j];
    //   outputText += '</th>'+newLine;
    // };
    // outputText += indent+indent+"</tr>"+newLine;
    // outputText += indent+"</thead>"+newLine;
    // outputText += indent+"<tbody>"+newLine;
    for (var i=0; i < numRows; i++) {
      var row = dataGrid[i];
      var rowClassName = " class='pasted--data--input pasted--"+i+size+"'";
      if (i === numRows-1) {
        rowClassName = ' class="lastRow pasted--data--input pasted--'+i+size+'"';
      } else if (i === 0){
        rowClassName = ' class="firstRow pasted--data--input pasted--'+i+size+'"';
      }
      outputText += indent+indent+"<tr"+rowClassName+">"+newLine;
      for (var j=0; j < numColumns; j++) {

        if(j==0){
          outputText += indent+indent+indent+'<td><span id="fa-'+(i+size)+'" class="fa fa-times text-danger"></span>';
          outputText += (i+size+1)
        }
        else if(j==1){
          var date = multiDateParser(row[j-1]);

          // console.log(new Date(Date.parse(row[j-1])));
          // var customTimeFormat = d3.time.format.multi([
          //   [".%L", function(d) { return console.log(d); }],
          //   [":%S", function(d) { return d.getSeconds(); }],
          //   ["%I:%M", function(d) { return d.getMinutes(); }],
          //   ["%I %p", function(d) { return d.getHours(); }],
          //   ["%a %d", function(d) { return d.getDay() && d.getDate() != 1; }],
          //   ["%b %d", function(d) { return d.getDate() != 1; }],
          //   ["%B", function(d) { return d.getMonth(); }],
          //   ["%Y", function() { return true; }]
          // ]);

          // console.log(customTimeFormat);

          // console.log(customTimeFormat(row[j-1]).parse)

          // if(date[0].length === 1){
          //   date[0] = '0'+ date[0];
          // }

          // console.log(new Date(date[1], date[0], 01));
          // outputText += indent+indent+indent+'<td><input type="date" class="'+(i+1)+'-date pasted" name="entry['+inputNames[j-1]+'['+(i+1)+']]" date="20'+ date[1].toString()+'-'+date[0].toString()+'-01">';
          // $('.'+(i+1)+'-date').val("20'+ date[1].toString()+'-'+date[0].toString()+'-01");
          outputText += indent+indent+indent+'<td><input type="date" class="'+(i+size+1)+'-date pasted" name="entry['+inputNames[j-1]+'['+(i+size+1)+']]" date="'+date+'">';
          // console.log(date.getFullYear().toString()+'-'+date.getMonth().toString()+'-'+date.getDate().toString());
          // console.log(date, date, date.toISOString().slice(0,10).replace(/-/g,""));
        }
        else{
          outputText += indent+indent+indent+'<td><input type="text" class="pasted" name="entry['+inputNames[j-1]+'['+(i+size+1)+']]" placeholder="'+row[j-1]+'" val="'+row[j-1]+'">';
          // outputText += row[j-1]
        }
        outputText += '</td>'+newLine
      };
      outputText += indent+indent+"</tr>"+newLine;
    };
    // outputText += indent+"</tbody>"+newLine;
    // outputText += "</table>";

    return outputText;
  },


  //---------------------------------------
  // JSON properties
  //---------------------------------------

  json: function (dataGrid, headerNames, headerTypes, indent, newLine) {
    //inits...
    var commentLine = "//";
    var commentLineEnd = "";
    var outputText = "[";
    var numRows = dataGrid.length;
    var numColumns = headerNames.length;

    //begin render loop
    for (var i=0; i < numRows; i++) {
      var row = dataGrid[i];
      outputText += "{";
      for (var j=0; j < numColumns; j++) {
        if ((headerTypes[j] == "int")||(headerTypes[j] == "float")) {
          var rowOutput = row[j] || "null";
        } else {
          var rowOutput = '"' + ( row[j] || "" ) + '"';
        };

      outputText += ('"'+headerNames[j] +'"' + ":" + rowOutput );

        if (j < (numColumns-1)) {outputText+=","};
      };
      outputText += "}";
      if (i < (numRows-1)) {outputText += ","+newLine};
    };
    outputText += "]";

    return outputText;
  },

  //---------------------------------------
  // JSON Array of Columns
  //---------------------------------------
  jsonArrayCols: function (dataGrid, headerNames, headerTypes, indent, newLine) {
    //inits...
    var commentLine = "//";
    var commentLineEnd = "";
    var outputText = "";
    var numRows = dataGrid.length;
    var numColumns = headerNames.length;

    //begin render loop
    outputText += "{"+newLine;
    for (var i=0; i < numColumns; i++) {
      outputText += indent+'"'+headerNames[i]+'":[';
      for (var j=0; j < numRows; j++) {
        if ((headerTypes[i] == "int")||(headerTypes[i] == "float")) {
          outputText += dataGrid[j][i] || 0;
        } else {
          outputText += '"'+(dataGrid[j][i] || "")+'"' ;
        }
        if (j < (numRows-1)) {outputText+=","};
      };
      outputText += "]";
      if (i < (numColumns-1)) {outputText += ","+newLine};
    };
    outputText += newLine+"}";


    return outputText;
  },


  //---------------------------------------
  // JSON Array of Rows
  //---------------------------------------
  jsonArrayRows: function (dataGrid, headerNames, headerTypes, indent, newLine) {
    //inits...
    var commentLine = "//";
    var commentLineEnd = "";
    var outputText = "";
    var numRows = dataGrid.length;
    var numColumns = headerNames.length;

    //begin render loop
    outputText += "["+newLine;
    for (var i=0; i < numRows; i++) {
      outputText += indent+"[";
      for (var j=0; j < numColumns; j++) {
        if ((headerTypes[j] == "int")||(headerTypes[j] == "float")) {
          outputText += dataGrid[i][j] || 0;
        } else {
          outputText += '"'+(dataGrid[i][j] || "")+'"' ;
        }
        if (j < (numColumns-1)) {outputText+=","};
      };
      outputText += "]";
      if (i < (numRows-1)) {outputText += ","+newLine};
    };
    outputText += newLine+"]";


    return outputText;
  },



  //---------------------------------------
  // JSON Dictionary
  //---------------------------------------
  jsonDict: function(dataGrid, headerNames, headerTypes, indent, newLine) {
    //inits...
    var commentLine = "//";
    var commentLineEnd = "";
    var outputText = "";
    var numRows = dataGrid.length;
    var numColumns = headerNames.length;

    //begin render loop
    outputText += "{" + newLine;
    for (var i = 0; i < numRows; i++) {
      outputText += indent + '"' + dataGrid[i][0] + '": ';
      if (numColumns == 2) {
        outputText += _fmtVal(i, 1, dataGrid);
      } else {
        outputText += '{ ';
        for (var j = 1; j < numColumns; j++) {
          if (j > 1) outputText += ', ';
          outputText += '"' + headerNames[j] + '"' + ":" + _fmtVal(i, j, dataGrid);
        }
        outputText += '}';
      }
      if (i < (numRows - 1)) {
        outputText += "," + newLine;
      }
    }
    outputText += newLine + "}";

    function _fmtVal(i, j) {
      if ((headerTypes[j] == "int")||(headerTypes[j] == "float")) {
        return dataGrid[i][j] || 0;
      } else {
        return '"'+(dataGrid[i][j] || "")+'"' ;
      }
    }

    return outputText;
  },


  //---------------------------------------
  // MYSQL
  //---------------------------------------
  mysql: function (dataGrid, headerNames, headerTypes, indent, newLine) {
    //inits...
    var commentLine = "/*";
    var commentLineEnd = "*/";
    var outputText = "";
    var numRows = dataGrid.length;
    var numColumns = headerNames.length;
    var tableName = "MrDataConverter"

    //begin render loop
    outputText += 'CREATE TABLE '+tableName+' (' + newLine;
    outputText += indent+"id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,"+newLine;
    for (var j=0; j < numColumns; j++) {
      var dataType = "VARCHAR(255)";
      if ((headerTypes[j] == "int")||(headerTypes[j] == "float")) {
        dataType = headerTypes[j].toUpperCase();
      };
      outputText += indent+""+headerNames[j]+" "+dataType;
      if (j < numColumns - 1) {outputText += ","};
      outputText += newLine;
    };
    outputText += ');' + newLine;
    outputText += "INSERT INTO "+tableName+" "+newLine+indent+"(";
    for (var j=0; j < numColumns; j++) {
      outputText += headerNames[j];
      if (j < numColumns - 1) {outputText += ","};
    };
    outputText += ") "+newLine+"VALUES "+newLine;
    for (var i=0; i < numRows; i++) {
      outputText += indent+"(";
      for (var j=0; j < numColumns; j++) {
        if ((headerTypes[j] == "int")||(headerTypes[j] == "float"))  {
          outputText += dataGrid[i][j] || "null";
        } else {
          outputText += "'"+( dataGrid[i][j] || "" )+"'";
        };

        if (j < numColumns - 1) {outputText += ","};
      };
      outputText += ")";
      if (i < numRows - 1) {outputText += ","+newLine;};
    };
    outputText += ";";

    return outputText;
  },


  //---------------------------------------
  // PHP
  //---------------------------------------
  php: function (dataGrid, headerNames, headerTypes, indent, newLine) {
    //inits...
    var commentLine = "//";
    var commentLineEnd = "";
    var outputText = "";
    var numRows = dataGrid.length;
    var numColumns = headerNames.length;
    var tableName = "MrDataConverter"

    //begin render loop
    outputText += "array(" + newLine;
    for (var i=0; i < numRows; i++) {
      var row = dataGrid[i];
      outputText += indent + "array(";
      for (var j=0; j < numColumns; j++) {
        if ((headerTypes[j] == "int")||(headerTypes[j] == "float"))  {
          var rowOutput = row[j] || "null";
        } else {
          var rowOutput = '"'+(row[j] || "")+'"';
        };
        outputText += ('"'+headerNames[j]+'"' + "=>" + rowOutput)
        if (j < (numColumns-1)) {outputText+=","};
      };
      outputText += ")";
      if (i < (numRows-1)) {outputText += ","+newLine};
    };
    outputText += newLine + ");";

    return outputText;
  },

  //---------------------------------------
  // Python dict
  //---------------------------------------

  python: function (dataGrid, headerNames, headerTypes, indent, newLine) {
    //inits...
    var commentLine = "//";
    var commentLineEnd = "";
    var outputText = "[";
    var numRows = dataGrid.length;
    var numColumns = headerNames.length;

    //begin render loop
    for (var i=0; i < numRows; i++) {
      var row = dataGrid[i];
      outputText += "{";
      for (var j=0; j < numColumns; j++) {
        if ((headerTypes[j] == "int")||(headerTypes[j] == "float")) {
          var rowOutput = row[j] || "None";
        } else {
          var rowOutput = '"'+(row[j] || "")+'"';
        };

      outputText += ('"'+headerNames[j] +'"' + ":" + rowOutput );

        if (j < (numColumns-1)) {outputText+=","};
      };
      outputText += "}";
      if (i < (numRows-1)) {outputText += ","+newLine};
    };
    outputText += "];";

    return outputText;
  },


  //---------------------------------------
  // Ruby
  //---------------------------------------
  ruby: function (dataGrid, headerNames, headerTypes, indent, newLine) {
    //inits...
    var commentLine = "#";
    var commentLineEnd = "";
    var outputText = "";
    var numRows = dataGrid.length;
    var numColumns = headerNames.length;
    var tableName = "MrDataConverter"

    //begin render loop
    outputText += "[";
    for (var i=0; i < numRows; i++) {
      var row = dataGrid[i];
      outputText += "{";
      for (var j=0; j < numColumns; j++) {
        if ((headerTypes[j] == "int")||(headerTypes[j] == "float")) {
          var rowOutput = row[j] || "nil"
        } else {
          var rowOutput = '"'+(row[j] || "")+'"';
        };
        outputText += ('"'+headerNames[j]+'"' + "=>" + rowOutput)
        if (j < (numColumns-1)) {outputText+=","};
      };
      outputText += "}";
      if (i < (numRows-1)) {outputText += ","+newLine};
    };
    outputText += "];";

    return outputText;
  },


  //---------------------------------------
  // XML Nodes
  //---------------------------------------
  xml: function (dataGrid, headerNames, headerTypes, indent, newLine) {
    //inits...
    var commentLine = "<!--";
    var commentLineEnd = "-->";
    var outputText = "";
    var numRows = dataGrid.length;
    var numColumns = headerNames.length;

    //begin render loop
    outputText = '<?xml version="1.0" encoding="UTF-8"?>' + newLine;
    outputText += "<rows>"+newLine;
    for (var i=0; i < numRows; i++) {
      var row = dataGrid[i];
      outputText += indent+"<row>"+newLine;
      for (var j=0; j < numColumns; j++) {
        outputText += indent+indent+'<'+headerNames[j]+'>';
        outputText += row[j] || ""
        outputText += '</'+headerNames[j]+'>'+newLine
      };
      outputText += indent+"</row>"+newLine;
    };
    outputText += "</rows>";

    return outputText;

  },



  //---------------------------------------
  // XML properties
  //---------------------------------------
  xmlProperties: function (dataGrid, headerNames, headerTypes, indent, newLine) {
    //inits...
    var commentLine = "<!--";
    var commentLineEnd = "-->";
    var outputText = "";
    var numRows = dataGrid.length;
    var numColumns = headerNames.length;

    //begin render loop
    outputText = '<?xml version="1.0" encoding="UTF-8"?>' + newLine;
    outputText += "<rows>"+newLine;
    for (var i=0; i < numRows; i++) {
      var row = dataGrid[i];
      outputText += indent+"<row ";
      for (var j=0; j < numColumns; j++) {
        outputText += headerNames[j]+'=';
        outputText += '"' + row[j] + '" ';
      };
      outputText += "></row>"+newLine;
    };
    outputText += "</rows>";

    return outputText;

  },

  //---------------------------------------
  // XML Illustrator
  //---------------------------------------
  xmlIllustrator: function (dataGrid, headerNames, headerTypes, indent, newLine) {
    //inits...
    var commentLine = "<!--";
    var commentLineEnd = "-->";
    var outputText = "";
    var numRows = dataGrid.length;
    var numColumns = headerNames.length;

    //begin render loop
    outputText = '<?xml version="1.0" encoding="utf-8"?>' + newLine;
    outputText += '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 20001102//EN"    "http://www.w3.org/TR/2000/CR-SVG-20001102/DTD/svg-20001102.dtd" [' + newLine;
    outputText += indent+'<!ENTITY ns_graphs "http://ns.adobe.com/Graphs/1.0/">' + newLine;
    outputText += indent+'<!ENTITY ns_vars "http://ns.adobe.com/Variables/1.0/">' + newLine;
    outputText += indent+'<!ENTITY ns_imrep "http://ns.adobe.com/ImageReplacement/1.0/">' + newLine;
    outputText += indent+'<!ENTITY ns_custom "http://ns.adobe.com/GenericCustomNamespace/1.0/">' + newLine;
    outputText += indent+'<!ENTITY ns_flows "http://ns.adobe.com/Flows/1.0/">' + newLine;
    outputText += indent+'<!ENTITY ns_extend "http://ns.adobe.com/Extensibility/1.0/">' + newLine;
    outputText += ']>' + newLine;
    outputText += '<svg>' + newLine;
    outputText += '<variableSets  xmlns="&ns_vars;">' + newLine;
    outputText += indent+'<variableSet  varSetName="binding1" locked="none">' + newLine;
    outputText += indent+indent+'<variables>' + newLine;
    for (var i=0; i < numColumns; i++) {
      outputText += indent+indent+indent+'<variable varName="'+headerNames[i]+'" trait="textcontent" category="&ns_flows;"></variable>' + newLine;
    };
    outputText += indent+indent+'</variables>' + newLine;
    outputText += indent+indent+'<v:sampleDataSets  xmlns:v="http://ns.adobe.com/Variables/1.0/" xmlns="http://ns.adobe.com/GenericCustomNamespace/1.0/">' + newLine;

    for (var i=0; i < numRows; i++) {
      var row = dataGrid[i];
      outputText += indent+indent+indent+'<v:sampleDataSet dataSetName="' + row[0] + '">'+newLine;
      for (var j=0; j < numColumns; j++) {
        outputText += indent+indent+indent+indent+'<'+headerNames[j]+'>'+newLine;
        outputText += indent+indent+indent+indent+indent+'<p>' + row[j] + '</p>' +newLine;
        outputText += indent+indent+indent+indent+'</'+headerNames[j]+'>'+newLine
      };
      outputText += indent+indent+indent+'</v:sampleDataSet>'+newLine;
    };

    outputText += indent+indent+'</v:sampleDataSets>' + newLine;
    outputText += indent+'</variableSet>' + newLine;
    outputText += '</variableSets>' + newLine;
    outputText += '</svg>' + newLine;


    return outputText;

  },

}
