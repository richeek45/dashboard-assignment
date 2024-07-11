
import { Activity } from "@/global.types";
// import * as d3 from "d3";

const height = 500;
const width = 300;


const Charts = ({activityData} : {activityData: Activity}) => {
  const radius = Math.min(width, height) / 2;
  console.log(activityData, radius);

  // const arc = d3.arc().innerRadius()

  return <div>

  </div>

}


export default Charts;