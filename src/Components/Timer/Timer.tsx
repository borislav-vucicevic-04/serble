import React from 'react'
import "./Timer.css"

interface Props {
  time: number
}

export default function Timer(props: Props) {
  let minutes = Math.floor(props.time / 60).toString();
  let seconds = (props.time % 60).toString();
  let time: string = '';
  if(seconds.length === 1) seconds = '0' + seconds;
  if(minutes !== '0') time = `${minutes}:${seconds}`;
  else time = seconds;
  return (
    <div className='timer'><span>{time}</span></div>
  )
}
