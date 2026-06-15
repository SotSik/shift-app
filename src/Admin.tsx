import React, { useContext , useEffect , useState ,useRef } from 'react';
import vis from 'vis';
import Box from '@mui/material/Box';
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import * as XLSX from 'xlsx';
import { styled } from '@mui/material/styles';
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
import e from 'cors';
import Select from '@mui/material/Select';

import MenuItem from '@mui/material/MenuItem';

const SelectedShift = React.createContext<string>("");
const SelectedElem = React.createContext<null | HTMLElement>(null);
const AllShift = React.createContext([]);
const AllMember = React.createContext([]);
const MemberShiftData = React.createContext([]);
const AllWarn = React.createContext([]);
const AllGroup = React.createContext([]);
const personalGroup = [{ id: 1, content: "個人シフト" }];

interface ShiftContent{
  id: string
  start: string,
  end: string,
  member:string[]
}

interface ShiftItem {
  id: number | string;
  start: Date;
  end: Date;
  content: string;
  type: string;
  group: number;
}

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

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

function duplexCheck(s,Membershift,shift){
  let ans = [];
  const st = shift.get(s).start;
  const ed = shift.get(s).end;
  const id = s;
  Membershift.forEach((v) => {
    if(v != id){
      const vid = v;
      if((shift.get(vid).end > st && st > shift.get(vid).start) || (shift.get(vid).end > ed && ed > shift.get(vid).start)){
        ans.push(vid);
      }
    }
  });
  if(ans.length) ans.push(s);
  return ans;
}

export default function Admin(){
  const [selectedElement, setElement] = useState(null);
  const [selectedShift, setSelectedShift] = useState("");
  const [otherMember, setOtherMember] = useState([] as string[]);
  const [gotallShift,setAllShifts] = useState(null);
  const [gotMember,setAllMember] = useState([] as object[]);
  const [gotGroup,setAllGroup] = useState([] as object[]);
  const [isLoading, setIsLoading] = useState(true);
  const [memberShifts , setMemberShifts] = useState({});
  const [allerwarn , setAllWarn] = useState({});
  const warn = {};
  const allTheShift = useContext(AllShift);
  useEffect(() => {
  fetch('http://localhost:5000/api/shifts/all')
    .then(res => res.json())
    .then(data => {
    const dataSet = new vis.DataSet<ShiftItem>();
      data.rows.forEach((item: object) => {
        dataSet.add({
          id: item.id,
          content: item.content,
          start: new Date(item.start), 
          end: new Date(item.end),
          type:"range", 
          group: item.group_id
        });
      });
    const memberData = {};
    const personShiftData = {};
    let unique = new Set();
    data.members.forEach((member : object) => {
      unique.add(member.name);
      const memarray = memberData[member.id] ? memberData[member.id] : [];
      memarray.push(member.name);
      memberData[member.id] = memarray;
      const ps = personShiftData[member.name] ? personShiftData[member.name] : [];
      ps.push(member.id);
      personShiftData[member.name] = ps;
    })
    console.log(unique)
    unique.forEach((m) => {
      warn[m] = [];
      personShiftData[m].forEach((s) => {
        const dup =  duplexCheck(s,personShiftData[m],dataSet);
        if(dup.length)console.log(dup)
        dup.forEach((d) => warn[m].push(d));
      });
    });
    console.log(warn);
    setAllWarn(warn);
    console.log(dataSet);
    setMemberShifts(personShiftData);
    setAllShifts(dataSet); 
    setAllMember(memberData);
    setAllGroup(data.group);
    console.log(personShiftData);
    console.log(data.group);
    setIsLoading(false);
    });
  }, []);
if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>データを読み込み中...</p>
      </Box>
    );
  }
  console.log(gotallShift);
  console.log(gotMember)
  return (<div><AllWarn value = {allerwarn}><MemberShiftData value = {memberShifts}><AllMember value = {gotMember}><AllShift value = {gotallShift}><Barr />
  <Button 
  component="label"
  variant="contained"> Excelインポート
  <VisuallyHiddenInput
    type="file"
    accept = ".xlsx"
    //@ts-ignore
    onChange={(file) => importXLSX(file.target.files[0],(data) => {
      const sendData = importData(data);
      console.log(sendData);
      registerDB(sendData);
    })}
    multiple
  /></Button>
  <DisplayShifts shifts = {gotallShift}  members = {gotMember}/></AllShift></AllMember></MemberShiftData></AllWarn>
  </div>
  );
}

async function registerDB([groupData,updatedData,memberData]) {
  console.warn("南佳也には全く似ていません!");
  console.log(updatedData);
  console.log(groupData);
  console.log(memberData);
  try {
    const response = await fetch('http://localhost:5000/api/shifts/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({shift:updatedData,group:groupData}), // JSON文字列にシリアライズして送信
    });
    if (response.ok) {
      console.log("サーバー側のデータ更新に成功しました。");
      // 必要に応じて、ここで画面（allShiftsステートなど）を再読み込みする処理を入れます
    }
  } catch (error) {
    console.error("データ更新通信に失敗:", error);
  }
  try {
    const response = await fetch('http://localhost:5000/api/shifts/registerMember', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(memberData), // JSON文字列にシリアライズして送信
    });
    if (response.ok) {
      console.log("サーバー側のデータ更新に成功しました。");
      // 必要に応じて、ここで画面（allShiftsステートなど）を再読み込みする処理を入れます
    }
  } catch (error) {
    console.error("データ更新通信に失敗:", error);
  }
}


function importXLSX(file: File, callback?: (data: any[]) => void){
    const reader = new FileReader();
    reader.onload = (e) => {
      const wb = XLSX.read(e.target?.result, { type: 'array' });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(ws, { header: 1 ,raw: false});
      callback?.(rows);
    };
    reader.readAsArrayBuffer(file);
}

