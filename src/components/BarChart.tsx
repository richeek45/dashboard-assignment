import { useRef } from "react";
import { useEffect } from "react";
import * as d3 from "d3";
import { Activity, TotalActivity } from "@/global.types";
import { height, width } from "./Charts";


const margin = { top: 20, right: 30, bottom: 55, left: 70 };

const BarChart = ({sampleData, activityData } : {sampleData: TotalActivity[], activityData: Activity[] }) => {
  const chartRef = useRef(null);


  useEffect(() => {

    const svg = d3.select(chartRef.current).attr("width", width).attr("height", height).attr("viewBox", [0, 0, width, height]);
    const x_scale = d3.scaleBand().range([margin.left, width - margin.right]).padding(0.2);
    const y_scale = d3.scaleLinear().range([height - margin.bottom, margin.top]);
    const x_axis = d3.axisBottom(x_scale);
    const y_axis = d3.axisLeft(y_scale);        
    x_scale.domain(sampleData.map((d) => d.name));
    y_scale.domain([0, d3.max(sampleData, (d) => +d.value) || 0]);
    const color = d3.scaleOrdinal()
    .domain(sampleData.map(d => d.name))
    .range(activityData.map(data => data.fillColor));


    svg
    .selectAll("rect")
    .data(sampleData)
    .join("rect")
    .attr("fill", d => color(d.name) as string)
    .attr("x", (d) => x_scale(d.name) as number)
    .attr("y", (d) => y_scale(+d.value))
    .attr("width", x_scale.bandwidth())
    .attr("height", (d) => height - margin.bottom - y_scale(+d.value));

  // append x axis
  svg
  .append("g")
  .attr("transform", `translate(0,${height - margin.bottom})`)
  .call(x_axis)
  .selectAll("text") // everything from this point is optional
  .style("text-anchor", "end")
  .attr("dx", "-.8em")
  .attr("dy", ".15em")
  .attr("transform", "rotate(-65)");

  // add y axis
  svg
    .append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(y_axis);

  }, [])


  return (<svg id="chart" ref={chartRef}></svg>)
}

export default BarChart;