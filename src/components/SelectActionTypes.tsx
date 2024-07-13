import * as React from "react"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { RepoActions } from "@/global.types"

const SelectActionTypes = ({setSelectActionTypes} : {setSelectActionTypes: (val: RepoActions) => void}) => {
  const actionTypes = [  
    RepoActions.PR_OPEN, 
    RepoActions.PR_REVIEWED, 
    RepoActions.PR_MERGED, 
    RepoActions.PR_COMMENTS, 
    RepoActions.COMMITS, 
    RepoActions.INCIDENT_ALERTS, 
    RepoActions.INCIDENT_RESOLVED
  ]
  return (
    <Select onValueChange={(value) => setSelectActionTypes(value as RepoActions)}>
      <SelectTrigger  className="w-[180px]">
        <SelectValue placeholder="Select Actions" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {actionTypes.map(value => (
            <SelectItem value={value}>{value}</SelectItem>
          ))
          }
          
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

export default SelectActionTypes;
