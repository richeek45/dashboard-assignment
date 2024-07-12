/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any */

import { Row, TotalActivity } from "@/global.types";
import * as d3 from "d3";
import { useEffect } from "react";

const width = 360, height = 300;

const Charts = ({ rowData } : { rowData: Row[] }) => {

  useEffect(() => {
    const svg = d3.select("#chart").attr("width", width).attr("height", height);

    const x_scale = d3.scaleBand().range([0, width]).padding(0.2);
    const y_scale = d3.scaleLinear().range([height, 0]);

    // @ts-expect-error -> error
    d3.json("http://localhost:3000/data").then((sampleData: { AuthorWorklog: { rows: Rows[]}}) => {  
      const data: TotalActivity[] = sampleData.AuthorWorklog.rows[0].totalActivity;
      console.log(data); 
      if (data) {
        x_scale.domain(data.map((d: { name: string }) => d.name));
        y_scale.domain([0, d3.max(data, (d) => +d.value) || 0]);
        
        svg
          .selectAll("rect")
          .data(data)
          .join("rect")
          .attr("class", "bar")
          .attr("x", (d) => x_scale(d.name) as number)
          .attr("y", (d) => y_scale(+d.value))
          .attr("width", x_scale.bandwidth())
          .attr("height", (d) => height - y_scale(+d.value));
      }
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