import React from 'react'
import "./Timer.css"

interface Props {
  time: number
}

export default function Timer(props: Props) {
  return (
    <div className='timer'><span>{props.time}</span></div>
  )
}
