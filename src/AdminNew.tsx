import React, { useContext , useEffect , useState ,useRef, useMemo } from 'react';
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
import Checkbox from '@mui/material/Checkbox';
import * as FileSaver from 'fs';
import e from 'cors';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

const AllShift = React.createContext({});

interface ShiftItem {
  id: number | string;
  start: Date;
  end: Date;
  content: string;
  type: string;
  group: number;
}

interface ShiftData {
  shift: ShiftItem,
  member : string[],
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

export default function AdminNew(){
  const [gotshiftData,setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [gotMember, setMember] = useState("");
  const [selecting,setSelecting] = useState("");
  const [searching,setseaching] = useState("");
  const [displayShift,setDisplayShift] = useState(null);
  const [displayDupe , setDisplayDupe] = useState(false);
  const [dupeIds , setDupeIds] = useState({});
  useEffect(() => {
    fetch('http://localhost:5000/api/shifts/all')
      .then(res => res.json())
      .then(data => {
      const Dataset = new vis.DataSet<ShiftItem>();
      data.rows.forEach((item: ShiftItem) => {
        Dataset.add({
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
		const dupe = duplexCheck(Dataset);
    console.log(dupe);
    console.log(memberData);
		const alldupeData = {};
    Object.entries(dupe).forEach(([k,v]) => {
        const setk = new Set(memberData[k].map(member => member));
        const machilist = new Set();
      v.forEach(s => {
        const machi = memberData[s].filter(item => setk.has(item));
        if(machi.length) machi.forEach(val => machilist.add(val));
      })
    alldupeData[k] = Array.from(machilist);
    })
    setDisplayDupe(alldupeData);
    setData(Dataset);
    setMember(memberData);
    setIsLoading(false);
    });
  }, []);
const allShift = useMemo(() => {
    if (!gotshiftData) return [];
    return gotshiftData.get().map((v: any) => v.id);
  }, [gotshiftData]);
const forDisplay = useMemo(() => {
  if(!displayDupe){
  const display = gotMember[searching];
  return display ? display : allShift;
  } else {
    const displayShift = new vis.DataSet<ShiftItem>;
    Object.entries(displayDupe).forEach(([k,v]) => {
      if(v.length) displayShift.add(gotshiftData.get(k));
    });
    return displayShift;
  }
  }, [gotMember, searching, allShift,displayDupe]);
if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>データを読み込み中...</p>
      </Box>
    );
  }

  const found = true;
  return (<div><Barr />
  <AllShift value = {gotshiftData}>
  <div style = {{height:"75px", display: 'flex', justifyContent: 'center', alignItems: 'center'}}><Button 
  component="label"
  variant="contained"
  sx = {{margin : "8px"}}> Excelインポート
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
  <Button 
  component="label"
  variant="contained"
  sx = {{margin : "8px"}}> Excelインポート(from 全体シフト)
  <VisuallyHiddenInput
    type="file"
    accept = ".xlsx"
    //@ts-ignore
    onChange={(file) => importXLSX(file.target.files[0],(data) => {
      const sendData = importFullData(data);
      console.log(sendData);
      registerAllDB(sendData);
    })}
    multiple
  /></Button>
  <TextField id="outlined-basic" label="総務ネーム" variant="outlined" 
      error={!found} helperText = {found ? "　" : "該当なし"} 
      onChange={(e) => {     
        console.log(e)
        setseaching(e.target.value);
      }} />
<Button 
  as = "a"
  component="label"
  variant="contained"
  sx = {{margin : "8px"}}
  href = ""> <a href = {"../src/database/Shift.xlsx"} download={"Shift.xlsx"}>Excelダウンロード </a> </Button>
        <Checkbox onChange = {() => setDisplayDupe(!displayDupe)}/><label>かぶりのみ表示</label>
  </div>
  <div className = {"container"}><DisplayShifts shifts = {forDisplay} members = {gotMember}/></div></AllShift>
  </div>
  );
}

function duplexCheck(shift){
  let ans = {};
  for(let k1 of shift.getIds()){
    const st = shift.get(k1).start; 
    const ed = shift.get(k1).end; 
    const k1ans = [];
    for(let k2 of shift.getIds()){
      if(st < shift.get(k2).end && ed > shift.get(k2).start && k1 != k2)
        k1ans.push(k2);
  }
  ans[k1] = k1ans;
}
  return ans;
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

function DisplayShifts({shifts,members} : {shifts : object[],members : string[]}){
  const today = date(new Date());
  const [selecting,setChange] = useState("");
  const AllShiftData = useContext(AllShift);
  if(shifts) {
    const shiftData = shifts.map((v) => {
      return AllShiftData.get(v);
    })
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
     <div style = {{display : "flex",justifyContent: 'center', alignItems: 'center'}}><PersonList s = {s} key={s.id} onSelect={(id) => console.log(id)}  shiftPeople={member} s = {s} setChange = {setChange}  selecting = {selecting} /></div></Box></div>);
    } else if(today > strDate(s.start)){
    return(<Box sx={{ border: 3, p: 1 ,bgcolor: 'background.paper' , display:"grid"}}>
       <p><b>{s.content}</b></p> 
     <p>{strDate(s.start) + " " + strTime(s.start) + " ~ " + strTime(s.end)}</p>
      <p>-ひとこと説明/注意-</p>
     <p><a href = {`../src/pdfs/${s.content}.pdf`} target="_blank">シフト詳細を表示</a></p>
     <div style = {{display : "flex",justifyContent: 'center', alignItems: 'center'}}><PersonList s = {s} key={s.id} onSelect={(id) => console.log(id)}  shiftPeople={member} s = {s} setChange = {setChange}  selecting = {selecting} /></div></Box>);
  }}) } else {
    return (<div>総務ネームを入力してください</div>);
  }
}

const date = now => `${now.getMonth()+1}/${now.getDate().toString().padStart(2, '0')}`;

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
    <PersonProp member = {member} p = {v} setOthers = {setOthers} s = {s}/></Box></Popper></span>);
  return  (<span><Button variant="outlined" onClick = {handleClick} sx = {{textTransform: 'none'}}
  >{v}</Button><Popper id={id} open={open} anchorEl={anchorEl} popperOptions = {{strategy : "fixed"}}>
    <Box sx = {{ border: 1, p: 1, bgcolor : "background.paper" , zIndex: 999999}}>
    <SelfProp member = {member} user = {v}  setOthers = {setOthers} s = {s}/></Box></Popper></span>);  
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

