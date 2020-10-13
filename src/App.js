import React from 'react';
import './App.css';


function Square(props){
  const winningSquareStyle = {
    backgroundColor: '#ccc'
  };

  return(
    <button className="square" onClick={props.onClick} 
    style={props.winningSquare ? winningSquareStyle : null}>
      {props.value}
    </button>
  );
}

class Board extends React.Component{
  renderSquare(i){
    let winningSquare = this.props.winner && this.props.winner.includes(i) ? true : false;
    return(
      <Square
        value={this.props.squares[i]}
        onClick={()=>this.props.onClick(i)}
        winningSquare = {winningSquare}
      />
    );
  }
  render(){
    let boardSquares = [];
    for(let row = 0; row < 3; row++){
      let boardRow = [];
      for(let col = 0; col < 3; col++){
        boardRow.push(<span key={(row * 3) + col}>{this.renderSquare((row * 3) + col)}</span>);
      }
      boardSquares.push(<div className="board-row" key={row}>{boardRow}</div>);
    }
    return(
      <div>
        {boardSquares}
      </div>
    );
  }
}


class App extends React.Component{
  constructor(props){
    super(props);
    this.state={
      history:[
        {
          squares: Array(9).fill(null)
        }
      ],
      stepNumber:0,
      xisNext: true,
      position:{
        row:null,
        column:null
      }
    }
  }
  handleClick(i){
      const history=this.state.history.slice(0,
      this.state.stepNumber+1);
      const current=history[history.length-1];
      const squares=current.squares.slice();
      this.setState({
        position:{
          row:Math.floor(i/3)+1,
          column:i%3+1
        }
      })
      if(calculateWinner(squares)||squares[i]){
        return;
      }
      squares[i]=this.state.xisNext?"X":"O";
      this.setState({
        history:history.concat([
          {
            squares:squares
          }
        ]),
        stepNumber:history.length,
        xisNext: !this.state.xisNext
      })
  }

  jumpTo(step){
    this.setState({
      stepNumber:step,
      xisNext: (step%2)===0
    })
  }

  render(){
    const active = {
      fontWeight: 'bold'
    };

    const inactive = {
      fontWeight: 'normal'
    };

    const history =this.state.history;
    const current=history[this.state.stepNumber];
    const winner= calculateWinner(current.squares);
    const full=squareFull(current.squares);
    const moves=history.map((step,move)=>{
      const desc=move?
      "GO TO MOVE #"+move:
      "GO TO GAME START";
      return (
        <li key={move}>
         <button style={this.state.stepNumber === move ? active : inactive} 
         onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      )
    });

    let status;
    if(winner){
      status="Winner: "+winner.winner;
    }
    else if(full){
      status="Draw Match!!!";
    }else{
      status="Next Player: "+
      (this.state.xisNext?"X":"O");
    }

    const position=`You just clicked at position:(${this.state.position.row},${this.state.position.column})`
    return(
      <div className="game">
        <div className="game-board">
          <Board
          squares={current.squares}
          onClick={i=>this.handleClick(i)}
          winner={winner && winner.winningSquares}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
        <div className="game-info">
        <div><h3>{position}</h3></div>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares){
  const lines=[
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
  ];
  for(let i=0;i<lines.length;i++){
    const [a,b,c]=lines[i];
    if(squares[a]&&squares[a]===squares[b]&&
      squares[a]===squares[c]){
        return ({
          winner:squares[a],
          winningSquares:lines[i]
        });
      }
  }
  return null;
}

function squareFull(squares){
  for(let i=0;i<9;i++){
    if(squares[i]==null)
    return false;
  }
  return true;
}


export default App;
