import React, { Component } from 'react'
import './Table.css'
interface Props {
  gamemode: number,
  wantedWord: string,
  victory: () => void,
  defeat: () => void
}
interface State {
  solution: string,
  move: number,
  maxMoves: number
}
export default class Table extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.solutionChange = this.solutionChange.bind(this);
    this.solutionKeyUp = this.solutionKeyUp.bind(this);
    this.generateBoxes = this.generateBoxes.bind(this);
    this.checkSolution = this.checkSolution.bind(this);

    this.state = {
      solution: '',
      move: 0,
      maxMoves: props.gamemode + 1
    }
  }
  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any): void {
    if(prevProps.wantedWord === this.props.wantedWord) return
    document.querySelectorAll("span.letter").forEach(item => {
      if(item.classList.contains("green")) item.classList.remove("green")
      if(item.classList.contains("yellow")) item.classList.remove("yellow")
      if(item.classList.contains("red")) item.classList.remove("red")
      console.log(item);
      
    })
    this.setState({
      solution: '',
      move: 0,
      maxMoves: this.props.gamemode + 1
    })
  }
  solutionChange(event: React.ChangeEvent) {
    let input = event.target as HTMLInputElement;
    let pattern = /^[a-zA-ZčćšžđČĆŠŽĐ]+$/;
    let value = input.value;

    if(!pattern.test(value)) value = value.slice(0, -1);
    this.setState({
      solution: value.toLocaleLowerCase()
    })
  }
  solutionKeyUp(event: React.KeyboardEvent) {
    if(event.key !== 'Enter') return;
    if(this.state.solution.length !== this.props.gamemode) return
    this.setState({
      move: this.state.move + 1
    }, this.checkSolution)
  }
  generateBoxes(style: React.CSSProperties): React.ReactNode[] {
    var btns: React.ReactNode[] = [];
    for(let i = 0, n = this.props.gamemode, j = 0; i < n*(n+1); i++) {
      if(i % this.props.gamemode === 0) j++;
      btns.push(<span style={style} className='letter-wrapper' key={i} datatype={`row-${j}`}></span>)
    }
    return btns
  }
  checkSolution() {
    if(this.state.move > this.state.maxMoves) {
      window.alert("Nemate više pokušaja");
      return;
    }
    const wantedWord = this.props.wantedWord.split('');
    const solution = this.state.solution.split('');
    const spans = (document.querySelectorAll(`[datatype=row-${this.state.move}]`));
    var css = new Array<string>(this.props.gamemode);
    var wwOcurances: any = {};
    var sOcurances: any = {};
    for(const c of wantedWord) {
      wwOcurances[c] = wantedWord.join('').split(c).length - 1;
    }
    for(const c of solution) {
      sOcurances[c] = solution.join('').split(c).length - 1;
    }
    
    for(let i = 0; i < this.props.gamemode; i++) {
      if(solution[i] === wantedWord[i]){
        css[i] = 'green';
        wwOcurances[solution[i]]--;
      }
    }
    for(let i = 0; i < this.props.gamemode; i++) {
      if(wwOcurances[solution[i]] === 0) continue;
      if(wantedWord.includes(solution[i])){
        css[i] = 'yellow';
        wwOcurances[solution[i]]--;
      }
    }
    for(let i = 0; i < this.props.gamemode; i++) {
      if(css[i] !== undefined) continue;
      css[i] = 'red';
    }
    for(let i = 0; i < this.props.gamemode; i++) {
      setTimeout(() => {
        spans[i].innerHTML = solution[i];
        spans[i].classList.add(css[i]);
      }, i*100);
    }
    if(this.state.solution === this.props.wantedWord) {
      setTimeout(() => {
        this.props.victory();
      }, (this.state.solution.length + 2)*100);
      return
    }
    if(this.state.move === this.state.maxMoves) {
      setTimeout(() => {
        this.props.defeat();
      }, (this.state.solution.length + 2)*100);
      return
    }
    this.setState({
      solution: ''
    })
  }
  render() {
    let letterWrapperStyle: React.CSSProperties = {
      height: `var(--gamemode-${this.props.gamemode}-boxSize)`
    }
    let solutionStyle: React.CSSProperties = {
      height: `var(--gamemode-${this.props.gamemode}-boxSize)`,
      gridColumn: `span ${this.props.gamemode}`
    }
    let grid: React.CSSProperties = {
      gridTemplateRows: `repeat(${this.props.gamemode + 2}, 1fr)`,
      gridTemplateColumns: `repeat(${this.props.gamemode}, 1fr)`,
      width: `var(--table-width-${this.props.gamemode})`
    }
    return (
      <div className='table' style={grid}>
        {this.generateBoxes(letterWrapperStyle)}
        <div className='solution' style={solutionStyle}>
          <input type="text" name='solution' id='solution' maxLength={this.props.gamemode} 
            value={this.state.solution} onChange={this.solutionChange} onKeyUp={this.solutionKeyUp}
          />
        </div>
      </div>
    )
  }
}
