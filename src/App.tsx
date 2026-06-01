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

const PersonaltimelineOptions_S = {
  width: "100vw",
  stack: true, 
  showMajorLabels: true,
  showCurrentTime: true, 
  zoomMax: 172800000,
  zoomMin: 14400000, 
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

const PersonaltimelineOptions_L = {
  width: "100vw",
  stack: true, 
  showMajorLabels: true,
  showCurrentTime: true, 
  zoomMax: 172800000,
  zoomMin: 14400000, 
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

const timelineOptions_S = {
  width: "100vw",
  stack: true, 
  showMajorLabels: true,
  showCurrentTime: true, 
  zoomMax: 172800000,
  zoomMin: 14400000, 
  type: "range", 
  maxHeight: '120vh', 
  minHeight: '10vh',
  autoResize: true ,
  hiddenDates : {start: '2014-03-21 20:00:00', end: '2014-03-22 6:00:00', repeat:'daily'},
  format: {
    minorLabels: {
      minute: 'h:mma',
      hour: 'ha'
    }
  }                                                                                                                                                                                                                                                                                                                                                                                                                                       
}

const timelineOptions_L = {
  width: "100vw",
  stack: true, 
  showMajorLabels: true,
  showCurrentTime: true, 
  zoomMax: 172800000,
  zoomMin: 14400000, 
  type: "range", 
  maxHeight: '120vh', 
  minHeight: '10vh',
  autoResize: true ,
  hiddenDates : {start: '2014-03-21 20:00:00', end: '2014-03-22 6:00:00', repeat:'daily'},
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

let ShiftInfo = {
  "range-type-class" : {name : "シフト1",member : ["ナナフシ","薄型テレビ","シャンシャン","タンバ","西田ゲリオン","タンバリン","帰れ","帰ります"]},
  "range-type-class2" : {name : "シフト2",member : ["ナナフシ"]},
  "range-type-class3" : {name : "シフト3",member : ["つまようじ"]}  
}

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

export default function App(){
  const defaultUser = localStorage.getItem("user");
  const [selectedElement, setElement] = useState(null);
  const [selectedShift, setSelectedShift] = useState("");
  const [user, setUser] = useState(defaultUser as string);
  const [otherMember, setOtherMember] = useState([] as string[]);
  return (<div><SelectedShift.Provider value = {selectedShift}><SelectedElem.Provider value = {selectedElement}><Barr/>
    <h2>個人シフト</h2>  <PersonalSpace user = {user} userChange = {setUser} elmfunc={setElement}
      shiftfunc={setSelectedShift}/>
      <Other member={otherMember} elmfunc={setElement} shiftfunc={setSelectedShift} />
    <h2>全体シフト</h2>
    <Timeliner
      options={timelineOptions_S} items={Shiftitems} groups={groups} 
      elmfunc={setElement}
      shiftfunc={setSelectedShift}
    /><ShiftPop member = {otherMember} setOthers = {setOtherMember}/></SelectedElem.Provider></SelectedShift.Provider></div>
  );
}

function Other({member,elmfunc,shiftfunc} : {member:string[],elmfunc:any,shiftfunc:any}){
  console.log(member);
  return( member.map((s) => {
      return(<Otherrow s = {s} elmfunc = {elmfunc} shiftfunc = {shiftfunc} />);
    }));
}

function Otherrow({s,elmfunc,shiftfunc} : {s:string,elmfunc:any,shiftfunc:any}){
    const [useritem] = useState(() => searchUsersShift(s));
    const pgroup = React.useMemo(() => [{ id: 1, content: s }], [s]);
    return(<div>
      <Timeliner
      options={PersonaltimelineOptions_S}
      items={useritem}
      groups={pgroup}
      elmfunc={elmfunc}
      shiftfunc={shiftfunc}
    /></div>);
}

function PersonalSpace({user,userChange,elmfunc,shiftfunc} : {user:string,userChange:any,elmfunc:any,shiftfunc:any}){
    let defaultUser = localStorage.getItem("user");
    useEffect(() => {
      if(!defaultUser){
        const u = prompt("あなたの総務ネームを入力..");
        defaultUser = u;
        setUserItem(searchUsersShift(u as string));
        localStorage.setItem("user", u as string);   
        userChange(defaultUser);
      }
    }, []);
    const defaultItem = searchUsersShift(defaultUser as string);
    const [useritem, setUserItem] = useState(defaultItem);
    const found = Boolean(useritem.length);
    console.log(useritem);
    return (<div><TextField id="outlined-basic" label="総務ネーム" variant="outlined" 
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
      options={PersonaltimelineOptions_S}
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
          //@ts-ignore
        if(ShiftMembers[s.id].includes(user)) {
          let r = s;
          r.group = 1;
          ans.add(r);
  } }});
  return ans;
}

function ShiftPop({member,setOthers} : {member : string [],setOthers : any}){
  const anchorEl = useContext(SelectedElem);
  console.log(anchorEl);
  const sid = useContext(SelectedShift);
  console.log(sid);
  const open = Boolean(anchorEl);
  //@ts-ignore
  const name = ShiftNames[sid];
  const id = open ? 'popper' : undefined;
  //@ts-ignore
  const shiftPeople = ShiftMembers[sid];
  let selectedItemInfo = Shiftitems.get({
  filter: function (item) {
    return item.id == sid;
  }
  });
  if(!selectedItemInfo[0]){
      selectedItemInfo = Shiftitems.get({
    filter: function (item) {
      return item.id == "range-type-class";
      }
    });
  }
  const info = selectedItemInfo[0];
  return(<div>
<Popper id={id} open={open} anchorEl={anchorEl} style = {{width:"384px"}}>
  <Box sx={{ border: 1, p: 1 ,bgcolor: 'background.paper',zIndex: 9999}}>
     <p>{name}</p> 
     <p>{strDate(info.start) + " " + strTime(info.start) + " ~ " + strTime(info.end)}</p>
     <p><a href = {`../src/pdfs/${name}.pdf`} target="_blank">シフト詳細を表示</a></p>
    <PersonList member = {member} shiftPeople = {shiftPeople} setOthers = {setOthers}/>
  </Box>
</Popper></div>);
}

function PersonList({member,shiftPeople,setOthers} : {member:string[],shiftPeople:string[],setOthers:any}){
  return( shiftPeople.map( (v:string) => 
    <Person member = {member} v = {v} setOthers = {setOthers}/>
));
}

function Person({member,v,setOthers}  : {member:string[],v:string,setOthers:any}){
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };
  const open = Boolean(anchorEl);
  const id = open ? "${anchorEl}Data" : undefined;
  const user = localStorage.getItem("user");
  if(v != user) return (<span><Button variant="outlined" onClick = {handleClick}
  >{v}</Button><Popper id={id} open={open} anchorEl={anchorEl} popperOptions = {{strategy : "fixed"}}>
    <Box sx = {{ border: 1, p: 1, bgcolor : "background.paper" , zIndex: 999999}}>
    <PersonProp member = {member} p = {v} setOthers = {setOthers} closefunc = {setAnchorEl}/></Box></Popper></span>);
  return  (<span><Button variant="outlined" onClick = {handleClick}
  >{v}</Button><Popper id={id} open={open} anchorEl={anchorEl} popperOptions = {{strategy : "fixed"}}>
    <Box sx = {{ border: 1, p: 1, bgcolor : "background.paper" , zIndex: 999999}}>
    <SelfProp member = {member} user = {v}  setOthers = {setOthers} closefunc = {setAnchorEl}/></Box></Popper></span>);  
}

