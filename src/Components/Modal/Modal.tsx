import React from 'react'
import './Modal.css'

interface Props {
  children?: React.ReactNode
}

export default function Modal(props: Props) {
  return (
    <div className='modal'>
      <div className="modal-body">
        {props.children}
      </div>
    </div>
  )
}
