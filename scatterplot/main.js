import './style.css'

//getting data
const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"
async function getData() {
  const response =  fetch(url).then(response => response.json());
  return (
    response
  );
};

const dataset = (await getData());
const timeData = dataset.map(pre => {
  let m_s = (pre.Time).split(":");
  let formattedTime = new Date(Date.UTC( 0, 0, 0, 0, m_s[0], m_s[1] ))
  return(formattedTime)
});
const yearData = dataset.map(pre => pre.Year);

//scaling/axis
const h = 280;
const w = 600;
const padding = 40; 

const xScale = (
  d3.scaleTime()
    .domain([d3.min(yearData)-1, d3.max(yearData)+1])
    .range([padding, w-padding])
);
const yScale = (
  d3.scaleLinear()
    .domain([d3.min(timeData), d3.max(timeData)])
    .range([padding, h-padding])
);

let xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
let yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S"))

//graph

d3.select(".main")
  .append("h1")
  .attr("id", "title")
  .attr("class", "title")
  .text("Doping in Professional Bicycle Racing")

d3.select(".main")
  .append("h2")
  .attr("id", "sub-title")
  .attr("class", "sub-title")
  .text("35 Fastest times up Alpe d'Huez")

var tooltip = (
  d3.select(".main")
    .append("div")
    .attr("id", "tooltip")
    .attr('class', 'tooltip')
    .style('visibility', "hidden")
);

const  svg = (
  d3.select(".main")
    .append("svg")
    .attr("class", "main-graph")
    .attr("height", h)
    .attr("width", w)
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
  .selectAll("circle")
  .data(dataset)
  .enter()
  .append("circle")
  .attr("class", "dot")
  .attr("data-xvalue", (d,i) => yearData[i] )
  .attr("data-yvalue", (d,i) => timeData[i])
  .attr("cx", (d,i) => xScale(yearData[i]))
  .attr("cy", (d,i) => yScale(timeData[i]))
  .attr("r", 3)
  .style("fill", (d) =>{
    if(d.Doping === ""){
      return("rgba(255, 166, 0, 0.8)")
    }else {
      return("rgba(0, 81, 255, 0.8)")
    }
  })
  .on('mouseover',(e,d) => {
    console.log(e)
    console.log(d)
    tooltip.transition()
           .style("visibility", "visible");
    tooltip.html(d.Name)
           .attr("data-year", d.Year)
           .html(
             d.Name +
              ': ' +
              d.Nationality +
              '<br/>' +
              'Year: ' +
              d.Year +
              ', Time: ' +
              d.Time +
              (d.Doping ? '<br/><br/>' + d.Doping : '')
          )
          .style('left', 0 + xScale(d.Year) + 15 + 'px')
          .style('top', e.pageY - 28 + 'px');
  })
  .on('mouseout', function(){
    tooltip.transition()
           .style('visibility', "hidden")
  });
  ;
  const dopingColor = ["rgba(255, 166, 0, 0.8)", "rgba(0, 81, 255, 0.8)"]
  
  
     
      
 

  

