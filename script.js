// variables we'll be filtering by
var quantile;
// what about income level?
var variable;
var amount;
var type;
var risk;

// set up chart
var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.scaleLinear()
  .rangeRound([0, width]);

var y = d3.scaleLinear()
  .rangeRound([height,0]);

var valueline = d3.line()
    .x(function(d) { return x(d.key); })
    .y(function(d) { return y(d.value); });

var svg = d3.select("#income")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");


// make selection

// Possible values --
// quantile: [1 2 3 4]
// variable: ['Income' 'Payments' 'Consumption' 'Utility']
// amount: [ 5000 30000 70000]
// type: ['Loan' 'ISA']
// risk: [1 2 3 4]

// pretend we're making a selection 
quantile = 1;
variable= 'Income';
amount=5000;
type = 'Loan';
risk = 2;

// data
d3.csv("https://raw.githubusercontent.com/JainFamilyInstitute/isa-app/master/data/data_vis.csv?token=AXiiVXcAwXZjLK4-3tiyxKwj8yaVMVDmks5b6b8NwA%3D%3D", function(error, data) {
  if (error) throw error;

  // filter by selection
  data = data.filter(function(d) { 
          return (d.quantile == quantile) &
          (d.variable == variable) &
          (d.amount == amount) &
          (d.type == type) &
          (d.risk == risk) }); 

  // create visualizable array with only ages and amounts for selected series
  data_filtered = data.map(({ quantile,amount,risk,type,variable, ...item }) => item);
  data_vis = data_filtered[0];

  result = [];
  for(i=22;i<101;i++){
    key = i;
    value =parseFloat(data_vis[i]);
    result.push({
            key: key,
            value: value
        });
  }

  // console.log(data_vis);
  console.log(result);

  // Scale the range of the data
  x.domain([d3.min(result, function(d) { return d.key; }), d3.max(result, function(d) { return d.key; })]);
  y.domain([0, d3.max(result, function(d) { return d.value; })]);

  // Add the valueline path.
  svg.append("path")
      .data([result])
      .attr("class", "line")
      .attr("d", valueline);

  // Add the X Axis
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  // Add the Y Axis
  svg.append("g")
      .call(d3.axisLeft(y));

});