function PersonProp({member,p,setOthers,s}:{member:string[],p:string,setOthers:any,s:ShiftItem}){
  const [open, setOpen] = React.useState(false);
  const user = localStorage.getItem("user") as string;
  const memberShift = useContext(MemberShiftData);
  const shiftAmo = memberShift[p].length;
  const name = s.content;
  return (<div>
    <p>{p}</p>
    <p>{"シフト回数:" + shiftAmo}</p>
  <p><Link onClick = {() => {
    console.log(p)
      if(!member.includes(p) && user != p){
        setOthers([...member,p]);
      }
    }}>ほかのシフトを表示</Link></p>  
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
          {"シフトを交代しますか?"}
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
            setOpen(false);
            changeMember(old)
          }
            }>はい</Button>
        </DialogActions>
      </Dialog></div>);
}

function SelfProp({member,user,setOthers,closefunc}:{member:string[],user:string,setOthers:any,closefunc:any}){
  const [open, setOpen] = React.useState(false);
  const sid = useContext(SelectedShift);
  const shiftMemberobj = useContext(AllMember);
  const shifts = useContext(AllShift);
  const useritem = searchUsersShift(user as string,shifts,shiftMemberobj);
  const shiftAmo = useritem.length;
  const selectedItemInfo = shifts.get({
  filter: function (item) {
    return item.id == sid;
  }
  });
  const iteminfo = selectedItemInfo[0];
  const name = iteminfo.content;
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

function importFullData(data : string[][]){
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

async function changeMember(targetShift,member,oldmember){
  try {
    const response = await fetch('http://localhost:5000/api/shifts/updateMember', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({id:targetShift.id,member:member,oldmember:oldmember,target:targetShift.cell})
    });
    if (response.ok) {
      console.log("サーバー側のデータ更新に成功しました。");
      // 必要に応じて、ここで画面（allShiftsステートなど）を再読み込みする処理を入れます
    }
  } catch (error) {
    console.error("データ更新通信に失敗:", error);
  }
}