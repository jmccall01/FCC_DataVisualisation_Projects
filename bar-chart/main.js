import { i } from 'mathjs';
import './style.css'

//getting data
const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"
async function getData() {
  const response =  fetch(url).then(response => response.json());
  return (
    response
  );
};

const dataset = (await getData()).data;
const yearsArr = dataset.map(pre => new Date(pre[0]));
//setting scales and axis
const h = 280;
const w = 550;
const padding = 40; 

const xScale = (
  d3.scaleTime()
    .domain([d3.min(yearsArr), d3.max(yearsArr)])
    .range([padding, w-padding])
);

const xAxis = d3.axisBottom(xScale);

const yScale = (
  d3.scaleLinear()
    .domain([0, d3.max(dataset, (d) => d[1])])
    .range([h-padding, padding])
);

const yAxis = d3.axisLeft(yScale);



//graph

const barWidth = (w-padding*2) / (dataset.length)

d3.select('.graph-container')
  .append("h1")
  .text("United States GDP")
  .attr("id", "title")
  .attr("class", "title");

const svg = (
  d3.select('.graph-container')
    .append("svg")
    .attr("width", w + "px")
    .attr("height", h)
  );

var tooltip =( 
  d3.select('.graph-container')
  .append('div')
  .attr('id', 'tooltip')
  .attr('class', 'tooltip')
  .style('visibility', "hidden")
);

svg.append("g")
  .attr("transform", "translate("+padding+",0)")
  .attr("id", "y-axis")
  .call(yAxis);

svg.append("g")
  .attr("class", "xaxis")   
  .attr("id", "x-axis")
  .attr("transform", "translate(0," + (h-padding) + ")")
  .call(xAxis);

d3.select("svg")
  .selectAll("rect")
  .data(dataset)
  .enter()
  .append("rect")
  .attr("class", "bar")
  .attr("data-date", d => d[0])
  .attr("data-gdp", d => d[1])
  .attr("x", (d,i) => xScale(yearsArr[i]))
  .attr("y", (d) => yScale(d[1]))
  .attr("height", (d)=> h-padding-yScale(d[1]))
  .attr("width", barWidth)
  .attr("fill", '#33adff')
  .on('mouseover',(e,d) => {
    const i = dataset.indexOf(d);
    tooltip.transition()
           .style("visibility", "visible");
    tooltip.text("$" + d[1] + "bn")
           .attr("data-date", d[0])
           .style('left', (i * barWidth) + 1.5*padding + "px" )})
  .on('mouseout', function(){
    tooltip.transition()
           .style('visibility', "hidden")
  });