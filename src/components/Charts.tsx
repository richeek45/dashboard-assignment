/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any */
import { Activity, DayWiseActivity, Row, TotalActivity } from "@/global.types";
import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";
import BarChart from "./BarChart";
import DonutChart from "./DonutChart";
import DayWiseActivityChart from "./DayWiseActivityChart";

export const width = 360, height = 300;

const Charts = ({ rowData, activityData } : { rowData: Row[], activityData: Activity[] }) => { 
  const [totalActivity, setTotalActivity] = useState<TotalActivity[] | null>(null);
  const [dayWiseActivity, setDayWiseActivity] = useState<DayWiseActivity[] | null>(null);

  useEffect(() => {
    // @ts-expect-error -> error
    d3.json("../../sample-data.json").then(({ data }: { AuthorWorklog: { rows: Rows[]}}) => {  
      const sampleData: TotalActivity[] = data.AuthorWorklog.rows[0].totalActivity;
      const dayWiseActivity: DayWiseActivity[] = data.AuthorWorklog.rows[0].dayWiseActivity;
      setTotalActivity(sampleData);
      setDayWiseActivity(dayWiseActivity);
    })

  }, [])

  return <div className="flex p-10 justify-end gap-10">
    <div></div>
    <div className="drop-shadow-md border-gray-300 border-2">
      {dayWiseActivity && <DayWiseActivityChart dayWiseActivity={dayWiseActivity} />}
    </div>
    <div className="drop-shadow-md border-gray-300 border-2">
     {activityData && totalActivity &&  <BarChart totalActivity={totalActivity} activityData={activityData} />}
    </div>
    <div className="drop-shadow-md border-gray-300 border-2">
      {activityData && totalActivity && <DonutChart totalActivity={totalActivity} activityData={activityData} />}
    </div>
  </div>

}


export default Charts;