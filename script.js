// variables we'll be filtering by
var grad;
var quartile;
var amount;
var type;
var risk;

function getInnerWidth(elem) {
    return parseFloat(window.getComputedStyle(elem).width);
}

function getInnerHeight(elem) {
    return parseFloat(window.getComputedStyle(elem).height);
}

var chart = document.querySelector('#chart1');

w = getInnerWidth(chart);
h = getInnerHeight(chart);

// <-- Make Selection -->
// Possible values --
// quartile: [1 2 3 4]
// variable: ['Income' 'Payments' 'Consumption' 'Utility']
// amount: [ 5000     0 70000 30000]
// type: ['ISA' 'cg' 'ISA-Purdue' 'debt' 'IDR' 'hsg']
// risk: [1 2 3 4]

// default selection
var grad_default = document.querySelector('input[name="grad"][value="1"]').checked = true;
  var quartile_default = document.querySelector('input[name="quartile"][value="1"]').checked = true;
  var amount_default = document.querySelector('input[name="amount"][value="70000"]').checked = true;
  var risk_default = document.querySelector('input[name="risk"][value="1"]').checked = true;

var grad_checked = document.querySelectorAll('input[name="grad"]:checked');
    var quartile_checked = document.querySelectorAll('input[name="quartile"]:checked');
    var amount_checked = document.querySelectorAll('input[name="amount"]:checked');
    var risk_checked = document.querySelectorAll('input[name="risk"]:checked');

for(i=0;i<grad_checked.length;i++){
  grad=grad_checked[i].value;
}
for(i=0;i<quartile_checked.length;i++){
  quartile=quartile_checked[i].value;
}
for(i=0;i<amount_checked.length;i++){
  amount=amount_checked[i].value;
}
for(i=0;i<risk_checked.length;i++){
  risk=risk_checked[i].value;
}
type="ISA";

var radios = document.querySelectorAll('input');
var alerts = document.querySelectorAll('.alert');
var message1 = document.querySelector('#message1');
var message2 = document.querySelector('#message2');
var svg1 = document.querySelector('#one');
var svg2 = document.querySelector('#two');
var buttons = document.querySelectorAll('.button');
isa_button = document.getElementById('ISA');
isa_button.style.backgroundColor="#ED574B";
isa_button.style.color="white";

status();

// return results based on user input for demographics, financing and risk
for (i=0;i<radios.length;i++){
  radios[i].onchange=function() {
    document.querySelector('input[name="grad"][value="0"]').checked = false;
    status();
    console.log(grad + quartile + amount + type + risk);
    update();
  }
}

// return results based on agent (financial instrument) selection
for (i=0;i<buttons.length;i++){
  buttons[i].onclick= function() {
    type = this.id;
    for(i=0;i<buttons.length;i++){
      buttons[i].style.backgroundColor="#CCCC";
      buttons[i].style.color="#666666";
    }
    this.style.backgroundColor="#ED574B";
    this.style.color="white";
    update();
  }
}

// <-- Functions -->
function status() {
    grad_checked = document.querySelectorAll('input[name="grad"]:checked');
    quartile_checked = document.querySelectorAll('input[name="quartile"]:checked');
    amount_checked = document.querySelectorAll('input[name="amount"]:checked');
    risk_checked = document.querySelectorAll('input[name="risk"]:checked');
    label1 = document.querySelector('#label1');
    label2 = document.querySelector('#label2');
    console.log(grad_checked.length + "," + quartile_checked.length + "," + amount_checked.length + "," + risk_checked.length)
    if(grad_checked.length == 0 | quartile_checked.length == 0 & amount_checked.length == 1 & risk_checked ==1){
      alerts[0].style.display="inline-block";
      alerts[0].style.width="100%";
      alerts[1].style.display="inline-block";
      alerts[1].style.width="100%";
      svg1.style.display="none";
      svg2.style.display="none";
      message1.innerHTML="Please enter your demographics";
      message2.innerHTML="Please enter your demographics";
      label1.style.display="none";
      label2.style.display="none";
    }
    if (grad_checked.length == 1 & quartile_checked.length == 1 & amount_checked.length == 1 & risk_checked.length == 1){
      alerts[0].style.display="none";
      alerts[1].style.display="none";
      svg1.style.display="inline-block";
      svg2.style.display="inline-block";
      label1.style.display="block";
      label2.style.display="block";
      for(i=0;i<grad_checked.length;i++){
        grad=grad_checked[i].value;
      }
      for(i=0;i<quartile_checked.length;i++){
        quartile=quartile_checked[i].value;
      }
      for(i=0;i<amount_checked.length;i++){
        amount=amount_checked[i].value;
      }
      for(i=0;i<risk_checked.length;i++){
        risk=risk_checked[i].value;
      }
    }
}


