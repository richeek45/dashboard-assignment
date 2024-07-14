import { DayWiseActivity, Items, RepoActions } from "@/global.types";
import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import SelectActionTypes from "./SelectActionTypes";

const margin = { top: 20, right: 30, bottom: 55, left: 70 };
const width = 640, height = 300;

const findRepoActionsByDate = (dayWiseActivity: DayWiseActivity[], actionType: RepoActions) => {
  return dayWiseActivity.map(data => {
    const openPRs = data.items.children.find(i => i.label === actionType) as Items;
    return ({ date: data.date, ...openPRs})
  })
}


const DayWiseActivityChart = ({dayWiseActivity} : {dayWiseActivity: DayWiseActivity[]}) => {
  const dayChartRef = useRef(null);
  const [selectActionType, setSelectActionType] = useState(RepoActions.PR_OPEN);
  const openPRsByDate = findRepoActionsByDate(dayWiseActivity, selectActionType);

  useEffect(() => {
    const xMin = d3.min(openPRsByDate, (d) => d.date) as Date;
    const xMax = d3.max(openPRsByDate, (d) => d.date) as Date;

    const yMin = d3.min(openPRsByDate, (d) => d.count) as string;
    const yMax = d3.max(openPRsByDate, (d) => d.count) as string;


    const xScale = d3.scaleTime()
      .domain([new Date(xMin), new Date(xMax)])
      .range([margin.left, width-margin.right])

    const yScale = d3.scaleLinear()
      .domain([Number(yMin), Number(yMax)])
      .range([height-margin.bottom, margin.top])


    // 4. Draw and transform/translate horizontal and vertical axes
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    const svg = d3.select(dayChartRef.current).append('svg').attr("width", width).attr("height", height).attr("viewBox", [0, 0, width, height]);


    svg.append("g")
    .attr("transform", "translate(0, "+ (height - margin.bottom) + ")")
    .attr("id", "x-axis")
    .call(xAxis)

    svg.append("g")
        .attr("transform", "translate("+ (margin.left)+", 0)")
        .attr("id", "y-axis")
        .call(yAxis)
    // 5. Draw individual bars and define mouse events for the tooltip
    const barwidth = (xScale.range()[1] - xScale.range()[0]) / openPRsByDate.length

    const tooltip = d3.select("#main").append("div").attr("id", "tooltip").style("visibility", "hidden")

    svg.selectAll("rect")
    .data(openPRsByDate)
    .enter()
    .append("rect")
    .attr("x", (d) => xScale(new Date(d.date)))
    .attr("y", (d) => yScale(+d.count))
    .attr("width", barwidth)
    .attr("height", (d) => height - margin.bottom - yScale(+d.count))
    .attr("fill", d => d.fillColor)
    .attr("data-date", (d) => d.date as unknown as string)
    .attr("data-count", (d) => d.count)
    .on("mouseover", (event, d) => {
        tooltip.style("visibility", "visible")
               .style("left", event.pageX+10+"px")
               .style("top", event.pageY-80+"px")
               .attr("data-date", d.date as unknown as string)
               .html(d.date + "</br>" + d.count + " " + d.label )
    })
    .on("mousemove", (event) => {
        tooltip.style("left", event.pageX+10+"px")
    })
    .on("mouseout", () => {
        tooltip.style("visibility", "hidden")
    })

     // 6. Finalize chart by adding title and axes labels
     svg.append("text")
        .attr("x", margin.left + (width - margin.left - margin.right) / 2)
        .attr("y", height - margin.bottom / 5)
        .attr("class", "label")
        .text("Date");

      svg.append("text")
         .attr("y", margin.left/4)
         .attr("x", -height/2)
         .attr("transform", "rotate(-90)")
         .attr("class", "label")
         .text(selectActionType);

    svg.append("text")
        .attr("x", margin.left + (width - margin.left - margin.right) / 2)
        .attr("y", margin.top)
        .attr("id", "title")
        .text(selectActionType);

  return () => {
    d3.select(dayChartRef.current).select('svg').remove();
  };

  }, [selectActionType])


  return (<div id="main">
    <SelectActionTypes setSelectActionTypes={setSelectActionType} />
    <div ref={dayChartRef}></div>
  </div>)

}

export default DayWiseActivityChart;