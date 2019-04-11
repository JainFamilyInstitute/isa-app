// variables we'll be filtering by
var grad;
var quartile;
var amount;
var type;
var risk;

if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
  // don't reload on window resize
} else {
  window.onresize=function() {
    location.reload();
  }
}

function getInnerWidth(elem) {
    return parseFloat(window.getComputedStyle(elem).width);
}

function getInnerHeight(elem) {
    return parseFloat(window.getComputedStyle(elem).height);
}

var chart = document.querySelector('#chart1');

var w;
var h;

function calculateSize() {
  w = getInnerWidth(chart);
  h = getInnerHeight(chart);
}

calculateSize();

// <-- Make Selection -->
// Possible values --
// quartile: [1 2 3 4]
// variable: ['Income' 'Payments' 'Consumption' 'Utility']
// amount: [ 5000     0 70000 30000]
// type: ['ISA' 'cg' 'ISA-Purdue' 'debt' 'IDR' 'hsg']
// risk: [1 2 3 4]

// Default Selection on Landing
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
type="debt";

var radios = document.querySelectorAll('input');
var alerts = document.querySelectorAll('.alert');
var message1 = document.querySelector('#message1');
var message2 = document.querySelector('#message2');
var svg1 = document.querySelector('#one');
var svg2 = document.querySelector('#two');
var svg3 = document.querySelector('#three');
var buttons = document.querySelectorAll('.button');
debt_button = document.getElementById('debt');
debt_button.style.backgroundColor="#572EFF";
debt_button.style.color="white";

status();

// return results based on user input for demographics, financing and risk
for (i=0;i<radios.length;i++){
  radios[i].onchange=function() {
    document.querySelector('input[name="grad"][value="0"]').checked = false;
    status();
    cg=document.querySelector('#cg').style.color;
    if(cg=="white"){
          removeChart2();
    } else {
          readdChart2();
    }
    update();
  }
}


zero_amount = document.querySelector('input[name="amount"][value="0"]');
zero_amount.onclick=function() {
  document.querySelector('#cg').click();
  status();
  update();
}

// return results based on agent (financial instrument) selection
function agentListen() {
  for (i=0;i<buttons.length;i++){
  buttons[i].onclick= function() {
    type = this.id;
    if(amount!="0"){
    for(i=0;i<buttons.length;i++){
          buttons[i].style.backgroundColor="#CCCC";
          buttons[i].style.color="#666666";
          if(profile_counter==1){
              overlay.style.display="none";
              tour.style.display="none";
              tour_pointer.display="none";
              document.querySelector('#ISA-Purdue').style.zIndex="1";
          }
          if(type=="cg"){
            document.querySelector('input[name="amount"][value="0"]').checked = true;
          }
    }
      this.style.backgroundColor="#572EFF";
      this.style.color="white";
      status();
      update();
      }
    }
  }
}

agentListen();

// popup info lightbox

function getInfo() {
  infos = document.querySelectorAll('.info');
  lightbox = document.querySelector('.info-lightbox');
  console.log(infos);
  for(i=0;i<infos.length;i++){
    if(window.innerWidth<767){
    infos[i].onclick=function() {
      function getpos(event) {
      var e = window.event;
        x = e.clientX + "px";
          y = e.clientY + "px";
      }
      getpos();
      parent = this.parentNode;
      grandparent = this.parentNode.parentNode;
      lightbox.style.left=x;
      lightbox.style.top=y;
      lightbox.style.display="inline-block";
      // listenClose('.info-lightbox');
      title = this.previousElementSibling.innerHTML;
      lightbox.querySelector('h1').innerHTML=title;
      d3.csv('data/definitions.csv',function(error,data){
        data= data.filter(function(d){return d.category == title})
        lightbox.querySelector('p').innerHTML="";
        lightbox.querySelector('p').innerHTML+=data[0]['definition'];
      });
    }
    infos[i].onmouseout=function() {
       lightbox.style.display="none";
    }

    } else {
    infos[i].onmouseover=function() {
      function getpos(event) {
      var e = window.event;
        x = e.clientX + "px";
          y = e.clientY + "px";
      }
      getpos();
      parent = this.parentNode;
      grandparent = this.parentNode.parentNode;
      lightbox.style.left=x;
      lightbox.style.top=y;
      lightbox.style.display="inline-block";
      // listenClose('.info-lightbox');
      title = this.previousElementSibling.innerHTML;
      lightbox.querySelector('h1').innerHTML=title;
      d3.csv('data/definitions.csv',function(error,data){
        data= data.filter(function(d){return d.category == title})
        lightbox.querySelector('p').innerHTML="";
        lightbox.querySelector('p').innerHTML+=data[0]['definition'];
      });
    }
    infos[i].onmouseout=function() {
       lightbox.style.display="none";
    }

    }
  }

  function listenClose(item){
    parent = document.querySelector(item);
    close =parent.querySelector('close');
    close.onclick=function() {
      parent.style.display="none";
      shadow.style.display="none";
    }
  }
}


