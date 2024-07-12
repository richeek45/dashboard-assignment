/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any */
import { Row, TotalActivity } from "@/global.types";
import * as d3 from "d3";
import { useEffect, useRef } from "react";

const width = 360, height = 300;
const margin = { top: 20, right: 30, bottom: 55, left: 70 };
const radius = Math.min(width, height) / 2;

const Charts = ({ rowData } : { rowData: Row[] }) => { 
  const chartRef = useRef(null);
  const donutRef = useRef(null);

  useEffect(() => {

    const svg = d3.select(chartRef.current).attr("width", width).attr("height", height).attr("viewBox", [0, 0, width, height]);
    const x_scale = d3.scaleBand().range([margin.left, width - margin.right]).padding(0.2);
    const y_scale = d3.scaleLinear().range([height - margin.bottom, margin.top]);
    const x_axis = d3.axisBottom(x_scale);
    const y_axis = d3.axisLeft(y_scale);

    // @ts-expect-error -> error
    d3.json("../../sample-data.json").then(({ data }: { AuthorWorklog: { rows: Rows[]}}) => {  
      const sampleData: TotalActivity[] = data.AuthorWorklog.rows[0].totalActivity;
      const color = d3.scaleOrdinal()
      .domain(sampleData.map(d => d.name))
      .range(["#3DC2EC", "#06D001", "#FF4191", "#FFB4C2", "#009FBD"]);

      if (sampleData) {
        x_scale.domain(sampleData.map((d) => d.name));
        y_scale.domain([0, d3.max(sampleData, (d) => +d.value) || 0]);
        
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
                  
        const pie = d3.pie<TotalActivity>().padAngle(1 / radius).sort(null).value(d => +d.value);
        const arc = d3.arc().innerRadius(radius * 0.67).outerRadius(radius - 1);

        const svg2 = d3
        .select(donutRef.current)
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        svg2.selectAll("arc")
        .data(pie(sampleData))
        .join('path')
        .attr("fill", (d) => color(d.data.name) as string)
        // @ts-expect-error error
        .attr("d", arc)
        .attr("class", "arc")
        .style("stroke-width", "1px")


      }
      
    })


  }, [])

  return <div className="flex p-10 justify-end gap-10">
    <div></div>
    <div></div>
    <div className="drop-shadow-md border-gray-300 border-2">
      <svg id="chart" ref={chartRef}></svg>
    </div>
    <div className="drop-shadow-md border-gray-300 border-2">
      <svg id="donut" ref={donutRef}></svg>
    </div>
  </div>

}


export default Charts;