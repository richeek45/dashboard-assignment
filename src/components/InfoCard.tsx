import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card"
import { TotalActivity } from "@/global.types";
import { ChevronsRight } from "lucide-react";


const InfoCard = ({ activity } : { activity: TotalActivity }) => {

  return (<Card className="drop-shadow-sm">
    <CardHeader className="p-3">
      <CardDescription className="flex gap-1 hover:text-slate-700">
        {activity.name}
        <ChevronsRight className="hover:translate-x-1 transition" />
      </CardDescription>
    </CardHeader>
    <CardContent className="flex justify-start pb-3 px-3 items-center gap-2">
      <p className="text-2xl font-medium">{activity.value}</p>
      <p className="text-sm text-slate-400 hover:text-slate-700">view more</p>
    </CardContent>
  </Card>
  )

} 

export default InfoCard;