import React, { Component } from 'react'
import './Navbar.css'
import HelpImage from '../../icons/help.svg'
interface Props {
  openHelpModal: () => void,
  gamemodePicker: (a: number) => void,
  gamemode: number
}

export default class Navbar extends Component<Props, {}> {
  constructor(props: Props) {
    super(props)
    this.selectChange = this.selectChange.bind(this)
  }
  selectChange(event: React.ChangeEvent) {
    var select = event.target as HTMLSelectElement;
    this.props.gamemodePicker(Number(select.value))
  }
  render() {
    return (
      <div className='navbar'>
        <select name="gamemode" id="gamemode" onChange={this.selectChange} value={this.props.gamemode.toString()}>
          <option value={5}>{'Lako'}</option>
          <option value={6}>{'Srednje'}</option>
          <option value={7}>{'Teško'}</option>
        </select>
        <img src={HelpImage} alt="help button" onClick={this.props.openHelpModal}/>
      </div>
    )
  }
}
