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
import Modal from '@mui/material/Modal';
import Appnew_others from  './Appnew_others.tsx';
import MenuItem from '@mui/material/MenuItem';


const SelectedShift = React.createContext<string>("");
const SelectedElem = React.createContext<null | HTMLElement>(null);
const AllShift = React.createContext([]);
const AllMember = React.createContext([]);
const MemberShiftData = React.createContext([]);
const AllMemberShift = React.createContext([]);
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
            <Button variant = {"contained"} onClick = {() => {
              localStorage.setItem("user", "");
              window.location.reload();
              }}> ユーザーリセット </Button>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default function Appnew(){
  const [user, setUser] = useState("");
  const [gotallShift,setAllShifts] = useState(null);
  const [gotMember,setAllMember] = useState([] as object[]);
  const [gotGroup,setAllGroup] = useState([] as object[]);
  const [isLoading, setIsLoading] = useState(true);
  const [isNameLoaded, setIsNameLoaded] = useState(false);
  const [memberShifts , setMemberShifts] = useState({});
  const [visible , setVisible] = useState(false);
  let defaultUser = localStorage.getItem("user") ? localStorage.getItem("user") : "";
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
    });
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
  let val = defaultUser;
if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>データを読み込み中...</p>
      </Box>
    );
  } else if(!isNameLoaded){
    if(!defaultUser){
      while(!memberShifts[val as string]) { val = prompt("あなたの総務ネームを入力..");}
        defaultUser = val;
        localStorage.setItem("user", val as string);   
        setUser(val);
        setIsNameLoaded(true)
    } else {
      setIsNameLoaded(true)
    }
  }
  console.log(gotallShift);
  console.log(gotMember)
  const found = Boolean(memberShifts[val]);
  return (<div><MemberShiftData value = {memberShifts}><AllMember value = {gotMember}><AllShift value = {gotallShift}><Barr />
  <div style = {{height:"75px",display : "flex", justifyContent:"space-around",alignItems: "center"}} ><Button as = "a" 
  component="label"
  variant="contained"
  href = {"../src/database/Shift.pdf"}
  style = {{height:"50%"}}> Excel(全体シフト)を開く
  <a href = {"../src/database/Shift.pdf"}/></Button>
  <Button component="label"
  variant="contained"
  href = {"../src/database/Shift.pdf"}
  style = {{height:"50%"}}
  onClick = {() => setVisible(true)}> ほかの人のシフトを検索
  </Button>
  </div>
  <div className = {"container"}><DisplayShifts shifts = {memberShifts[val]}  members = {gotMember}/></div></AllShift></AllMember></MemberShiftData>
  <Modal
    open = {visible}
    onClose = {() => {
      setVisible(false);
    }}><Appnew_others user = {val}/></Modal>
  </div>
  );
}

const date = now => `${now.getMonth()+1}/${now.getDate().toString().padStart(2, '0')}`;

function DisplayShifts({shifts,members} : {shifts : string[],members : string[]}){
  const today = date(new Date());
  const [selecting,setChange] = useState("");
  const AllShiftData = useContext(AllShift);
  if(shifts) {
    const shiftData = shifts.map((v) => {
      return AllShiftData.get(v);
    })
    shiftData.sort((a, b) => a.start - b.start);
    const dayList = [];
    return shiftData.map(s => {
    const member = members[s.id];
    if(!dayList.includes(strDate(s.start))&& today > strDate(s.start)){
      dayList.push(strDate(s.start));
      return(
      <div><h2>{strDate(s.start)}</h2>
      <Box sx={{ border: 3, p: 1 ,bgcolor: 'background.paper' , display:"grid"}}>
       <p><b>{s.content}</b></p> 
     <p>{strDate(s.start) + " " + strTime(s.start) + " ~ " + strTime(s.end)}</p>
     <p>-ひとこと説明/注意-</p>
     <p><a href = {`../src/pdfs/${s.content}.pdf`} target="_blank">シフト詳細を表示</a></p>
     <div style = {{display : "flex", justifyContent: 'center', alignItems: 'center'}}><PersonList s = {s} key={s.id} onSelect={(id) => console.log(id)}  shiftPeople={member} s = {s} setChange = {setChange}  selecting = {selecting} /></div></Box></div>);
    } else if(today > strDate(s.start)){
    return(<Box sx={{ border: 3, p: 1 ,bgcolor: 'background.paper' , display:"grid"}}>
       <p><b>{s.content}</b></p> 
     <p>{strDate(s.start) + " " + strTime(s.start) + " ~ " + strTime(s.end)}</p>
      <p>-ひとこと説明/注意-</p>
     <p><a href = {`../src/pdfs/${s.content}.pdf`} target="_blank">シフト詳細を表示</a></p>
     <div style = {{display : "flex" ,justifyContent: 'center', alignItems: 'center'}}><PersonList s = {s} key={s.id} onSelect={(id) => console.log(id)}  shiftPeople={member} s = {s} setChange = {setChange}  selecting = {selecting} /></div></Box>);
  }}) } else {
    return (<div>総務ネームを入力してください</div>);
  }
}

