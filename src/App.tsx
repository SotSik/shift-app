import React, { memo, useEffect , useState ,useRef } from 'react';
import vis, { type SubGroupStackOptions } from 'vis';
import  Timeline  from 'react-calendar-timeline' 
import 'react-calendar-timeline/style.css'
import  moment  from  'moment'
import Box from '@mui/material/Box';
import Popper from '@mui/material/Popper';
import Button from '@mui/material/Button';
import Fade from '@mui/material/Fade';
import './App.css';
import { Dataset } from '@mui/icons-material';
import { createRoot } from 'react-dom/client'

const groups = [{ id: 1, title: 'group 1' }, { id: 2, title: 'group 2' }]
const list = ["homo","gaki"];

const items = [
  {
    id: 1,
    group: 1,
    title: 'item 1',
    start_time: moment(),
    end_time: moment().add(1, 'hour')
  },
  {
    id: 2,
    group: 2,
    title: 'item 2',
    start_time: moment().add(-0.5, 'hour'),
    end_time: moment().add(0.5, 'hour')
  },
  {
    id: 3,
    group: 1,
    title: 'item 3',
    start_time: moment().add(2, 'hour'),
    end_time: moment().add(3, 'hour')
  }
]

export default function App(){
  return (<div><p>個人シフト</p><p>全体シフト</p><ShiftField /><TestPop /> </div>
  );
}

function TestPop(){
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popper' : undefined;
  return(<div><Button onClick={handleClick}>
  Toggle Popper
</Button>
<Popper id={id} open={open} anchorEl={anchorEl}>
  <Box sx={{ border: 1, p: 1 }}>
    <PersonList/>
  </Box>
</Popper></div>);
}

function ShiftPop(){
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popper' : undefined;
  return(<div>
<Popper id={id} open={open} anchorEl={anchorEl}>
  <Box sx={{ border: 1, p: 1 }}>
    <PersonList/>
  </Box>
</Popper></div>);
}

function Person({e} : {e:string} ){
  return (<Button variant="outlined"
  >{e}</Button>);
}

function PersonList(){
  let elm;
  elm = list.map( v => 
    <div> <Person e={v} /> </div>
  );
  return elm;
}

function ShiftField(){
  return (<div>
    <Timeline
      groups={groups}
      items={items}
      defaultTimeStart= {moment().add(-12, 'hour').valueOf()}
      defaultTimeEnd= {moment().add(12, "hour").valueOf()}
      dragSnap = {1000*60*240}
      minZoom = {15*60*1000}
      maxZoom = {10 * 86400 * 100}
      canMove = {false}
      onItemSelect
    /><ShiftPop />
  </div>); 
}

function selected(){
  
}