function importData(data : string[][]){
  console.log(data);
  let rawShiftData : string[][][] = [];
  let current: string[][] = [];
  data.forEach((v: string[]) => {
    if(v.length){
      current.push(v);
    } else {
      if(current.length) rawShiftData.push(current);
      current = [];
    }
  });
  if(current.length){
    rawShiftData.push(current);
  }
  console.log(rawShiftData);
  let shiftInfo : object[] = [];
  let sizes : object = {};
  rawShiftData.forEach((rawShift) => {
    const shift = { id : rawShift[0][3], shiftName : rawShift[2][1],autherShiftName: rawShift[0][0] , auther:rawShift[0][1] ,place: rawShift[2][0] ,content: [] as ShiftContent[]};
    const day : string = rawShift[0][2];
    rawShift.shift();
    rawShift.shift();
    sizes[shift.id] = sizes[shift.id] ? sizes[shift.id] : 0;
    const size = sizes[shift.id];
    rawShift.forEach((s,n) => {
      let ended = false;
      const members = s.map((m,i) => {
        if(3 < i && !ended) {
          if(m) return m;
          else ended = true;
        }
      });
      for(let i = 0;i < 4;i++){
        members.shift();
      }
      shift.content.push({id : shift.id + (n + size),start: day + " " + s[2] + ":59",end: day + " " + s[3] + ":00",member : members as string[]});
      sizes[shift.id] = sizes[shift.id] + 1;
    })
    shiftInfo.push(shift);
  });
  const sendGroup = [];
  const sendItem = [];
  const sendMembers = [];
  shiftInfo.forEach((shift) => {
    sendGroup.push({id : shift.id , content : shift.place, autherShiftName : shift.autherShiftName});
    shift.content.forEach((v) => {
      sendItem.push({id : v.id, start : v.start, end : v.end, content : shift.shiftName, group_id : shift.id});
      v.member.forEach((m) => {
        sendMembers.push({id : v.id,name : m});
      })
    })
  });
  console.log(sendGroup)
  console.log(sendItem)
  console.log(sendMembers)
  return([sendGroup,sendItem,sendMembers]);
}

function DisplayShifts({shifts,members} : {shifts : object[],members : string[]}){
  const [selecting,setChange] = useState("");
  return shifts.get().map(s => {
    const member = members[s.id];
    return(<Box sx={{ border: 3, p: 1 ,bgcolor: 'background.paper',zIndex: 9999, position:"flex"}}>
       <p>{s.content}</p> 
     <p>{strDate(s.start) + " " + strTime(s.start) + " ~ " + strTime(s.end)}</p>
     <p><a href = {`../src/pdfs/${s.content}.pdf`} target="_blank">シフト詳細を表示</a></p>
     <PersonList key={s.id} shiftPeople={member} s = {s} setChange = {setChange}  selecting = {selecting} /></Box>);
  })
}

function changeShift(obj,selected){
  
}

function PersonList({shiftPeople,s,setChange,selecting} : {shiftPeople:string[],s : object,setChange:any,selecting:string}){
  return( shiftPeople.map( (v:string) => {
    return <Person  v = {v} s = {s} setChange = {setChange} selecting = {selecting}/>
    }
));
}

function Person({v,s,setChange,selecting}  : {v:string,s:object,setChange:object,selecting:string}){
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };
  const warn = useContext(AllWarn);
  let stat = "primary" ;
  if(warn[v]) {
    if(warn[v].includes(s.id)) stat = "error";
  }
  const open = Boolean(anchorEl);
  const id = open ? "${anchorEl}Data" : undefined;
  return (<span><Button variant="outlined" onClick = {handleClick} color = {stat}
  >{v}</Button><Popper id={id} open={open} anchorEl={anchorEl} popperOptions = {{strategy : "fixed"}}>
    <Box sx = {{ border: 1, p: 1, bgcolor : "background.paper" , zIndex: 999999}}>
    <PersonProp p = {v} s = {s} setChange = {setChange} selecting = {selecting}/></Box></Popper></span>);
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

function PersonProp({p,s,setChange,selecting}:{p:string,s:object,setChange:any,selecting:string}){
  const [open, setOpen] = React.useState(false);
  console.log(selecting)
    const useritem = searchUsersShift(p as string);
  const shiftAmo = useritem.length;
  const iteminfo = s;
  const name = iteminfo.content;
  if (!selecting) {return (<div>
    <p>{p}</p>
    <p>{"シフト回数:" + shiftAmo}</p>
  <Link onClick = {() => {
    setOpen(true);
}}>交代</Link>
<Dialog open = {open}><Box>
  <p> 入れ替えます</p>
    <Select
    labelId="demo-simple-select-label"
    id="demo-simple-select"
    label="Age"
    onChange={() => console.log("HOMO")}>
    <MenuItem value={1}>Ten</MenuItem>
    <MenuItem value={2}>Twenty</MenuItem>
    <MenuItem value={3}>Thirty</MenuItem>
  </Select>
    <DialogActions><Button onClick={() => {
    setOpen(false);
    setChange(s)}}>はい</Button><Button onClick={() => {
    setOpen(false);}}>いいえ</Button>
    </DialogActions>
  </Box></Dialog>
</div>);} else {
  changeShift(selecting,s);
  setChange("");
}
}

function searchUsersShift(user : string){
  let ans = new vis.DataSet<ShiftItem>();
  console.log(user);
  const shifts = useContext(AllShift);
  const shiftMembers = useContext(AllMember);
  shifts.forEach((s) => {
        if(s.id){
          //@ts-ignore
        if(shiftMembers[s.id].includes(user)) {
          let r = s;
          r.group = 1;
          ans.add(r);
  } }});
  return ans;
}