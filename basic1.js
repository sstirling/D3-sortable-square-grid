function random (start, end) {
  var range = end - start;
  return start + Math.floor(Math.random() * range);
}

function randomPick (array) {
  var length = array.length;
  var index = random(0, array.length);
  return array[index];
}

function ascending (a, b) {
  return typeof a === 'string' ? 
    a.localeCompare(b) :
    a.size - b.size;
}
function descending (a, b) {
  return typeof a === 'string' ? 
    b.localeCompare(a) :
    b.size - a.size;
}

function randomComparator (d) {
  return randomPick([-1, 0, 1]);
}

function capitalize (str) {
  return str[0].toUpperCase() + str.substr(1);
}

var color = d3.scale.ordinal()
  .domain(["nextgen911", "911", "Other"])
  .range(["#3DB1E2", "#FF9400" , "#BC4384"]);

var width = 640;
var height = 1000;
var sizeScale = d3.scale.quantile().domain([20, 40]).range(d3.range(20, 40, 4));
var delayScale = d3.scale.linear().domain([0, 400]).range([0, 300]);
var alldata;


var svg = d3.select('svg')
  .attr('width', width)
  .attr('height', height);

d3.csv("dollar-breakdown1.csv", function(data)
   {

     alldata = data.map(function(d, i) { 
        return {

    index: i,
    x: (i % 40) * 10 * 1.25,
    y: Math.floor(i / 40) * 10 * 1.7,
    color: color(d.Category),
    size: (6),
    category: d.Category
  }
         }
       )


     var shapes = svg.selectAll('.shape').data(alldata)
  .enter()
    .append('g')
      .attr('transform', function (d) { return 'translate(' + d.x + ',' + d.y + ')'; })
      .attr('data-size', function (d) { return d.size; })
      .attr('data-shape', function (d) { return d.shape; })
      .attr('data-category', function (d) { return d.category; });



var squares = shapes
  .append('rect')
    .attr('width', function (d) { return d.size; })
    .attr('height', function (d) { return d.size; })
    .attr('x', function (d) { return - d.size / 2; })
    .attr('y', function (d) { return - d.size / 2; })
    .attr('fill', function (d) { return d.color; });

var grid = d3.layout.grid()
  .width(width)
  .height(height)
  .colWidth(9)
  .rowHeight(9)
  .marginTop(75)
  .marginLeft(30)
  .sectionPadding(65)
  .data(alldata);


  function transition () {
  updateLabels();
  svg.attr('height', grid.height());
  shapes.transition()
    .duration(750)
    .delay(function (d) { return delayScale(d.groupIndex * 150 + d.index * 1); })
    .attr('transform', function (d) { return 'translate(' + d.x + ',' + d.y + ')'; });
}

function updateLabels () {
  var groups = grid.groups();

  console.log(groups)

  // Provide d3 a key function so that labels are animated correctly
  // http://bost.ocks.org/mike/constancy/
  var labels = svg.selectAll('text').data(groups, function (d) { return d.name; });
  labels.enter()
    .append('text')
      .attr('y', function (d) { return d.y - 40; })
      .style('opacity', 0);
  labels.exit()
      .transition()
      .style('opacity', 0)
    .remove();

  labels
    .text(function (d) { if (d.name == 'undefined') {return 'Single Phone Bill: $10.80'; } else {return capitalize(d.name);  } })
    .transition()
      .duration(750)
      .attr('x', 25)
      .attr('y', function (d) { return d.y - 20; })
      .style('opacity', 1);
}

function sortGroupAscend () {
  grid.sort(ascending);

  updateLabels();
  transition();
}

function sortGroupDescend () {
  grid.sort(descending);

  updateLabels();
  transition();
}

function sortSizeAscend () {
  grid.sort(null, ascending);
  transition();
}

function sortSizeDescend () {
  grid.sort(null, descending);
  transition();
}

function sortRandom () {
  grid.sort(randomComparator, randomComparator)
  transition();
}


function groupByCat () {
  grid.groupBy('category');
  transition();
}

sortRandom();

// document.getElementById('group-ascend').onclick = sortGroupAscend;
// document.getElementById('group-descend').onclick = sortGroupDescend;
// document.getElementById('size-ascend').onclick = sortSizeAscend;
// document.getElementById('size-descend').onclick = sortSizeDescend;
// document.getElementById('random').onclick = sortRandom;
document.getElementById('groupby-category').onclick = groupByCat;

    

    }

       )







