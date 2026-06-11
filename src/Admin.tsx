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

export default function Admin(){
  return (<div><Barr />
  <Button onClick = {() => {registerDB()}}>データベース</Button>
  <Button 
  variant="contained"
  onClick = {() => {registerDB()}}>Excelインポート
  <VisuallyHiddenInput
    type="file"
    onChange={(event) => console.log(event.target.files)}
    multiple
  /></Button>
  </div>
  );
}

async function registerDB() {
  console.warn("南佳也には全く似ていません!");
  const updatedData = [{
    id: "simokita1", // 変更したいアイテムのID
    start: "2026-08-10 13:00:00",
    end: "2026-08-10 17:00:00",
    content: "下北沢シフト",
    group_id: 1
  }
  ,{
    id: "simokita2", // 変更したいアイテムのID
    start: "2026-08-10 17:00:00",
    end: "2026-08-10 19:00:00",
    content: "下北沢シフト",
    group_id: 1
  }
  ,{
    id: "oudou1", // 変更したいアイテムのID
    start: "2026-08-10 8:10:00",
    end: "2026-08-10 10:10:00",
    content: "王道銀行シフト",
    group_id: 2
  },
  {
    id: "homo1", // 変更したいアイテムのID
    start: "2026-08-10 8:10:00",
    end: "2026-08-10 10:10:00",
    content: "ホモビシフト",
    group_id: 3
  }];
  const groupData = [
  {id:1, content:"下北沢"},
  {id:2, content:"王道銀行"},
  {id:3, content:"COAT"}]
  const memberData = [
  {id:"simokita2", name:"YJ"},
  {id:"oudou1", name:"114514"},
  {id:"simokita1", name: "YJ" },
  {id:"simokita1", name : "Homo"},
  {id:"homo1",name:"homo"}];
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

function importExcel(fileBinary : FileReader){
  const workbook = XLSX.read(fileBinary, { type: 'binary' });
}