function loadData() {
  d3.csv("https://raw.githubusercontent.com/JainFamilyInstitute/isa-app/master/data/data_vis.csv?token=AXiiVRe2vdAFYXmRstaM_4TETeNWq3Lbks5b8w8SwA%3D%3D", function(error, data) {
  //   if (error) throw error;
  getIncome(data);
  getConsumption(data);

  });
}

loadData();

function update() {
  d3.csv("https://raw.githubusercontent.com/JainFamilyInstitute/isa-app/master/data/data_vis.csv?token=AXiiVRe2vdAFYXmRstaM_4TETeNWq3Lbks5b8w8SwA%3D%3D", function(error, data) {
  //   if (error) throw error;
  updateIncome(data);
  updateConsumption(data);

  });
}

// chart stuff
 margin = {top: h/8, right: w/10, bottom: h/8, left: w/10},
    width = w - margin.left - margin.right,
    height = h - margin.top - margin.bottom;

x = d3.scaleLinear()
  .rangeRound([0, width]);

y = d3.scaleLinear()
  .rangeRound([height,0]);

valueline = d3.line()
    .x(function(d) { return x(d.key); })
    .y(function(d) { return y(d.value); });

valueline2 = d3.line()
    .x(function(d) { return x(d.key); })
    .y(function(d) { return y(d.value); });

// get data functions

function getIncome(data) {

var svg1 = d3.select("#one")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

d3.select('#label1').html("Lifetime "+ "<em1>Income </em1>" + "and " + "<em2>Payments</em2>");
d3.select('#label2').html("Lifetime "+ "<em3>Consumption</em1>");

  // filter by selection
  data1 = data.filter(function(d) { 
          return (d.quartile == quartile) &
          (d.variable == 'Income') &
          (d.amount == amount) &
          (d.type == type) &
          (d.risk == risk) }); 

  // create visualizable array with only ages and amounts for selected series
  data_filtered = data1.map(({ quartile,amount,risk,type,variable, ...item }) => item);
  data_vis = data_filtered[0];

  result = [];
  for(i=22;i<101;i++){
    key = i;
    value =parseFloat(data_vis[i]);
    if(key == "Age") {
      // do nothing
    } else {
      result.push({
            key: key,
            value: value
        });
    }
  }

    // filter by selection
  data2 = data.filter(function(d) { 
          return (d.quartile == quartile) &
          (d.variable == 'Payment') &
          (d.amount == amount) &
          (d.type == type) &
          (d.risk == risk) }); 

  // create visualizable array with only ages and amounts for selected series
  data_filtered2 = data2.map(({ quartile,amount,risk,type,variable, ...item }) => item);
  data_vis2 = data_filtered2[0];

  result2 = [];
  for(i=22;i<101;i++){
    key = i;
    value =parseFloat(data_vis2[i]);
    if(key == "Age") {
      // do nothing
    } else {
      result2.push({
            key: key,
            value: value
        });
    }
  }

  console.log(result2);

  income_max = d3.max(result, function(d) { return d.value; });
  payment_max = d3.max(result2, function(d) { return d.value; });
  max = Math.max(income_max, payment_max);
  console.log(income_max + ", " + payment_max + ", " + max);

  // Scale the range of the data
  x.domain([d3.min(result, function(d) { return d.key; }), d3.max(result, function(d) { return d.key; })]);
  y.domain([0, d3.max(result, function(d) { return d.value; })]);

  // Add the valueline path.
  svg1.append("path")
      .data([result])
      .attr("class", "line")
      .attr("id", "line1")
      .attr("d", valueline);

  svg1.append("path")
    .data([result2])
    .attr("class", "line")
    .attr("id", "line2")
    .style("stroke", "blue")
    .attr("d", valueline);

  // Add the X Axis
  svg1.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  // Add the Y Axis
    function y_grid_lines() {
    return d3.axisLeft(y)
  }

  svg1.append("g")
    .attr("class", "grid")
    .attr("id", "y-axis1")
    // .call(y_grid_lines()
    //   .tickSize(-width)
    //   );
    .call(d3.axisLeft(y));

}


