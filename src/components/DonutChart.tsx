import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { Activity, TotalActivity } from "@/global.types";
import { height, width } from "./Charts";



const DonutChart = ({totalActivity, activityData } : {totalActivity: TotalActivity[], activityData: Activity[] }) => {
  const donutRef = useRef(null);
  const radius = Math.min(width, height) / 2;


  useEffect(() => {
    const color = d3.scaleOrdinal()
      .domain(totalActivity.map(d => d.name))
      .range(activityData.map(data => data.fillColor)); 
              
    const pie = d3.pie<TotalActivity>().padAngle(1 / radius).sort(null).value(d => +d.value);
    const arc = d3.arc().innerRadius(radius * 0.67).outerRadius(radius - 1);

    const svg = d3
      .select(donutRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    svg.selectAll("arc")
      .data(pie(totalActivity))
      .join('path')
      .attr("fill", (d) => color(d.data.name) as string)
      // @ts-expect-error error
      .attr("d", arc)
      .attr("class", "arc")
      .style("stroke-width", "1px")

    svg.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 16)
      .attr("text-anchor", "middle")
      .selectAll('arc')
      .data(pie(totalActivity))
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
    svg.append("text")
    .attr("x", -70)
    .attr("y", 0)
    .attr("class", "label")
    .text("Total Activity");


  }, [])


  return (<svg id="donut" className="h-full" ref={donutRef}></svg>)

}

export default DonutChart;
