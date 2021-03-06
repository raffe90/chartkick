$(document).on('ready page:change', function(e){
    d3.selectAll("[type=checkbox][name=visible_interventions]").on("change", function() {
      var selected = this.value;
      // console.log(this.value);
      var type = ".intervention--type--"+this.value;
      var opacity = this.checked ? 1 : 0;
      d3.selectAll(".intervention--type--"+this.value)
          .transition().duration(500)
          .style("opacity", opacity);
      // d3.selectAll(".interventions"+type)
      //     .transition().duration(500)
      //     .style("opacity", opacity);
      // d3.selectAll(".interventions-bg"+type)
      //     .transition().duration(500)
      //     .style("opacity", opacity);
      // d3.selectAll(".intervention-text"+type)
      //     .transition().duration(500)
      //     .style("opacity", opacity);
    });

    d3.selectAll("[type=radio][name=optradio]").on("click", function() {
      console.log(this.value)
      if(this.value === "gauge"){
        d3.selectAll("#gauge")
            .transition().duration(500)
            .style("opacity", 1);
        d3.selectAll(".tagLDL")
            .transition().duration(500)
            .style("opacity", 0);
        d3.selectAll(".tagTRIGLYCERIDES")
            .transition().duration(500)
            .style("opacity", 0);
        d3.selectAll(".tagHDL")
            .transition().duration(500)
            .style("opacity", 1);
        d3.selectAll(".tagCHOLESTEROL")
            .transition().duration(500)
            .style("opacity", 1);
      }
      else if(this.value === "all"){
        d3.selectAll("#gauge")
            .transition().duration(500)
            .style("opacity", 0);
        d3.selectAll(".tagLDL")
            .transition().duration(500)
            .style("opacity", 1);
        d3.selectAll(".tagTRIGLYCERIDES")
            .transition().duration(500)
            .style("opacity", 1);
        d3.selectAll(".tagHDL")
            .transition().duration(500)
            .style("opacity", 1);
        d3.selectAll(".tagCHOLESTEROL")
            .transition().duration(500)
            .style("opacity", 1);
      }
      else if(this.value === "other"){
        d3.selectAll("#gauge")
            .transition().duration(500)
            .style("opacity", 0);
        d3.selectAll(".tagHDL")
            .transition().duration(500)
            .style("opacity", 0);
        d3.selectAll(".tagCHOLESTEROL")
            .transition().duration(500)
            .style("opacity", 0);
        d3.selectAll(".tagLDL")
            .transition().duration(500)
            .style("opacity", 1);
        d3.selectAll(".tagTRIGLYCERIDES")
            .transition().duration(500)
            .style("opacity", 1);
      }
    });

    $("input").on("change", function(){
      var name = $(this).attr("name");
      $('input[type="text"][name="'+name+'"]').val($(this).val());
    });

});

