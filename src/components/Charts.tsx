/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any */

import { Row, TotalActivity } from "@/global.types";
import * as d3 from "d3";
import { useEffect } from "react";

const width = 360, height = 300;
const margin = { top: 20, right: 30, bottom: 55, left: 70 }

const Charts = ({ rowData } : { rowData: Row[] }) => {

  useEffect(() => {
    const svg = d3.select("#chart").attr("width", width).attr("height", height).attr("viewBox", [0, 0, width, height]);

    const x_scale = d3.scaleBand().range([margin.left, width - margin.right]).padding(0.2);
    const y_scale = d3.scaleLinear().range([height - margin.bottom, margin.top]);
    const x_axis = d3.axisBottom(x_scale);
    const y_axis = d3.axisLeft(y_scale);

    // @ts-expect-error -> error
    d3.json("http://localhost:3000/data").then((sampleData: { AuthorWorklog: { rows: Rows[]}}) => {  
      const data: TotalActivity[] = sampleData.AuthorWorklog.rows[0].totalActivity;
      if (data) {
        x_scale.domain(data.map((d) => d.name));
        y_scale.domain([0, d3.max(data, (d) => +d.value) || 0]);
        
        svg
          .selectAll("rect")
          .data(data)
          .join("rect")
          .attr("class", "bar")
          .attr("x", (d) => x_scale(d.name) as number)
          .attr("y", (d) => y_scale(+d.value))
          .attr("width", x_scale.bandwidth())
          .attr("height", (d) => height - margin.bottom - y_scale(+d.value));
      }

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
        
      
    })


  }, [])

  return <div className="flex p-10 justify-end">
    <div></div>
    <div></div>
    <div className="drop-shadow-md border-gray-300 border-2">
      <svg id="chart"></svg>
    </div>
  </div>

}


export default Charts;