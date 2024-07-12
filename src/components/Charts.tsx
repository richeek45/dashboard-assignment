
import { Row } from "@/global.types";
import * as d3 from "d3";
import { useEffect } from "react";

const width = 480, height = 300;

const Charts = ({ rowData } : { rowData: Row[] }) => {

  useEffect(() => {
    const svg = d3.select("#chart").attr("width", width).attr("height", height);

    const x_scale = d3.scaleBand().range([0, width]).padding(0.1);
    const y_scale = d3.scaleLinear().range([height, 0]);

    // @ts-expect-error -> error
    d3.json("http://localhost:3000/data").then((sampleData: { AuthorWorklog: { rows: Rows[]}}) => {  
      const data = sampleData.AuthorWorklog.rows[0].totalActivity;
      console.log(data); 
      if (data) {
        x_scale.domain(data.map((d: { name: string }) => d.name));
        // @ts-expect-error -> error
        y_scale.domain([0, d3.max(data, (d) => d.value)]);
      }

      svg
        .selectAll("rect")
        .data(data)
        .join("rect")
        .attr("class", "bar")
        // @ts-expect-error -> error
        .attr("x", (d) => x_scale(d.name))
        .attr("y", (d) => y_scale(d.value))
        .attr("width", x_scale.bandwidth())
        .attr("height", (d) => height - y_scale(d.value));
    })


  }, [])

  return <div>
    <svg id="chart"></svg>
  </div>

}


export default Charts;