//= require graph.js

/*

  RED BLOOD CELL GRAPH

*/

DVE.Graph.RedBloodCellCount = function(graph){

  graph.threshold = {
    "RED BLOOD CELL COUNT": {over: 900, under: 200}
  };

  graph.number_of_symbols = 1

  graph.color = d3.scale.ordinal().range(['#383F47', '#F1CC28', '#B35252', '#63B28F']);

  graph.data.entries = graph.data.entries.slice(-5)

  var entries = graph.data.entries;

  var dataNest = d3.nest()
      .key(function(d) {return d.symbol;})
      .entries(entries);

  console.log(dataNest, dataNest[0].values);

  if(dataNest[0].values.length == 1){
    graph.single_point_data = [[0, 20], [0, 60],[graph.data.entries[0].value, (graph.data.entries[0].value - 60) > -1 ? (graph.data.entries[0].value - 60) : 60]]
    graph.draw_single_point();
    graph.draw_interventions();
  }
  else{
    graph.draw_interventions();

    graph.draw_single();

    graph.draw_dots();
  }
};