function PersonList({s,member,shiftPeople,setOthers} : {s:ShiftItem,member:string[],shiftPeople:string[],setOthers:any}){
  return( shiftPeople.map( (v:string) => 
    <Person member = {member} v = {v} setOthers = {setOthers} s = {s}/>
));
}

function Person({member,v,setOthers,s}  : {member:string[],v:string,setOthers:any,s:ShiftItem}){
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };
  const open = Boolean(anchorEl);
  const id = open ? "${anchorEl}Data" : undefined;
  const user = localStorage.getItem("user");
  if(v != user) return (<span><Button variant="outlined" onClick = {handleClick} sx = {{textTransform: 'none'}}
  >{v}</Button><Popper id={id} open={open} anchorEl={anchorEl} popperOptions = {{strategy : "fixed"}}>
    <Box sx = {{ border: 1, p: 1, bgcolor : "background.paper" , zIndex: 999999}}>
    <PersonProp member = {member} p = {v}  s = {s}/></Box></Popper></span>);
  return  (<span><Button variant="outlined" onClick = {handleClick} sx = {{textTransform: 'none'}}
  >{v}</Button><Popper id={id} open={open} anchorEl={anchorEl} popperOptions = {{strategy : "fixed"}}>
    <Box sx = {{ border: 1, p: 1, bgcolor : "background.paper" , zIndex: 999999}}>
    <SelfProp member = {member} user = {v}   s = {s}/></Box></Popper></span>);  
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

function PersonProp({member,p,s}:{member:string[],p:string,s:ShiftItem}){
  const [open, setOpen] = React.useState(false);
  const user = localStorage.getItem("user") as string;
  const memberShift = useContext(MemberShiftData);
  const shiftAmo = memberShift[p].length;
  const name = s.content;
  return (<div>
    <p>{p}</p>
    <p>{"シフト回数:" + shiftAmo}</p>
  <Link onClick = {() => {
    setOpen(true);
}}>交代</Link>
  <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
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
            <p>{"時間:" + strDate(s.start) + " " + strTime(s.start) + " ~ " + strTime(s.end)}</p>
            <p>{p + "=>" + user}</p>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setOpen(false);
            }} autoFocus> いいえ</Button>
          <Button onClick={() => {
            setOpen(false);}
            }>はい</Button>
        </DialogActions>
      </Dialog></div>);
}

function SelfProp({member,user,s}:{member:string[],user:string,s:ShiftItem}){
  const sid = useContext(SelectedShift);
  const [open, setOpen] = React.useState(false);
  const memberShift = useContext(MemberShiftData);
  const shiftAmo = memberShift[user].length;
  const name = s.content;
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
            <p>{"時間:" + strDate(s.start) + " " + strTime(s.start) + " ~ " + strTime(s.end)}</p>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setOpen(false);
            }} autoFocus> いいえ</Button>
          <Button onClick={() => {
            requestChange(user,sid);
          }
            }>はい</Button>
        </DialogActions>
      </Dialog></div>);
}

async function requestChange(user,shift){
    try {
    const response = await fetch('http://localhost:5000/api/shifts/request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({id:(user+shift) ,user:user,shift:shift}), // JSON文字列にシリアライズして送信
    });
    if (response.ok) {
      console.log("サーバー側のデータ更新に成功しました。");
      // 必要に応じて、ここで画面（allShiftsステートなど）を再読み込みする処理を入れます
    }
  } catch (error) {
    console.error("データ更新通信に失敗:", error);
  }
}