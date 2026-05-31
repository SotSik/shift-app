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
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import 'vis-timeline/styles/vis-timeline-graph2d.min.css';
import './App.css';

const SelectedShift = React.createContext<string>("");
const SelectedElem = React.createContext<null | HTMLElement>(null);
const personalGroup = [{ id: 1, content: "個人シフト" }];

const PersonaltimelineOptions = {
  width: "100vw",
  stack: true, 
  showMajorLabels: true,
  showCurrentTime: true, 
  zoomMin: 10000, 
  type: "range", 
  height: '135px',
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
  "range-type-class" : ["ナナフシ","薄型テレビ","シャンシャン","タンバ","西田ゲリオン","タンバリン","帰れ","帰ります"],
  "range-type-class2" : ["ナナフシ"],
  "range-type-class3" : ["つまようじ"]
}

let ShiftNames = {
  "range-type-class":"シフト1",
  "range-type-class2" : "シフト2",
  "range-type-class3" : "シフト3" 
}

export default function App(){
  const defaultUser = localStorage.getItem("user");
  const [selectedElement, setElement] = useState(null);
  const [selectedShift, setSelectedShift] = useState("");
  const [user, setUser] = useState(defaultUser as string);
  const [otherMember, setOtherMember] = useState([] as string[]);
  return (<div><SelectedShift value = {selectedShift}><SelectedElem value = {selectedElement}><Barr/>
    <h2>個人シフト  </h2>
      <PersonalSpace user = {user} userChange = {setUser} elmfunc={setElement}
      shiftfunc={setSelectedShift}/> 
      <Other member={otherMember} elmfunc={setElement} shiftfunc={setSelectedShift} />
    <h2>全体シフト</h2>
    <Timeliner
      options={timelineOptions} items={Shiftitems} groups={groups} 
      elmfunc={setElement}
      shiftfunc={setSelectedShift}
    /><ShiftPop setOthers = {setOtherMember}/><TestPop /></SelectedElem></SelectedShift></div>
  );
}

function PersonalSpace({user,userChange,elmfunc,shiftfunc} : {user:string,userChange:object,elmfunc:object,shiftfunc:object}){
    const defaultUser = localStorage.getItem("user");
    const defaultItem = searchUsersShift(defaultUser as string);
    const [useritem, setUserItem] = useState(defaultItem);
    const found = Boolean(useritem.length);
    console.log(useritem);
    return (<div><TextField id="outlined-basic" label="総務部員" variant="outlined" 
      error={!found} helperText = {found ? "　" : "該当なし"} 
      defaultValue = {defaultUser}
      value = {user}
      onChange={(e) => {
        const u = e.target.value;
        userChange(u);
        setUserItem(searchUsersShift(u));
        console.log(u);
        localStorage.setItem("user", u);        
      }} />
      <Timeliner
      options={PersonaltimelineOptions}
      items={useritem}
      groups={personalGroup}
      elmfunc={elmfunc}
      shiftfunc={shiftfunc}
    /></div>);
}

function searchUsersShift(user : string){
  let ans = new vis.DataSet<ShiftItem>();
  console.log(user);
  Shiftitems.forEach((s) => {
        if(s.id){
          console.log(s);
        if(ShiftMembers[s.id].includes(user)) {
          let r = s;
          r.group = 1;
          ans.add(r);
  } }});
  return ans;
}

function Other({member,elmfunc,shiftfunc} : {member:string[],elmfunc:object,shiftfunc:object}){
  return( member.map((s) => 
  <OthersSpace user = {s} elmfunc = {elmfunc} shiftfunc = {shiftfunc}/>
  ));
}

function OthersSpace({user,elmfunc,shiftfunc} : {user:string,elmfunc:object,shiftfunc:object}){
    const defaultUser = user;
    const defaultItem = searchUsersShift(defaultUser as string);
    return (<div>
      <Timeliner
      options={PersonaltimelineOptions}
      items={defaultItem}
      groups={personalGroup}
      elmfunc={elmfunc}
      shiftfunc={shiftfunc}
    /></div>);
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
<Popper id={id} open={open} anchorEl={anchorEl} placement = {"bottom"} disablePortal={false} // ★HTMLの構造を<body>直下に脱出させる
  style={{ zIndex: 114514  }} >
  <Box sx={{ border: 1, p: 1 }}>
    <PersonList member = {memberList}/>
  </Box>
</Popper></div>);
}

