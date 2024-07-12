import { Button } from "@/components/ui/button"
import './App.css'
import { useEffect, useState } from "react";
import { Activity, Row } from "./global.types";
import Charts from "./components/Charts";
import InfoCard from "./components/InfoCard";

function App() {
  const [data, setData] = useState<Row[] | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [activityData, setActivityData] = useState<Activity[] | null>(null);

  useEffect(() => {
    fetch('../sample-data.json').then(res => res.json()).then(({data}) => {
      setActivityData(data.AuthorWorklog.activityMeta);
      setData(data.AuthorWorklog.rows);
    })
  }, [])



  return (
    <div>
      <nav className="border-gray-200 border-2 p-2 bg-white rounded-md w-screen mb-5">
        <div className="w-full">
          <Button variant="outline">Dashboard</Button>
        </div>
      </nav>
      <div className="w-full flex flex-col justify-center">
        <h6 className="mx-10 mb-5 text-xl font-semibold tracking-wide leading-2">Manage Your Insights</h6>
        <div className="flex justify-between gap-10 mb-10 mx-10">
          {data && data[0].totalActivity.map(activity => {
            return (
              <InfoCard key={activity.name} activity={activity} />
            )
          })}
        </div>
        <div>
          
          {data && activityData && <Charts rowData={data} activityData={activityData} />}
        </div>
      </div>
    </div>
  ) 
}

export default App