// profile filter selection
// Possible profiles --
// Jamie: quartile=3, amount=30000, risk=3
// Rob: quartile=4, amount=70000, risk=4
profiles = document.querySelectorAll('.profile');
profile1 = document.querySelector('#profile1');
profile2 = document.querySelector('#profile2');
profile1.onclick=function() {
  document.querySelector('input[name="grad"][value="1"]').checked = true;
  document.querySelector('input[name="quartile"][value="2"]').checked = true;
  document.querySelector('input[name="amount"][value="30000"]').checked = true;
  document.querySelector('input[name="risk"][value="3"]').checked = true;
  status();
  update();
}
profile2.onclick=function() {
  document.querySelector('input[name="grad"][value="1"]').checked = true;
  document.querySelector('input[name="quartile"][value="1"]').checked = true;
  document.querySelector('input[name="amount"][value="70000"]').checked = true;
  document.querySelector('input[name="risk"][value="4"]').checked = true;
  status();
  update();
}

// track first time a profile is clicked to provide tour
profile_counter=0;
for(i=0;i<profiles.length;i++){
  profiles[i].onclick=function(){
    profile_counter+=1;
    showtour();
  }
}
function showtour() {
  if (profile_counter==1){
    el = document.querySelector("#ISA-Purdue");
    rect = el.getBoundingClientRect();
    target = document.querySelector('body');
    overlay=document.createElement('div');
    overlay.setAttribute("class","overlay");
    tour = document.createElement('div');
    tour.setAttribute("id","tour");
    tour.style.display="block";
    tour.innerHTML="<p>Toggle to ISA to see circumstances change by choosing this financial instrument</p>"
    tour.style.top=rect.top-110+"px";
    tour.style.left=rect.left-20+"px";
    if(window.innerWidth<767){
      // don't appen overlay
    } else {
      target.appendChild(overlay);
    }
    target.appendChild(tour);
    tour_pointer = document.createElement('div');
    tour_pointer.setAttribute("class","arrow-down");
    tour.appendChild(tour_pointer);
    el.style.position="relative";
    el.style.zIndex="102";
    }
  }

