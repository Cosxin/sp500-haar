var LineChartControl =  {
  

  createNew : function(){
    
     var lineChartControl = {};

     var transition1 = d3.select({}).transition()
          .duration(300)
          .ease("linear");
     var transition2 = d3.select({}).transition()
          .duration(300)
          .ease("linear");

     var lc_data1 = d3.range(maxS).map(function(d){return 0.0;}),
         lc_data2 = d3.range(maxS).map(function(d){return 0.0;});

     var wavelet1 = null,
         wavelet2 = null;

     lineChartControl.binddata = function(w1,w2){
         wavelet1 = w1;
         wavelet2 = w2;
         return lineChartControl;
     };

     lineChartControl.drawLineChart = function(index_pair){

      var margin = {top: 6, right: 0, bottom: 6, left: 20},
            width =  1026 - window.width - margin.right - margin.left,
            height = 690 - margin.top - margin.bottom;

      var x_width = width,
          y_height = 120,
          y_interval = 30;

      var svg = d3.select("body").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .attr("class","linechart")
            .style("margin-left", margin.left)
            .style("margin-top",margin.top)


      lineChart(0 , [0, maxS - 1], "basis", lc_data1, function tick(path, line, data, x) {

        console.log(transition1);
        transition1 = transition1.each(function() {

          // push a new data point onto the back
          data.push(wavelet1.getData(-1)[index_pair[0]].pop());  //TODO 
          // redraw the line, and then slide it to the left
          path
              .attr("d", line)
              .attr("transform", null)
            .transition()
              .attr("transform", "translate(" + x(-1) + ")");

          // pop the old data point off the front
          data.shift();

        }).transition().each("start", function() { tick(path, line, data, x); }); });

      lineChart(1 , [0, maxS - 1], "basis", lc_data2, function tick(path, line, data, x) {

        transition2 = transition2.each(function() {

          // push a new data point onto the back
          data.push(wavelet2.getData(-1)[index_pair[1]].pop());
          // redraw the line, and then slide it to the left
          path
              .attr("d", line)
              .attr("transform", null)
            .transition()
              .attr("transform", "translate(" + x(-1) + ")");

          // pop the old data point off the front
          data.shift();

        }).transition().each("start", function() { tick(path, line, data, x); }); });

      function lineChart(id, domain, interpolation, lcdata, tick){

        var x = d3.scale.linear()
            .domain(domain)
            .range([0,x_width]);

        var y = d3.scale.linear()
            .domain([-1, 1])
            .range([y_height, 0]);

        var line = d3.svg.line()
            .interpolate(interpolation)
            .x(function(d, i) { return x(i); })
            .y(function(d, i) { return y(d); });
        
        var chart = svg.append("g")
           .attr("transform", "translate(" + margin.left + "," + (id * (y_height + y_interval) + margin.top) + ")");

        chart.append("defs").append("clipPath")
            .attr("id", "clip")
          .append("rect")
            .attr("width", width)
            .attr("height", height);

        chart.append("g")
            .attr("class", "y axis")
            .call(d3.svg.axis().scale(y).ticks(5).orient("left"));

        var path = chart.append("g")
            .attr("clip-path", "url(#clip)")
          .append("path")
            .data([lcdata])
            .attr("class", "line")
            .attr("d", line);

        tick(path, line, lcdata, x);
      }

      return lineChartControl;
    
  };

    lineChartControl.updateLineChart = function(k){
      transition1.interrupt();
      transition2.interrupt();
    
      return lineChartControl;
    };

    return lineChartControl;
  }
}