/*

  MULTILINE CHART

*/

DVE.Graph.prototype.draw_multi = function () {

  var number_of_keys = Object.keys(this.threshold).length;

  this.data.entries = this.data.entries.slice((-1)*(number_of_keys+1)*this.number_of_symbols);

  this.legendSpace = this.width/number_of_keys; // spacing for the legend

  this.dataNest = d3.nest()
                    .key(function(d) {return d.symbol;})
                    .entries(this.data.entries);

  var minDate = new Date(this.data.entries[0].date.getFullYear()-1, this.data.entries[0].date.getMonth()+1,this.data.entries[0].date.getDate());
  var maxDate = new Date(this.data.entries[this.data.entries.length - 1].date.getFullYear()+1, this.data.entries[this.data.entries.length - 1].date.getMonth()+1,this.data.entries[this.data.entries.length - 1].date.getDate());

  this.x.domain([minDate, maxDate]);
  this.y.domain([0, d3.max(this.data.entries, function(d) { return d.value; })+25]);

  this.yAxis = d3.svg.axis(this.y)
    // .subdivide(true)
    // .tickPadding(10)
    // .innerTickSize(-this.width)
    // .outerTickSize(0)
    .tickSize(-this.width)
    .orient("left")
    .scale(this.y);


  //   //
  // this.date_axis = this.date_axis.slice(-5);
  this.date_axis = this.date_axis.slice(-20);

  // console.log("THIS DATE AXIS =>", this.date_axis)

  this.xAxis = d3.svg.axis(this.x)
    // .subdivide(true)
    // .tickPadding(10)
    // .innerTickSize(-this.width)
    // .outerTickSize(0)
    .tickSize(0)
    .ticks(5)
    .tickValues(this.date_axis)
    .tickFormat(d3.time.format("%d/%b/%Y"))
    .orient("bottom")
    .scale(this.x);

  this.dataNest.forEach(function(d,i) {

      this.svg.append("clipPath")
            .attr("id", "clip-"+d.key+"-above")
            .append("rect")
              .attr("width", this.width)
              .attr("height", function(){
                if(this.threshold[d.key].over != null){
                  return this.y(this.threshold[d.key].over)
                }else{
                  return this.y(this.threshold[d.key].under)
                }
              }.bind(this));

      this.svg.append("clipPath")
          .attr("id", "clip-"+d.key+"-below")
          .append("rect")
            .attr("y", function(){
              if(this.threshold[d.key].over != null){
                return this.y(this.threshold[d.key].over)
              }else{
                return this.y(this.threshold[d.key].under)
              }
            }.bind(this))
            .attr("width", this.width)
            .attr("height", function(){
              if(this.threshold[d.key].over != null){
                return this.height - this.y(this.threshold[d.key].over);
              }else{
                return this.height - this.y(this.threshold[d.key].under);
              }
              // return this.height - this.y(130);
            }.bind(this));

      var clip = ["below", "above"];

      clip.forEach(function(v,i){
        this.svg.append("path")
          .attr("class", function() { return 'tag'+d.key.replace(/\s+/g, '') + " line " + v; })
          .attr("clip-path", function() {
            return "url(#clip-"+d.key+"-" + v + ")";
          })
          .style("stroke-dasharray", function(){
            if((this.threshold[d.key].over != null && i == 1) || (this.threshold[d.key].under != null && i == 0)){
              return ("5, 5");
            }
            else{
              return ("0, 0");
            }
          }.bind(this))
          .style("stroke-width", function(){
            // console.log(this.threshold[d.key].over, i, this.threshold[d.key].over != null && i == 2)
            if((this.threshold[d.key].over != null && i == 1) || (this.threshold[d.key].under != null && i == 0)){
              return 1;
            }
            else{
              return 2;
            }
          }.bind(this))
          .attr("d", this.drawline(d.values))
          .style('fill', 'none')
          .style("stroke", function() { // Add the colours dynamically
              return this.color(d.key);
          }.bind(this));
      }.bind(this));

  }.bind(this));

// Add the X Axis
    this.svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + (this.height+20) + ")")
        .call(this.xAxis);

    // Add the Y Axis
    this.svg.append("g")
        .attr("class", "y axis")
        .call(this.yAxis);

    this.svg.selectAll('.axis text')
    .style('fill', "#EBEBEB")
    .style('stroke-width', 0)
    .style('font-family', '"Trebuchet MS", Helvetica, sans-serif');


 // now rotate text on x axis
        // solution based on idea here: https://groups.google.com/forum/?fromgroups#!topic/d3-js/heOBPQF3sAY
        // first move the text left so no longer centered on the tick
        // then rotate up to get 45 degrees.
        this.svg.selectAll(".x.axis text")  // select all the text elements for the xaxis
          .attr("transform", function(d) {
             return "translate(" + this.getBBox().height*-2 + "," + this.getBBox().height + ")rotate(-45)";
         })
          .style("fill", "black")
          .attr("y", 15);

    this.svg.selectAll('.axis path')
        .style('stroke', "#EBEBEB")
        .style('fill', 'none')
        .style('stroke-width', 0);

    this.svg.selectAll('.axis line')
        .style('stroke', 'black')
        .style('fill', 'none')
        .style('stroke-width', 0.1);

var label = this.svg.selectAll(".label")
      .data(this.data.entries)
    .enter().append("g")
      // .attr("class", "label")
      .attr("class", function(d, i){
        return 'label dots tag'+ d.symbol.replace(/\s+/g, '')
      })
      .attr("transform", function(d, i) { return "translate(" + this.x(d.date) + "," + this.y(d.value) + ")"; }.bind(this));

  label.append("text")
      .attr("class", "text-values")
      .attr("dy", ".35em")
      .style('font-family', '"Trebuchet MS", Helvetica, sans-serif')
      .style("font-weight", "bold")
      .style("font-size", 10)
      .attr("text-anchor", "middle")
      .attr("id", function(d,i){
        return 'val'+d.symbol.replace(/\s+/g, '')+i;
      })
      .text(function(d) { return d.value; })
    .filter(function(d, i) {
        // console.log(d,i)
        return i < 4
      })
    .append("tspan")
      .attr("class", "label-key")
      .attr("x", -15)
      .attr("text-anchor", "end")
      .style("font-size", 12)
      .text(function(d) { return " " + d.symbol; });

  label.append("rect")
      .datum(function() {
        return this.previousSibling.getBBox();
      })
      .attr("fill", "white")
      .attr("x", function(d) { return d.x - 3; })
      .attr("y", function(d) { return d.y - 3; })
      .attr("width", function(d) { return d.width + 2 * 3; })
      .attr("height", function(d) { return d.height + 2 * 3; });


  label.append("text")
      .attr("class", "text-values")
      .attr("dy", ".35em")
      .style('font-family', '"Trebuchet MS", Helvetica, sans-serif')
      .style("font-weight", "bold")
      .style("font-size", 10)
      .attr("text-anchor", "middle")
      .attr("id", function(d,i){
        return 'val'+d.symbol.replace(/\s+/g, '')+i;
      })
      .text(function(d) { return d.value; })
    .filter(function(d, i) {
        // console.log(d,i)
        return i < 4
      })
    .append("tspan")
      .attr("class", "label-key")
      .attr("x", -15)
      .attr("text-anchor", "end")
      .style("font-size", 12)
      .text(function(d) { return " " + d.symbol; });
};
