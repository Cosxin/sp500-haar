var LineChartControl =  {
  

  createNew : function(n,maxS){
    
     var lineChartControl = {};

     var n = n;
     var maxS = maxS;

     var wavelet1 = null,
         wavelet2 = null;

     var lc_data1 = d3.range(n).map(function(){return d3.range(maxS).map(function(){return 0.0;});});
     var lc_data2 = d3.range(n).map(function(){return d3.range(maxS).map(function(){return 0.0;});});

     var transitions1 = d3.range(n).map(function(d,i){ return d3.select({}).transition().duration(750).ease("linear"); }),
         transitions2 = d3.range(n).map(function(d,i){ return d3.select({}).transition().duration(750).ease("linear"); });

     var actives = [0,0];

     lineChartControl.binddata = function(w1,w2){
        //Todo
        wavelet1 = w1;
        wavelet2 = w2;
        return lineChartControl;
     };

     lineChartControl.drawLineChart = function(index_pair){

      actives = index_pair;

      var margin = {top: 40, right: 0, bottom: 6, left: 30},
            width =  1024 - window.width - margin.right - margin.left,
            height = 690 - margin.top - margin.bottom;

      var x_width = width,
          x_height = 15,
          y_height = 120,
          y_width = 30,
          y_interval = 50;

      var svg = d3.select("body").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .style("margin-left", margin.left)
            .style("margin-top",margin.top)
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

      for (var i = -1; ++i < n;) {

          lineChart(i , 0, [0, maxS - 1], "basis", lc_data1[i], function tick(id ,path, line, data, x , y, x_axis, y_axis) {

            transitions1[id] = transitions1[id].each(function(){

              // push a new data point onto the back  
              data.push(wavelet1.getColumns(id)[maxS - 1]);   
              // redraw the line, and then slide it to the left

              y.domain(d3.extent(data));
            
              y_axis.call(y.axis);

              path
                .attr("d", line)
                .attr("transform", null)
              .transition()
                .attr("transform", "translate(" + x(-1) + ")")

                // pop the old data point off the front
                data.shift();

            }).transition().each("start",function(){tick(id,path,line,data,x,y, x_axis, y_axis);});
          });

        lineChart(i, 1, [0, maxS - 1], "basis", lc_data2[i], function tick(id ,path, line, data, x , y, x_axis, y_axis) {

          transitions2[id] = transitions2[id].each(function(){

            // push a new data point onto the back            
            data.push(wavelet2.getColumns(id)[maxS - 1]);

            y.domain(d3.extent(data));

            y_axis.call(y.axis);
            // redraw the line, and then slide it to the left
            path
              .attr("d", line)
              .attr("transform", null)
            .transition()
              .attr("transform", "translate(" + x(-1) + ")");

              // pop the old data point off the front
              data.shift();

          }).transition().each("start",function(){tick(id,path,line,data,x,y,x_axis, y_axis);});
        });
    }

      function lineChart(id, loc, domain, interpolation, lcdata, tick){

        var x = d3.scale.linear()
            .domain(domain)
            .range([0,x_width]);

        var y = d3.scale.linear()
            .domain([0, 1])
            .range([y_height, 0]);

        var line = d3.svg.line()
            .interpolate(interpolation)
            .x(function(d, i) { return x(i); })
            .y(function(d, i) { return y(d); });

        
        var chart = svg.append("g")
            .attr("class","linechart")
            .attr("id","l"+id+"loc"+loc)
            .style('display', function(){return (id == actives[0] && loc == 0) || (id == actives[1] && loc == 1) ? "inline":"none";})
            .attr("transform",
                function(){return "translate(" + y_width + "," + (loc * (y_height + y_interval) + x_height) + ")";});

        chart.append("text")
          .text(function(){ return (loc == 0 ) ? wavelet1.tickers(id) : (loc == 1) ? wavelet1.tickers(id) : "unknown";});

        chart.append("defs").append("clipPath")
            .attr("id", "clip")
          .append("rect")
            .attr("width", width)
            .attr("height", height);

        var y_axis = chart.append("g")
            .attr("class", "y axis")
            .call(y.axis = d3.svg.axis().scale(y).ticks(5).orient("left"));

        var x_axis = chart.append("g")
            .attr("class", "x axis")
            .attr('transform', 'translate(0,' + (y_height) + ')')
            .call(x.axis = d3.svg.axis().scale(x).orient("bottom"));

        var path = chart.append("g")
            .attr("clip-path", "url(#clip)")
          .append("path")
            .data([lcdata])
            .attr("class", "lc line")
            .attr("d", line)
            .style("fill","none")
            .style("stroke","#000");

        tick(id, path, line, lcdata, x, y, x_axis, y_axis);
      }

      return lineChartControl;
    
  };

    lineChartControl.updateLineChart = function(index_pair){
      actives = index_pair;
      d3.selectAll(".linechart").style("display","none");
      d3.select("#l"+index_pair[0]+"loc"+0).style("display","inline");
      d3.select("#l"+index_pair[1]+"loc"+1).style("display","inline");

    };

    return lineChartControl;
  }
}