import React, { Component } from 'react'
import './App.css'
// components
import Timer from './Components/Timer/Timer'
import Navbar from './Components/Navbar/Navbar'
import Table from './Components/Table/Table'
import Modal from './Components/Modal/Modal'

interface State {
  gamemode: number,
  wantedWord: string,
  showTable: boolean,
  showVictoryDialog: boolean,
  showDefeatDialog: boolean,
  showHelpDialog: boolean,
  gmSelectorValue: number,
  time: number,
  timerID?: NodeJS.Timer
}

export default class App extends Component<{}, State> {
  constructor(props: {}) {
    super(props)
    this.gamemodePicker = this.gamemodePicker.bind(this);
    this.generateWord = this.generateWord.bind(this);
    this.resetTable = this.resetTable.bind(this);
    this.gmSelectorChange = this.gmSelectorChange.bind(this);
    this.btnStartClick = this.btnStartClick.bind(this);
    this.victory = this.victory.bind(this);
    this.defeat = this.defeat.bind(this);
    this.startTimer = this.startTimer.bind(this);
    this.timerTick = this.timerTick.bind(this);
    this.stopTimer = this.stopTimer.bind(this);
    this.openHelpModal = this.openHelpModal.bind(this)
    this.state = {
      gamemode: 5,
      wantedWord: '',
      showTable: true,
      showVictoryDialog: false,
      showDefeatDialog: false,
      showHelpDialog: true,
      gmSelectorValue: 5,
      time: 60,
    }
  }
  // event handlers
  gmSelectorChange(event: React.ChangeEvent) {
    let select = event.target as HTMLSelectElement;
    this.setState({
      gmSelectorValue: Number(select.value)
    })
  }
  btnStartClick() {
    this.setState({
      gamemode: this.state.gmSelectorValue,
      showVictoryDialog: false,
      showDefeatDialog: false,
    }, () => {this.generateWord(); this.startTimer()})
  } 
  // other methods
  startTimer() {
    this.setState({
      showHelpDialog: false,
      timerID: setInterval(this.timerTick, 1000)
    })
  }
  timerTick() {
    if(this.state.time === 0) {
      this.defeat();
      return;
    }
    this.setState({
      time: this.state.time - 1
    })
  }
  stopTimer() {
    clearInterval(this.state.timerID)
    this.setState({
      timerID: undefined,
    })
  }
  gamemodePicker(value: number) {
    this.setState({
      gamemode: value
    }, this.generateWord)
  }
  generateWord() {
    const words = require(`./database/rijeci-duge-${this.state.gamemode}-slova.json`) as string[];
    const length = words.length;
    const index = Math.floor(Math.random() * length);
    this.setState({
      wantedWord: words[index],
      time: 60
    }, () => {this.resetTable(); console.log(this.state.wantedWord)})
  }
  componentDidMount(): void {
    this.generateWord()
  }
  resetTable() {
    this.setState({
      showTable: false
    }, () => {
      this.setState({
        showTable: true
      })
    })
  }
  victory() {
    this.setState({
      showVictoryDialog: true
    }, this.stopTimer)
  }
  defeat() {
    this.setState({
      showDefeatDialog: true
    }, this.stopTimer)
  }
  openHelpModal() {
    this.setState({
      showHelpDialog: true
    }, this.stopTimer)
  }
  render() {
    return (
      <div className="App">
        <Timer time={this.state.time}></Timer>
        {this.state.showVictoryDialog ? <Modal>
          <div id="victory-dialog" className='modal-content'>
            <h1>{`svaka čast!!!`}</h1>
            <select name="gmSelector" id="gmSelector" onChange={this.gmSelectorChange}>
              <option value={5}>{'Lako'}</option>
              <option value={6}>{'Srednje'}</option>
              <option value={7}>{'Teško'}</option>
            </select>
            <button id="btnStart" onClick={this.btnStartClick}>{'Započni'}</button>
          </div>
        </Modal> : <></>}
        {this.state.showDefeatDialog ? <Modal>
          <div id="defeat-dialog" className='modal-content'>
            <h1>{`kraj igre`}</h1>
            <p>
              <span>{`Rešenje je:`}</span>
              <span>{this.state.wantedWord.toUpperCase()}</span>
            </p>
            <select name="gmSelector" id="gmSelector" onChange={this.gmSelectorChange}>
              <option value={5}>{'Lako'}</option>
              <option value={6}>{'Srednje'}</option>
              <option value={7}>{'Teško'}</option>
            </select>
            <button id="btnStart" onClick={this.btnStartClick}>{'Započni'}</button>
          </div>
        </Modal> : <></>}
        {this.state.showHelpDialog ? <Modal>
          <div id='help-dialog'>
            <p>
            <strong>{`Serble`}</strong>{` je srpska verzija popularne slagalice pod nazivom Vordle. Glavni cilj je pogoditi naznake o tome koja slova se nalaze u reči i gde se pojavljuju.`}
            </p>
            <p><strong>{`Postoje 3 nivoa igre`}</strong></p>
            <p>
              <ul>
                <li>{`Lako (5 slova; 6 pokušaja)`}</li>
                <li>{`Srednje (6 slova; 7 pokušaja)`}</li>
                <li>{`Teško (7 slova; 8 pokušaja)`}</li>
              </ul>
            </p>
            <p>{`Igra traje sve dok ne pogodite traženu reč, dok vam ne istekne vreme ili dok ne iskoristite sve pokušaje. Broj pokušaja zavisi od nivoa, dok na svakom nivou imate 60 sekundi za pogađanje.`}</p>
            <p>{`Reč pogađate unosom iste u polje za unos i pritiskom na taster `}<strong>"Enter"</strong>{`. Solva Vaše reči biće upisana u tabelu i igra će Vam dati naznake o slovima te reči.`}</p>
            <p><strong>{`Značenje naznaka:`}</strong></p>
            <p>
              <ul>
                <li>{`Zelena pločica označava da ste pogodili tačno slovo na tačnom mestu u reči.`}</li>
                <li>{`Žuta pločica znači da ste pogodili slovo koje je u reči, ali nije na pravom mestu.`}</li>
                <li>{`Crvena pločica znači da slovo nije u reči.`}</li>
              </ul>
            </p>
            <div className="button">
              <button onClick={this.startTimer}>{'Počni'}</button>
            </div>
          </div>
        </Modal> : <></>}
        <Navbar openHelpModal={this.openHelpModal} gamemode={this.state.gamemode} gamemodePicker={this.gamemodePicker}></Navbar>
        {this.state.showTable ? 
          <Table gamemode={this.state.gamemode} wantedWord={this.state.wantedWord}
            victory={this.victory} defeat={this.defeat}
          ></Table> : 
          <></>}
      </div>
    )
  }
}