function getConsumption(data) {

variable= 'Consumption';

var svg2 = d3.select("#two")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

  // filter by selection
  data = data.filter(function(d) { 
          return (d.quartile == quartile) &
          (d.variable == variable) &
          (d.amount == amount) &
          (d.type == type) &
          (d.risk == risk) }); 

  // create visualizable array with only ages and amounts for selected series
  data_filtered = data.map(({ quartile,amount,risk,type,variable, ...item }) => item);
  data_vis = data_filtered[0];

  result = [];
  for(i=22;i<101;i++){
    key = i;
    value =parseFloat(data_vis[i]);
    if(key == "Age") {
      // do nothing
    } else {
      result.push({
            key: key,
            value: value
        });
    }
  }

  // Scale the range of the data
  x.domain([d3.min(result, function(d) { return d.key; }), d3.max(result, function(d) { return d.key; })]);
  y.domain([0, d3.max(result, function(d) { return d.value; })]);

  // Add the valueline path.
  svg2.append("path")
      .data([result])
      .attr("class", "line")
      .attr("id", "line2")
      .style("stroke", "black")
      .attr("d", valueline);

  // Add the X Axis
  svg2.append("g")
      .attr("id","x-axis2")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  // Add the Y Axis
    function y_grid_lines() {
    return d3.axisLeft(y)
  }
  
  svg2.append("g")
      .attr("id","y-axis2")
      .call(y_grid_lines()
      .tickSize(-width)
      );

}

// update data functions

function updateIncome(data) {

variable= 'Income';

var svg1 = d3.select("#one").transition();

  // filter by selection
   data1 = data.filter(function(d) { 
          return (d.quartile == quartile) &
          (d.variable == 'Income') &
          (d.amount == amount) &
          (d.type == type) &
          (d.risk == risk) }); 

  // create visualizable array with only ages and amounts for selected series
  data_filtered = data1.map(({ quartile,amount,risk,type,variable, ...item }) => item);
  data_vis = data_filtered[0];

  result = [];
  for(i=22;i<101;i++){
    key = i;
    value =parseFloat(data_vis[i]);
    if(key == "Age") {
      // do nothing
    } else {
      result.push({
            key: key,
            value: value
        });
    }
  }

    // filter by selection
  data2 = data.filter(function(d) { 
          return (d.quartile == quartile) &
          (d.variable == 'Payment') &
          (d.amount == amount) &
          (d.type == type) &
          (d.risk == risk) }); 

  // create visualizable array with only ages and amounts for selected series
  data_filtered2 = data2.map(({ quartile,amount,risk,type,variable, ...item }) => item);
  data_vis2 = data_filtered2[0];

  result2 = [];
  for(i=22;i<101;i++){
    key = i;
    value =parseFloat(data_vis2[i]);
    if(key == "Age") {
      // do nothing
    } else {
      result2.push({
            key: key,
            value: value
        });
    }
  }

  console.log(result2);

  income_max = d3.max(result, function(d) { return d.value; });
  payment_max = d3.max(result2, function(d) { return d.value; });
  max = Math.max(income_max, payment_max);
  console.log(income_max + ", " + payment_max + ", " + max);

  // Scale the range of the data
 x.domain([d3.min(result, function(d) { return d.key; }), d3.max(result, function(d) { return d.key; })]);
 y.domain([0, d3.max(result, function(d) { return d.value; })]);

  // Add the valueline path.
  svg1.select("#line1")
      .duration(750)
      .attr("d", valueline(result));

  svg1.select("#line2")
    .duration(750)
    .attr("d", valueline(result2));

  // Add the X Axis
  svg1.select("#x-axis1")
      .duration(750)
      .call(d3.axisBottom(x));

  // Add the Y Axis
    function y_grid_lines() {
    return d3.axisLeft(y)
  }

  svg1.select("#y-axis1")
    .duration(750)
    .call(y_grid_lines()
      .tickSize(-width)
      );

}


function updateConsumption(data) {

variable= 'Consumption';

var svg2 = d3.select("#two").transition();

  // filter by selection
  data = data.filter(function(d) { 
          return (d.quartile == quartile) &
          (d.variable == variable) &
          (d.amount == amount) &
          (d.type == type) &
          (d.risk == risk) }); 

  // create visualizable array with only ages and amounts for selected series
  data_filtered = data.map(({ quartile,amount,risk,type,variable, ...item }) => item);
  data_vis = data_filtered[0];

  result = [];
  for(i=22;i<101;i++){
    key = i;
    value =parseFloat(data_vis[i]);
    if(key == "Age") {
      // do nothing
    } else {
      result.push({
            key: key,
            value: value
        });
    }
  }
  console.log(result);


  // Scale the range of the data
  x.domain([d3.min(result, function(d) { return d.key; }), d3.max(result, function(d) { return d.key; })]);
  y.domain([0, d3.max(result, function(d) { return d.value; })]);

  svg2.select("#line2")
      .duration(750)
      .attr("d", valueline(result));

  // Add the X Axis
  svg2.select("#x-axis1")
      .duration(750)
      .call(d3.axisBottom(x));

  // Add the Y Axis
    function y_grid_lines() {
    return d3.axisLeft(y)
  }

  svg2.select("#y-axis2")
    .duration(750)
    .call(y_grid_lines()
      .tickSize(-width)
      );

}


