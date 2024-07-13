/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any */
import { Activity, Row, TotalActivity } from "@/global.types";
import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";
import BarChart from "./BarChart";

export const width = 360, height = 300;

const radius = Math.min(width, height) / 2;

const Charts = ({ rowData, activityData } : { rowData: Row[], activityData: Activity[] }) => { 
  const donutRef = useRef(null);
  const [sampleData, setSampleData] = useState<TotalActivity[] | null>(null);

  useEffect(() => {

    // @ts-expect-error -> error
    d3.json("../../sample-data.json").then(({ data }: { AuthorWorklog: { rows: Rows[]}}) => {  
      const sampleData: TotalActivity[] = data.AuthorWorklog.rows[0].totalActivity;

      setSampleData(sampleData);

      if (sampleData) {
        const color = d3.scaleOrdinal()
        .domain(sampleData.map(d => d.name))
        .range(activityData.map(data => data.fillColor)); 
                  
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

        svg2.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 16)
        .attr("text-anchor", "middle")
        .selectAll('arc')
        .data(pie(sampleData))
        .join("text")
        .attr("transform", d => `translate(${arc.centroid(d as unknown as d3.DefaultArcObject)})`)
        .call(text => text.append("tspan")
            .attr("y", "-0.4em")
            .attr("font-weight", "normal")
            .text(d => d.data.name))
        .call(text => text.filter(d => (d.endAngle - d.startAngle) > 0.25).append("tspan")
            .attr("x", 0)
            .attr("y", "0.7em")
            .attr("fill-opacity", 0.7)
            .text(d => d.data.value.toLocaleString()));


      }
      
    })


  }, [])

  return <div className="flex p-10 justify-end gap-10">
    <div></div>
    <div className="drop-shadow-md border-gray-300 border-2">
      <svg id="daywise"></svg>
    </div>
    <div className="drop-shadow-md border-gray-300 border-2">
     {activityData && sampleData &&  <BarChart sampleData={sampleData} activityData={activityData} />}
    </div>
    <div className="drop-shadow-md border-gray-300 border-2">
      <svg id="donut" ref={donutRef}></svg>
    </div>
  </div>

}


export default Charts;