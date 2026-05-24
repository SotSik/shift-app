import React, { useContext , useEffect , useState ,useRef } from 'react';
import vis from 'vis';
import Box from '@mui/material/Box';
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Popper from '@mui/material/Popper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import 'vis-timeline/styles/vis-timeline-graph2d.min.css';
import './App.css';
import { Dataset } from '@mui/icons-material';

const SelectedShift = React.createContext("");
const SelectedElem = React.createContext<null | HTMLElement>(null);

const PersonaltimelineOptions = {
  width: "100vw",
  stack: true, 
  showMajorLabels: true,
  showCurrentTime: true, 
  zoomMin: 10000, 
  type: "range", 
  height: '120px',
  autoResize: true ,
  hiddenDates : {start: '2014-03-21 18:00:00', end: '2014-03-22 6:00:00', repeat:'daily'},
  format: {
    minorLabels: {
      minute: 'h:mma',
      hour: 'ha'
    }
  }
}
const timelineOptions = {
  width: "100vw",
  stack: true, 
  showMajorLabels: true,
  showCurrentTime: true, 
  zoomMax: 100000000,
  zoomMin: 100000000, 
  type: "range", 
  maxHeight: '120vh', 
  minHeight: '10vh',
  autoResize: true ,
  xss : {disabled : true},
  hiddenDates : {start: '2014-03-21 18:00:00', end: '2014-03-22 6:00:00', repeat:'daily'},
  format: {
    minorLabels: {
      minute: 'h:mma',
      hour: 'ha'
    }
  }
}

const groups = [{ id: 1, content: 'type1', },{ id: 2, content: 'type2', }]
const memberList = ["ナナフシ","つまようじ","薄型テレビ"];

interface ShiftItem {
  id: number | string;
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
    {id: 'range-type-class', start: new Date(2018, 2, 20, 10, 10, 0), end: new Date(2018, 2, 20, 11, 9, 0), content: 'シフト1', type: 'range', group: 1,},
    {id: 'range-type-class2', start: new Date(2018, 2, 20, 11, 45, 0), end: new Date(2018, 2, 20, 14, 19, 0), content: "シフト2", type: 'range', group: 1,},
    {id: 'range-type-class3', start: new Date(2018, 2, 20, 11, 0, 0), end: new Date(2018, 2, 20, 16, 0 , 0), content: "シフト3", type: 'range', group: 2,}
]);

let ShiftMembers = {
  "range-type-class" : ["ナナフシ","薄型テレビ"],
  "range-type-class2" : ["ナナフシ"],
  "range-type-class3" : ["つまようじ"]
}

export default function App(){
  const [user, setUser] = useState("");
  const [selectedElement, setElement] = useState(null);
  const [selectedShift, setSelectedShift] = useState("");
  return (<div><SelectedShift value = {selectedShift}><SelectedElem value = {selectedElement}><Barr/><h2>個人シフト  </h2> <TextField id="outlined-basic" label="総務部員" variant="outlined" error helperText = {"該当なし"} onChange={(e) => {
        setUser(e.target.value);
      }} />
      <Timeliner
      options={PersonaltimelineOptions}
      items={searchUsersShift({user})}
      groups={[{ id: 1, content: `${user}のシフト` }]}
      elmfunc={setElement}
      shiftfunc={setSelectedShift}
    /><h2>全体シフト</h2>
    <Timeliner
      options={timelineOptions} items={Shiftitems} groups={groups} 
      elmfunc={setElement}
      shiftfunc={setSelectedShift}
    /><ShiftPop /><TestPop /></SelectedElem></SelectedShift></div>
  );
}

function searchUsersShift({user} : {user:string}){
  let ans = new vis.DataSet<ShiftItem>();
  Shiftitems.forEach((s) => {
        if(s.id){
          console.log(s);
          console.log(user);
          //@ts-ignore
        if(ShiftMembers[s.id].includes(user)) {
          let r = s;
          r.group = 1;
          ans.add(r);
  } }});
  return ans;
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
<Popper id={id} open={open} anchorEl={anchorEl} placement = {"bottom"}>
  <Box sx={{ border: 1, p: 1 }}>
    <PersonList/>
  </Box>
</Popper></div>);
}

function ShiftPop(){
  const anchorEl = useContext(SelectedElem);
  console.log(anchorEl);
  const shiftName = useContext(SelectedShift);
  const open = Boolean(anchorEl);
  console.log(open);
  const id = open ? 'simple-popper' : undefined;
  return(<div>
<Popper id={id} open={open} anchorEl={anchorEl}>
  <Box sx={{ border: 1, p: 1 ,bgcolor: 'background.paper'}}>
     <p>{shiftName}</p> 
     <p><Link>シフト詳細を表示</Link></p>
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
  >{e}</Button><Popper id={id} open={open} anchorEl={anchorEl} popperOptions = {{strategy : "fixed"}}>
    <Box sx = {{ border: 1, p: 1, bgcolor : "background.paper" , zIndex: 999999}}><PersonProp p = {e}/></Box></Popper></div>);
}

function PersonList(){
  let elm;
  elm = memberList.map( v => 
    <div><Person e={v} /> </div>
  );
  return elm;
}

function Timeliner({options,items,groups,elmfunc,shiftfunc} : {options:object,items:TimelineProps ,groups:object[],elmfunc:object,shiftfunc:object} ){
  const container = useRef<HTMLDivElement>(null);
  let id = "";
  let targetElement;   
  useEffect(() => {
    if (!container.current) return;
    console.log(items);
    console.log(groups);
    let timeline = new vis.Timeline(container.current, items, groups, options);
    timeline.on('select', (event) => {
      if (event.items) {
        id = event.items[0]
        const targetEvent = event.event.srcEvent;
        targetElement = targetEvent.target.closest('.vis-item');
        //@ts-ignore
        elmfunc(targetElement);
        //@ts-ignore
        shiftfunc("HOMO ");
        console.log();
    }});
    return () => {
      timeline.destroy();
    };
  }, [options, items, groups]);
  //@ts-ignore
  return <div style={{ position: 'relative' }}><div ref={container} /></div>;
}