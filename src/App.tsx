import React, { memo, useEffect , useState } from 'react';
import { Timeline } from 'vis-timeline/standalone';
import 'vis-timeline/styles/vis-timeline-graph2d.min.css';
import './App.css';

const list = ["homo","gaki"];



function PopUp({onClick}){
  return (<div className={"PopUp"}>
          <p>ここにポップアップの内容を記述します。</p>
          <button onClick={onClick}>閉じる</button>
        </div>);
}

function Person({e} : {e:string} , {onClick} : {onClick : void}){
  return (<button
  onClick = {onClick}
  >HOMOGAKI</button>);
}

function PersonList(){
  let elm;
  elm = list.map( v => 
    <div> <Person e="{v}" /> </div>
  );
  return elm;
}

function ShiftField(){
  return (<div><PersonList /></div>); 
}

export default function App(){
  const [isPopUp, setPopUp] = useState(false);
  const [user , setUser] = useState("");
  const togglePopUp = () => { setPopUp(!isPopUp); };
  return (<div><ShiftField /> {isPopUp && <PopUp/>}</div>
  );
}