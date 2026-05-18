import React, { memo, useEffect , useState ,useRef } from 'react';
import vis, { type SubGroupStackOptions } from 'vis';
<<<<<<< HEAD
import  Timeline  from  'react-calendar-timeline' 
import  moment  from  'moment'
import Box from '@mui/material/Box';
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Popper from '@mui/material/Popper';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Fade from '@mui/material/Fade';
import 'vis-timeline/styles/vis-timeline-graph2d.min.css';
import './App.css';
import { Dataset } from '@mui/icons-material';

const timelineOptions = {
  width: "100%",
  stack: true, 
  showMajorLabels: true,
  showCurrentTime: true, 
  zoomMin: 10000, 
  type: "range", 
  maxHeight: '120px', 
  minHeight: '50px',
  format: {
    minorLabels: {
      minute: 'h:mma',
      hour: 'ha'
    }
  }
}

const groups = [{ id: 1, content: 'HOMOrange type group', }]
const list = ["は","ひ"];

interface ShiftItem {
  className?: string;
  start: Date;
  end: Date;
  content: string;
  type: string;
  group: number;
}

interface TimelineProps extends vis.DataSet<ShiftItem>{
}

let Shiftitems = new vis.DataSet<ShiftItem>();
Shiftitems.add([
    {className: 'range-type-class', start: new Date(2018, 2, 20, 10, 10, 0), end: new Date(2018, 2, 20, 11, 9, 0), content: 'range type item', type: 'range', group: 1,},
    {className: 'range-type-class2', start: new Date(2018, 2, 20, 11, 45, 0), end: new Date(2018, 2, 20, 14, 19, 0), content: "range type item2", type: 'range', group: 1,}
]);

export default function App(){
  return (<div><Barr/><p>個人シフト</p>    <Timeliner
      options={timelineOptions}
      items={Shiftitems}
      groups={[{ id: 1, content: 'あなたのシフト' }]}
    /><p>全体シフト</p><ShiftField /><TestPop /> </div>
  );
}

=======
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

>>>>>>> a50a3659f46d6c190ae0661da389fcf9f05bf0d5
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
<<<<<<< HEAD
  <Box sx={{ border: 1, p: 1 ,bgcolor: 'background.paper'}} >
=======
  <Box sx={{ border: 1, p: 1 }}>
>>>>>>> a50a3659f46d6c190ae0661da389fcf9f05bf0d5
    <PersonList/>
  </Box>
</Popper></div>);
}

<<<<<<< HEAD
function PersonProp({p}:{p:string}){
  return (<div>
    <p>{p}</p>
    <p>シフト回数:3</p>
  <p><Link>ほかのシフトを表示</Link></p>
  <p><Link>交代</Link></p></div>);
}

function Barr(){
    return (
    <div >
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
          >
          </IconButton>
          <Typography variant="h6">
            シフト管理システム
          </Typography>
        </Toolbar>
      </AppBar>
    </div>
  );
}

function Person({e} : {e:string} ){
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };
  const open = Boolean(anchorEl);
  const id = open ? "${anchorEl}Data" : undefined;
  return (<div><Button variant="outlined" onClick = {handleClick}
  >{e}</Button><Popper id={id} open={open} anchorEl={anchorEl} >
    <Box sx = {{ border: 1, p: 1, bgcolor : "background.paper"}}><PersonProp p = {e}/></Box></Popper></div>);
=======
function Person({e} : {e:string} ){
  return (<Button variant="outlined"
  >{e}</Button>);
>>>>>>> a50a3659f46d6c190ae0661da389fcf9f05bf0d5
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
<<<<<<< HEAD
    <Timeliner
      options={timelineOptions} items={Shiftitems} groups={groups} 
=======
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
>>>>>>> a50a3659f46d6c190ae0661da389fcf9f05bf0d5
    /><ShiftPop />
  </div>); 
}

<<<<<<< HEAD
function Timeliner({options,items,groups} : {options:object,items:TimelineProps ,groups:object[]} ){
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };
  const open = Boolean(anchorEl);
  const container = useRef<HTMLDivElement>(null);
  let id = "";   
  useEffect(() => {
    if (!container.current) return;
    let timeline = new vis.Timeline(container.current, items, groups, options);
    timeline.on('select', (event) => {
      if (event.items) {
        id = event.items[0]
        const targetElement = event.event.srcEvent.target.closest('.vis-item');        if(targetElement){
          setTimeout(() => {
            setAnchorEl(targetElement);
          }, 0);
        console.log(targetElement);
        return;
        } else {
          setAnchorEl(null);
        }
      } else {
        setAnchorEl(null);
      }
    });
    return () => {
      timeline.destroy();
    };
  }, [options, items, groups]);
  return <div style={{ position: 'relative' }}><div ref={container} /><Popper id={id} open={open} anchorEl={anchorEl} placement="bottom" popperOptions={{
  }} transition>
  <Box sx={{ border: 1, p: 1,bgcolor: 'background.paper'}}>
    <PersonList/>
  </Box>
</Popper></div>;
=======
function selected(){
  
>>>>>>> a50a3659f46d6c190ae0661da389fcf9f05bf0d5
}