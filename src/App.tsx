import React, { memo, useEffect , useState ,useRef } from 'react';
import vis, { type SubGroupStackOptions } from 'vis';
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
  <Box sx={{ border: 1, p: 1 ,bgcolor: 'background.paper'}} >
    <PersonList/>
  </Box>
</Popper></div>);
}

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
    <Timeliner
      options={timelineOptions} items={Shiftitems} groups={groups} 
    /><ShiftPop />
  </div>); 
}

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
}