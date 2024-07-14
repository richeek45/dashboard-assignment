import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { DayWiseActivity, RepoActions } from "@/global.types";


const margin = { top: 20, right: 30, bottom: 55, left: 70 };
const width = 640, height = 300;

const MultiChart = ({ dayWiseActivity } : {dayWiseActivity: DayWiseActivity[]}) => {
  const multiChartRef = useRef(null);
  
  
  const data = dayWiseActivity.reduce(
    (prev: { count: string; fillColor: string; label: RepoActions; date: string; }[], curr) => {
    const items = curr.items.children.map(i => ({ date: curr.date, ...i}))
   
    return [ ...prev, ...items];
  }, [])

  useEffect(() => {
    
  const svg = d3
    .select(multiChartRef.current)
    .append('svg')
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height]);

  const series = d3.stack().keys(d3.union(data.map(d => d.label)))
  // @ts-expect-error error
    .value(([, group], key) => +group.get(key).count)(d3.index(data, d => d.date, d => d.label));

  console.log(series)

  const x = d3.scaleBand()
      .domain(d3.groupSort(data, D => -d3.sum(D, d => +d.count), d => d.date))
      .range([margin.left, width - margin.right])
      .padding(0.1);

  const y = d3.scaleLinear()

      .domain([0, d3.max(series, d => d3.max(d, d => +d[1])) as number])
      .rangeRound([height - margin.bottom, margin.top]);

  const color = d3.scaleOrdinal()
      .domain(series.map(d => d.key))
      .range(d3.schemeSpectral[series.length])
      .unknown("#ccc");

   // A function to format the value in the tooltip.
   const formatValue = (x: number) => isNaN(x) ? "N/A" : x.toLocaleString("en")

  // Append a group for each series, and a rect for each element in the series.
  svg.append("g")
    .selectAll()
    .data(series)
    .join("g")
      .attr("fill", d =>  color((d.key)) as string)
    .selectAll("rect")
    // @ts-expect-error error
    .data(D => D.map(d => (d.key = D.key, d)))
    .join("rect")
      .attr("x", d => x(d.data[0].toString()) as unknown as string)
      .attr("y", d => y(d[1]))
      .attr("height", d => y(d[0]) - y(d[1]))
      .attr("width", x.bandwidth())
    .append("title")
    // @ts-expect-error error
      .text(d => `${d.data[0]} ${d.key}\n${formatValue(d.data[1].get(d.key).count)}`);

  // Append the horizontal axis.
  svg.append("g")
  .attr("transform", `translate(0,${height - margin.bottom})`)
  .call(d3.axisBottom(x))
  .selectAll("text") // everything from this point is optional
  .style("text-anchor", "end")
  .attr("dx", "-.8em")
  .attr("dy", ".15em")
  .attr("transform", "rotate(-65)")
  .call(g => g.selectAll(".domain").remove());

  // Append the vertical axis.
  svg.append("g")
  .attr("transform", `translate(${margin.left},0)`)
  .call(d3.axisLeft(y).ticks(null, "s"))
  .call(g => g.selectAll(".domain").remove());

  return () => {
    d3.select(multiChartRef.current).select('svg').remove();
  } 

  }, [])


  return <div ref={multiChartRef}></div>
}

export default MultiChart;