function profileStatus() {
  if (grad_checked.value == 1 && quartile_checked.value == 2 && amount_checked.value == 30000 && risk_checked.value == 3){
    profile1.style.backgroundColor="#572EFF";
    profile1.style.color="#white";
    profile1.style.border="0.05em solid #572EFF";
  } else if (grad_checked.value == 1 && quartile_checked.value == 1 && amount_checked.value == 70000 && risk_checked.value == 4){
    profile2.style.backgroundColor="##572EFF";
    profile2.style.color="white";
    profile2.style.border="0.05em solid #572EFF";
  } else {
    // don't check any profile
    profile1.style.backgroundColor="white";
    profile1.style.color="#572EFF";
    profile1.style.border="0.05em solid #572EFF";
    profile2.style.backgroundColor="white";
    profile2.style.color="#572EFF";
    profile2.style.border="0.05em solid #572EFF";
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
    label3 = document.querySelector('#label3');
    chart1 = document.querySelector('#chart1');
    chart2 = document.querySelector('#chart2');
    chart3 = document.querySelector('#chart3');
    // console.log(grad_checked.length + "," + quartile_checked.length + "," + amount_checked.length + "," + risk_checked.length)
    if(grad_checked.length == 0 | quartile_checked.length == 0 & amount_checked.length == 1 & risk_checked ==1){
      alerts[0].style.display="inline-block";
      alerts[0].style.width="100%";
      svg1.style.display="none";
      svg2.style.display="none";
      svg3.style.display="none";
      message1.innerHTML="Please enter your demographics";
      message2.innerHTML="Please enter your demographics";
      chart1.style.display="none!important";
      chart2.style.display="none!important";
      chart3.style.display="none!important";
    }
    if (grad_checked.length == 1 & quartile_checked.length == 1 & amount_checked.length == 1 & risk_checked.length == 1){
      alerts[0].style.display="none";
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
      chart1.style.display="inline-block";
      if(amount==0){
        removeChart2();
        update();
      }else {
        chart2.style.display="inline-block";
      }
      chart3.style.display="inline-block";
      // svg1.style.display="inline-block";
      // svg2.style.display="inline-block";
      // svg3.style.display="inline-block";
    } 
    // profile status
      if (grad == 1 && quartile == 2 && amount == 30000 && risk== 3){
      profile1.style.backgroundColor="#572EFF";
      profile1.style.color="white";
      profile1.style.border="0.05em solid #572EFF";
      profile2.style.backgroundColor="white";
      profile2.style.color="#572EFF";
      profile2.style.border="0.05em solid #572EFF";
    } else if (grad == 1 && quartile == 1 && amount == 70000 && risk == 4){
      profile2.style.backgroundColor="#572EFF";
      profile2.style.color="white";
      profile2.style.border="0.05em solid #572EFF";
      profile1.style.backgroundColor="white";
      profile1.style.color="#572EFF";
      profile1.style.border="0.05em solid #572EFF";
    } else {
      // don't check any profile
      profile1.style.backgroundColor="white";
      profile1.style.color="#572EFF";
      profile1.style.border="0.05em solid #572EFF";
      profile2.style.backgroundColor="white";
      profile2.style.color="#572EFF";
      profile2.style.border="0.05em solid #572EFF";
    }
    var hexDigits = new Array
        ("0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f"); 

    //Function to convert rgb color to hex format
    function rgb2hex(rgb) {
     rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
     return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
    }

    function hex(x) {
      return isNaN(x) ? "00" : hexDigits[(x - x % 16) / 16] + hexDigits[x % 16];
     }
    free = document.querySelector('#cg');
    debt = document.querySelector('#debt');
    free_status = free.style.color;
    console.log(free_status);
    console.log(amount);
    if (amount == 5000 | amount == 30000 | amount == 70000) {
      if (free_status=="white" && grad==1){
        debt.click();
        console.log("need to switch")
      }
    }
}

function loadData() {
  d3.csv("data/data_vis2.csv", function(error, data) {
  //   if (error) throw error;
    if(amount != 0 | free_status =="white"){
    getIncome(data);
    getPayments(data);
    getConsumption(data);
    getInfo();
    } else {
      getIncome(data);
      getConsumption(data);
      getInfo();
    }
  });
}

loadData();

function removeChart2() {
  document.querySelector('#chart2').style.display="none";
  if(window.innerWidth<767){
    document.querySelector('#chart1').style.width="100%";
    document.querySelector('#chart3').style.width="100%";
  }else {
    document.querySelector('#chart1').style.width="45%";
    document.querySelector('#chart3').style.width="45%";
  }
}

function readdChart2() {
  document.querySelector('#chart2').style.display="inline-block";
  if(window.innerWidth<767){
    document.querySelector('#chart1').style.width="100%";
    document.querySelector('#chart3').style.width="100%";
  }else {
    document.querySelector('#chart1').style.width="30%";
    document.querySelector('#chart3').style.width="30%";
  }
}

function update() {
  d3.csv("data/data_vis2.csv", function(error, data) {

  //   if (error) throw error;
    if(amount == 0 ){
      calculateSize();
      calculateChartSize();
      updateIncome(data);
      updateConsumption(data);
      getInfo();
    } else {
      readdChart2();
      calculateSize();
      calculateChartSize();
      updateIncome(data);
      updatePayments(data);
      updateConsumption(data);
      getInfo();
    }
  });
}

// chart stuff
var areaFunction;
var div;
function calculateChartSize() {
margin = {top: h/4, right: w/6, bottom: h/4, left: w/12},
    width = w - margin.left - margin.right,
    height = h - margin.top - margin.bottom;
 padding = {top: margin.top + 20, right: margin.right + 20, bottom: margin.bottom+20, left: margin.left},

x = d3.scaleLinear()
  .rangeRound([0, width]);

y = d3.scaleLinear()
  .rangeRound([height,0]);

  //Initiate the area line function
  areaFunction = d3.area()
  .x(function (d) {
    return x(d.key);
  })
  .y0(height)
  .y1(function (d) {
    return y(d.value);
  });

valueline = d3.line()
    .x(function(d) { return x(d.key); })
    .y(function(d) { return y(d.value); });

valueline2 = d3.line()
    .x(function(d) { return x(d.key); })
    .y(function(d) { return y(d.value); });

div = d3.select("body").append("div") 
    .attr("class", "tooltip")       
    .style("opacity", 0);
}

calculateChartSize();

// get data functions

function getIncome(data) {

var svg1 = d3.select("#one")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

d3.select('#label1').html("Lifetime "+ "<em1>Income </em1>");

svg1.append("text")
        .attr("x", width + 25)             
        .attr("y", height + 15)
        .attr("class", "x-label")  
        .text("Age");
 //Define the gradient below the line chart
  var areaGradient = svg1.append('defs')
  .append("linearGradient")
  .attr('id', 'areaGradient')
  .attr("x1", "0%").attr("y1", "0%")
  .attr("x2", "0%").attr("y2", "100%");

  //Append the first stop - the color at the top
  areaGradient.append("stop")
    .attr("offset", "0%")
    .attr("stop-color", "#ED574B")
    .attr("stop-opacity", 0.4);

  //Append the second stop - white transparant almost at the end
  areaGradient.append("stop")
    .attr("offset", "100%")
    .attr("stop-color", "#F1CFCE")
    .attr("stop-opacity", 0);

  // First fetch: Income Data
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
  for(i=22;i<66;i++){
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
  // x.domain([d3.min(result, function(d) { return d.key; }), d3.max(result, function(d) { return d.key; })]);
  x.domain([d3.min(result, function(d) { return d.key; }), d3.max(result, function(d) { return d.key; })]);
  y.domain([0, d3.max(result, function(d) { return d.value; })]);

 // add the area
  svg1.append("path")
    .attr("class", "area")
    .attr("id", "area1")
    .style("fill", "url(#areaGradient)")
    .attr("d", areaFunction(result));

  // Add the valueline path.
  svg1.append("path")
      .data([result])
      .attr("class", "line")
      .attr("id", "line1")
      .attr("d", valueline);

    const focus = svg1.append('g')
      .attr('class', 'focus')
      .style('display', 'none');
  
    focus.append('circle')
      .attr('r', 4.5);

  // Add the X Axis
  svg1.append("g")
      .attr("transform", "translate(0," + height + ")")
      .attr("id", "x-axis1")
      .call(d3.axisBottom(x));

  // Add the Y Axis
    function y_grid_lines() {
    return d3.axisLeft(y)
  }

  svg1.append("g")
    .attr("class", "grid")
    .attr("id", "y-axis1")
    .call(y_grid_lines()
      .ticks(5)
      .tickFormat(d3.format("$.2s"))
      .tickSize(-width)
      );

}

function getPayments(data) {

var svg2 = d3.select("#two")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

d3.select('#label2').html("Lifetime <em2>"+ type + " Payments</em2>" );

svg2.append("text")
        .attr("x", width + 25)             
        .attr("y", height + 15)
        .attr("class", "x-label")  
        .text("Age");

  // First fetch: Income Data
  data1 = data.filter(function(d) { 
          return (d.quartile == quartile) &
          (d.variable == 'Payment') &
          (d.amount == amount) &
          (d.type == type) &
          (d.risk == risk) }); 

  // create visualizable array with only ages and amounts for selected series
  data_filtered = data1.map(({ quartile,amount,risk,type,variable, ...item }) => item);
  data_vis = data_filtered[0];

  result = [];
  for(i=22;i<44;i++){
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

    // Payments Data: Loan
  data2 = data.filter(function(d) { 
          return (d.quartile == quartile) &
          (d.variable == 'Payment') &
          (d.amount == amount) &
          (d.type == 'debt') &
          (d.risk == risk) }); 

  // create visualizable array with only ages and amounts for selected series
  data_filtered2 = data2.map(({ quartile,amount,risk,type,variable, ...item }) => item);
  data_vis2 = data_filtered2[0];

  result2 = [];
  for(i=22;i<44;i++){
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

  // Payments Data: IDR
  data3 = data.filter(function(d) { 
          return (d.quartile == quartile) &
          (d.variable == 'Payment') &
          (d.amount == amount) &
          (d.type == 'IDR') &
          (d.risk == risk) }); 

  // create visualizable array with only ages and amounts for selected series
  data_filtered3 = data3.map(({ quartile,amount,risk,type,variable, ...item }) => item);
  data_vis3 = data_filtered3[0];

  result3 = [];
  for(i=22;i<44;i++){
    key = i;
    value =parseFloat(data_vis3[i]);
    if(key == "Age") {
      // do nothing
    } else {
      result3.push({
            key: key,
            value: value
        });
    }
  }

  // Payments Data: ISA
  data4 = data.filter(function(d) { 
          return (d.quartile == quartile) &
          (d.variable == 'Payment') &
          (d.amount == amount) &
          (d.type == 'ISA-Purdue') &
          (d.risk == risk) }); 

  // create visualizable array with only ages and amounts for selected series
  data_filtered4 = data4.map(({ quartile,amount,risk,type,variable, ...item }) => item);
  data_vis4 = data_filtered4[0];

  result4 = [];
  for(i=22;i<44;i++){
    key = i;
    value =parseFloat(data_vis4[i]);
    if(key == "Age") {
      // do nothing
    } else {
      result4.push({
            key: key,
            value: value
        });
    }
  }

  selected_max = d3.max(result, function(d) { return d.value; });
  loan_max = d3.max(result2, function(d) { return d.value; });
  IDR_max = d3.max(result3, function(d) {return d.value;});
  ISA_max = d3.max(result4, function(d) {return d.value;});
  max = Math.max(selected_max, loan_max, IDR_max, ISA_max);
  console.log(max);

  // Scale the range of the data
  x.domain([d3.min(result, function(d) { return d.key; }), 44]);
  y.domain([0, max]);

  // Add the valueline path.

var line3_5_1 = svg2.append("path")
    .data([result4])
    .attr("class", "line")
    .attr("id", "line3_5_1")
    .style("stroke", "#CCCCCC")
    .style("stroke-width", "3")
    .on("mouseover", function(d) {
    line3_5_1.transition()
      .duration(100)
      .style("stroke","#dbdbdb")   
      div.transition()    
          .duration(100)    
          .style("opacity", .9);    
      div.html(data4[0]['type'])  
          .style("left", (d3.event.pageX) + "px")   
          .style("top", (d3.event.pageY - 28) + "px");  
      })  
    .on("mouseout", function(d) {   
      line3_5_1.transition()
        .duration(100)
        .style("stroke", "#CCCCCC")
      div.transition()    
          .duration(100)    
          .style("opacity", 0)
      })  
    .attr("d", valueline);

  var line3_5 = svg2.append("path")
    .data([result3])
    .attr("class", "line")
    .attr("id", "line3_5")
    .style("stroke", "#CCCCCC")
    .style("stroke-width", "3")
    .on("mouseover", function(d) { 
      line3_5.transition()
      .duration(100)
      .style("stroke","#dbdbdb")     
      div.transition()    
          .duration(100)    
          .style("opacity", .9);    
      div.html(data3[0]['type'])  
          .style("left", (d3.event.pageX) + "px")   
          .style("top", (d3.event.pageY - 28) + "px");  
      })  
    .on("mouseout", function(d) { 
      line3_5.transition()
        .duration(100)
        .style("stroke", "#CCCCCC")  
      div.transition()    
          .duration(100)    
          .style("opacity", 0)
      })  
    .attr("d", valueline);

  var line3 = svg2.append("path")
    .data([result2])
    .attr("class", "line")
    .attr("id", "line3")
    .style("stroke", "#213182")
    .style("stroke-width", "3")
    .on("mouseover", function(d) { 
      line3.transition()
        .duration(100)
        .style("stroke","#283a96")       
      div.transition()    
          .duration(100)    
          .style("opacity", .9);    
      div.html(data2[0]['type'])  
          .style("left", (d3.event.pageX) + "px")   
          .style("top", (d3.event.pageY - 28) + "px");  
      })  
    .on("mouseout", function(d) {  
      line3.transition()
        .duration(100)
        .style("stroke", "#213182")   
      div.transition()    
          .duration(100)    
          .style("opacity", 0)
      })  
    .attr("d", valueline);

  svg2.append("path")
      .data([result])
      .attr("class", "line")
      .attr("id", "line2")
      .style("stroke", "#4873EB")
      .attr("d", valueline);

  // Add the X Axis
  svg2.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  // Add the Y Axis
    function y_grid_lines() {
    return d3.axisLeft(y)
  }

  svg2.append("g")
    .attr("class", "grid")
    .attr("id", "y-axis2")
    .call(y_grid_lines()
      .ticks(5)
      .tickFormat(d3.format("$.2s"))
      .tickSize(-width)
      );

}


function getConsumption(data) {

variable= 'Consumption';

var svg3 = d3.select("#three")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

svg3.append("text")
        .attr("x", width + 25)             
        .attr("y", height + 15)
        .attr("class", "x-label")  
        .text("Age");

 //Define the gradient below the line chart
  var areaGradient2 = svg3.append('defs')
  .append("linearGradient")
  .attr('id', 'areaGradient2')
  .attr("x1", "0%").attr("y1", "0%")
  .attr("x2", "0%").attr("y2", "100%");

  //Append the first stop - the color at the top
  areaGradient2.append("stop")
    .attr("offset", "0%")
    .attr("stop-color", "#FBB03B")
    .attr("stop-opacity", 0.4);

  //Append the second stop - white transparant almost at the end
  areaGradient2.append("stop")
    .attr("offset", "100%")
    .attr("stop-color", "#FBE0B7")
    .attr("stop-opacity", 0);

d3.select('#label3').html("Lifetime "+ "<em3>Consumption</em1>");

 // First fetch: Consumption Data
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
  for(i=22;i<66;i++){
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

  consumption_sum = d3.sum(result, function(d){
        return d.value;
    });
  cformat = d3.format("$.4s")
  console.log(cformat(consumption_sum));


  // Scale the range of the data
  x.domain([d3.min(result, function(d) { return d.key; }), d3.max(result, function(d) { return d.key; })]);
  y.domain([0, d3.max(result, function(d) { return d.value; })]);

   // add the area
  cfill = svg3.append("path")
    .attr("class", "area")
    .attr("id", "area2")
    .style("fill", "url(#areaGradient2)")
    .on("mouseover", function(d){ 
      div.transition()    
          .duration(100)    
          .style("opacity", .9);    
      div.html(cformat(consumption_sum))  
          .style("left", (d3.event.pageX) + "px")   
          .style("top", (d3.event.pageY) + "px");  
    })
    .on("mouseout", function(d){
      div.transition()    
          .duration(100)    
          .style("opacity", 0)
    })
    .attr("d", areaFunction(result));

  consumption_banner =  d3.select("#net-consumption")
    .append("div")
    .attr("id", "consumption_sum")
    .html("<text>"+cformat(consumption_sum)+"</text><h2>Working Age Welfare</h2><div class='info'>i</div>");

  // Add the valueline path.
  svg3.append("path")
      .data([result])
      .attr("class", "line")
      .attr("id", "line4")
      .style("stroke", "#FBB03B")
      .attr("d", valueline);

  // Add the X Axis
  svg3.append("g")
      .attr("id","x-axis3")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  // Add the Y Axis
    function y_grid_lines() {
    return d3.axisLeft(y)
  }

  svg3.append("g")
      .attr("id","y-axis3")
      .call(y_grid_lines()
      .ticks(5)
      .tickFormat(d3.format("$.2s"))
      .tickSize(-width)
      );

}

// update data functions

function updateIncome(data) {

variable= 'Income';
   
var svg1 = d3.select("#one")
 .attr("width", width + margin.left + margin.right)
 .transition();

  // Update fetch: Income Data
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
  for(i=22;i<66;i++){
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
  // x.domain([d3.min(result, function(d) { return d.key; }), d3.max(result, function(d) { return d.key; })]);
 x.domain([d3.min(result, function(d) { return d.key; }), d3.max(result, function(d) { return d.key; })]);
  y.domain([0, d3.max(result, function(d) { return d.value; })]);

   // add the area
  svg1.select("#area1")
    .duration(750)
    .attr("d", areaFunction(result));

  svg1.select(".x-label")
    .duration(750)
    .attr("x", width + 25)             
    .attr("y", height + 15);

  // Add the valueline path.
  svg1.select("#line1")
      .duration(750)
      .attr("d", valueline(result));

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
      .ticks(5)
      .tickFormat(d3.format("$.2s"))
      .tickSize(-width)
      );

}

function updatePayments(data) {

var svg2 = d3.select("#two")
.attr("width", width + margin.left + margin.right)
.transition();

if(type != 'debt'){
  d3.select('#label2').html("Lifetime <em2>"+ type + " Payments</em2>");
} else {
  d3.select('#label2').html("Lifetime <em2> Loan Payments</em2>");
}


  // Update fetch: Income Data
   data1 = data.filter(function(d) { 
          return (d.quartile == quartile) &
          (d.variable == 'Payment') &
          (d.amount == amount) &
          (d.type == type) &
          (d.risk == risk) }); 

  // create visualizable array with only ages and amounts for selected series
  data_filtered = data1.map(({ quartile,amount,risk,type,variable, ...item }) => item);
  data_vis = data_filtered[0];

  result = [];
  for(i=22;i<44;i++){
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

  // Update Payments Data: Loans
  data2 = data.filter(function(d) { 
          return (d.quartile == quartile) &
          (d.variable == 'Payment') &
          (d.amount == amount) &
          (d.type == 'debt') &
          (d.risk == risk) }); 

  // create visualizable array with only ages and amounts for selected series
  data_filtered2 = data2.map(({ quartile,amount,risk,type,variable, ...item }) => item);
  data_vis2 = data_filtered2[0];

  result2 = [];
  for(i=22;i<44;i++){
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

  // Update Payments Data: IDR
  data3 = data.filter(function(d) { 
          return (d.quartile == quartile) &
          (d.variable == 'Payment') &
          (d.amount == amount) &
          (d.type == 'IDR') &
          (d.risk == risk) }); 

  // create visualizable array with only ages and amounts for selected series
  data_filtered3 = data3.map(({ quartile,amount,risk,type,variable, ...item }) => item);
  data_vis3 = data_filtered3[0];

  result3 = [];
  for(i=22;i<44;i++){
    key = i;
    value =parseFloat(data_vis3[i]);
    if(key == "Age") {
      // do nothing
    } else {
      result3.push({
            key: key,
            value: value
        });
    }
  }

  // Payments Data: ISA
  data4 = data.filter(function(d) { 
          return (d.quartile == quartile) &
          (d.variable == 'Payment') &
          (d.amount == amount) &
          (d.type == 'ISA-Purdue') &
          (d.risk == risk) }); 

  // create visualizable array with only ages and amounts for selected series
  data_filtered4 = data4.map(({ quartile,amount,risk,type,variable, ...item }) => item);
  data_vis4 = data_filtered4[0];

  result4 = [];
  for(i=22;i<44;i++){
    key = i;
    value =parseFloat(data_vis4[i]);
    if(key == "Age") {
      // do nothing
    } else {
      result4.push({
            key: key,
            value: value
        });
    }
  }

  selected_max = d3.max(result, function(d) { return d.value; });
  loan_max = d3.max(result2, function(d) { return d.value; });
  IDR_max = d3.max(result3, function(d) {return d.value;});
  ISA_max = d3.max(result4, function(d) {return d.value;});
  max = Math.max(selected_max, loan_max, IDR_max, ISA_max);
  console.log(max);

  // Scale the range of the data
  // x.domain([d3.min(result, function(d) { return d.key; }), d3.max(result, function(d) { return d.key; })]);
  x.domain([d3.min(result, function(d) { return d.key; }), 44]);
  y.domain([0, max]);

  // Add the valueline path.

    svg2.select("#line3_5_1")
    .duration(750)
    .attr("d", valueline(result4));

  svg2.select("#line3_5")
    .duration(750)
    .attr("d", valueline(result3));

  svg2.select("#line3")
    .duration(750)
    .attr("d", valueline(result2));

  svg2.select("#line2")
      .duration(750)
      .attr("d", valueline(result));

  // Add the X Axis
  svg2.select("#x-axis2")
      .duration(750)
      .call(d3.axisBottom(x));

  // Add the Y Axis
    function y_grid_lines() {
    return d3.axisLeft(y)
  }

  svg2.select("#y-axis2")
    .duration(750)
    .call(y_grid_lines()
      .ticks(5)
      .tickFormat(d3.format("$.2s"))
      .tickSize(-width)
      );

}


function updateConsumption(data) {

variable= 'Consumption';

var svg3 = d3.select("#three")
.attr("width", width + margin.left + margin.right)
.transition();

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

  // Update fetch: Consumption Data
  result = [];
  for(i=22;i<66;i++){
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

  consumption_sum = d3.sum(result, function(d){
        return d.value;
    });
  cformat = d3.format("$.4s")
  console.log(cformat(consumption_sum));


  // Scale the range of the data
  x.domain([d3.min(result, function(d) { return d.key; }), d3.max(result, function(d) { return d.key; })]);
  y.domain([0, d3.max(result, function(d) { return d.value; })]);


  d3.select("#consumption_sum")
    .html("<text>"+cformat(consumption_sum)+"</text><h2>Working Age Welfare</h2><div class='info'>i</div>");

     // add the area
  svg3.select("#area2")
    .duration(750)
    .attr("d", areaFunction(result));

  svg3.select(".x-label")
    .duration(750)
    .attr("x", width + 25)             
    .attr("y", height + 15);

  svg3.select("#line4")
      .duration(750)
      .attr("d", valueline(result));

  // Add the X Axis
  svg3.select("#x-axis3")
      .duration(750)
      .call(d3.axisBottom(x));

  // Add the Y Axis
    function y_grid_lines() {
    return d3.axisLeft(y)
  }

  svg3.select("#y-axis3")
    .duration(750)
    .call(y_grid_lines()
      .ticks(5)
      .tickFormat(d3.format("$.2s"))
      .tickSize(-width)
      );

}