const strDate =(date : Date) =>{
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return (mm + "/" + dd);
}

const strTime =(date : Date) =>{
  const hh = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  return (hh + ":" + min);
}

function PersonProp({member,p,setOthers,closefunc}:{member:string[],p:string,setOthers:any,closefunc:any}){
  const [open, setOpen] = React.useState(false);
  const sid = useContext(SelectedShift);
  //@ts-ignore
  const name = ShiftNames[sid];
  const user = localStorage.getItem("user");
  const useritem = searchUsersShift(p as string);
  const shiftAmo = useritem.length;
  const selectedItemInfo = Shiftitems.get({
  filter: function (item) {
    return item.id == sid;
  }
  });
  const iteminfo = selectedItemInfo[0];
  return (<div>
    <p>{p}</p>
    <p>{"シフト回数:" + shiftAmo}</p>
  <p><Link onClick = {() => {
      const u = p;
      console.log(u);
      if(!member.includes(u) && user != u){
        setOthers([...member,u]);
        closefunc(null);
      }
    }}>ほかのシフトを表示</Link></p>  
  <Link onClick = {() => {
    setOpen(true);
}}>交代</Link>
  <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
          closefunc(null);
          }}
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
            <p>{"時間:" + strDate(iteminfo.start) + " " + strTime(iteminfo.start) + " ~ " + strTime(iteminfo.end)}</p>
            <p>{p + "=>" + user}</p>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setOpen(false);
            closefunc(null);
            }} autoFocus> いいえ</Button>
          <Button onClick={() => {
            setOpen(false);}
            }>はい</Button>
        </DialogActions>
      </Dialog></div>);
}

function SelfProp({member,user,setOthers,closefunc}:{member:string[],user:string,setOthers:any,closefunc:any}){
  const [open, setOpen] = React.useState(false);
  const sid = useContext(SelectedShift);
  //@ts-ignore
  const name = ShiftNames[sid];
  const useritem = searchUsersShift(user as string);
  const shiftAmo = useritem.length;
  const selectedItemInfo = Shiftitems.get({
  filter: function (item) {
    return item.id == sid;
  }
  });
  const iteminfo = selectedItemInfo[0];
  return (<div>
    <p>{user + "(あなた)"}</p>
    <p>{"シフト回数:" + shiftAmo} </p>  
  <Link onClick = {() => {
    setOpen(true);
}}>このシフトの交代を募集</Link>
  <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
          closefunc(null);
          }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        role="alertdialog"
      >
        <DialogTitle id="alert-dialog-title">
          {"交代用Lineで、シフトの交代を要請しますか?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <p>{"交代シフト:" + name}</p>
            <p>{"時間:" + strDate(iteminfo.start) + " " + strTime(iteminfo.start) + " ~ " + strTime(iteminfo.end)}</p>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setOpen(false);
            closefunc(null);
            }} autoFocus> いいえ</Button>
          <Button onClick={() => {
            setOpen(false);}
            }>はい</Button>
        </DialogActions>
      </Dialog></div>);
}

function Timeliner({options,items,groups,elmfunc,shiftfunc} : {options:object,items:TimelineProps ,groups:object[],elmfunc:any,shiftfunc:any} ){
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
        elmfunc(targetElement);
        shiftfunc(id);
        } else {
          elmfunc(null);
          shiftfunc("パラオナボーイ 作詞:拓也");
        }
    }});
    return () => {
      timeline.destroy();
    };
  }, [options, items, groups]);
  return <div style={{ position: 'relative' }}><Button>表示切替</Button><div ref={container} /></div>;
}