function ShiftPop({setOthers} : {setOthers : object}){
  const anchorEl = useContext(SelectedElem);
  console.log(anchorEl);
  const sid = useContext(SelectedShift);
  console.log(sid);
  const open = Boolean(anchorEl);
  //@ts-ignore
  const name = ShiftNames[sid];
  const id = open ? 'popper' : undefined;
  return(<div>
<Popper id={id} open={open} anchorEl={anchorEl} style = {{width:"384px"}}>
  <Box sx={{ border: 1, p: 1 ,bgcolor: 'background.paper',zIndex: 9999}}>
     <p>{name}</p> 
     <p><a href = {`../src/pdfs/${name}.pdf`} target="_blank">シフト詳細を表示</a></p>
    <PersonList member = {ShiftMembers[sid]} setOthers = {setOthers}/>
  </Box>
</Popper></div>);
}

function PersonProp({p,setOthers}:{p:string,setOthers:object}){
  const [open, setOpen] = React.useState(false);
  const sid = useContext(SelectedShift);
  const name = ShiftNames[sid];
  const user = localStorage.getItem("user");
  return (<div>
    <p>{p}</p>
    <p>シフト回数:3</p>
  <p><Link onClick = {(e) => {
      setOthers([e.eventPhase.value]);
    }}>ほかのシフトを表示</Link></p>  
  <p><Link onClick = {() => {
    setOpen(true);}}>交代</Link>
  <Dialog
        open={open}
        onClose={() => {setOpen(false);}}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        role="alertdialog"
      >
        <DialogTitle id="alert-dialog-title">
          {"シフトの交代を申請しますか?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <p>{"交代シフト:" + name}</p>
            <p>{p + "=>" + user}</p>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {setOpen(false);}} autoFocus> いいえ</Button>
          <Button onClick={() => {setOpen(false);}}>はい</Button>
        </DialogActions>
      </Dialog></p></div>);
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

function Person({e,setOthers} : {e:string,setOthers:object} ){
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };
  const open = Boolean(anchorEl);
  const id = open ? "${anchorEl}Data" : undefined;
  return (<span><Button variant="outlined" onClick = {handleClick}
  >{e}</Button><Popper id={id} open={open} anchorEl={anchorEl} popperOptions = {{strategy : "fixed"}}>
    <Box sx = {{ border: 1, p: 1, bgcolor : "background.paper" , zIndex: 999999}}><PersonProp p = {e} setOthers = {setOthers}/></Box></Popper></span>);
}

function PersonList({member,setOthers} : {member:string[],setOthers:object}){
  return( member.map( (v) => 
    <Person e={v} setOthers = {setOthers}/>
  ));
}

function Timeliner({options,items,groups,elmfunc,shiftfunc} : {options:object,items:TimelineProps ,groups:object[],elmfunc:object,shiftfunc:object} ){
  const container = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!container.current) return;
    console.log(items);
    console.log(groups);
    let id;
    let timeline = new vis.Timeline(container.current, items, groups, options);
    timeline.on('select', (event) => {
      if (event.items) {
        const targetEvent = event.event.srcEvent;
        const targetElement = targetEvent.target.closest(".vis-item");
        if(targetElement){
        id = event.items[0];
        //@ts-ignore
        elmfunc(targetElement);
        //@ts-ignore
        shiftfunc(id);
        } else {
          //@ts-ignore
          elmfunc(null);
          //@ts-ignore
          shiftfunc("パラオナボーイ 作詞:拓也");
        }
    }});
    return () => {
      timeline.destroy();
    };
  }, [options, items, groups]);
  //@ts-ignore
  return <div style={{ position: 'relative' }}><div ref={container} /></div>;
}