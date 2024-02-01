import { useState } from 'react';

function Square({value, onSquareClick}) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

export default function Board() {
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [count, setCount] = useState(1);
  const [preMove, setPreMove] = useState(null);
  const [XatCenter, setXatcenter] = useState(false);
  const [OatCenter, setOatcenter] = useState(false);
  const nextSquares = squares.slice();
  const [clickCenter, setClickCenter] = useState(false);
  function moveAdjacent(i, j) {
    const adjacencyList = {
      0: [1, 3, 4],
      1: [0, 2, 3, 4, 5],
      2: [1, 4, 5],
      3: [0, 1, 4, 6, 7],
      4: [0, 1, 2, 3, 5, 6, 7, 8],
      5: [1, 2, 4, 7, 8],
      6: [3, 4, 7],
      7: [3, 4, 5, 6, 8],
      8: [4, 5, 7]
    };
  
    return adjacencyList[i].includes(j);
  }

  function handleClick(i) {
    if (count <= 6){
      if (calculateWinner(squares) || squares[i]) {
        return;
      }
      if (xIsNext) {
       nextSquares[i] = 'X';
      } else {
        nextSquares[i] = 'O';
      }
      if (squares[4] === 'X') {
        setXatcenter(true);
      } else if (squares[4] === 'O') {
        setOatcenter(true);
      }
      setSquares(nextSquares);
      setXIsNext(!xIsNext);
      setCount(count + 1);
    }else {
      if (calculateWinner(squares)) {
        return;
      }
      if (preMove === null) {
        if (!squares[i]) return;
      
        if ((xIsNext && squares[i] === 'X') || (!xIsNext && squares[i] === 'O')) {
          nextSquares[i] = 'I';
          setSquares(nextSquares);
          setPreMove(i);
          setClickCenter(i === 4);
        }
        return;
      }
      
      if (preMove === i) {
        nextSquares[i] = xIsNext ? 'X' : 'O';
        setSquares(nextSquares);
        setPreMove(null);
        return;
      }
      
      if (squares[4]) {
        const isX = squares[4] === 'X';
        if ((isX && !xIsNext) || (!isX && xIsNext)) {
          setXatcenter(isX);
          setOatcenter(!isX);
        }
      }
      
      if (squares[i]) return;
      
      if (moveAdjacent(i, preMove)) {
        const newPiece = xIsNext ? 'X' : 'O';
        nextSquares[i] = newPiece;
        nextSquares[preMove] = null;
        setSquares(nextSquares);
        
        const occupied = xIsNext ? XatCenter : OatCenter;
        if (occupied && !calculateWinner(nextSquares) && !clickCenter) {
          nextSquares[i] = null;
          nextSquares[preMove] = newPiece;
          setSquares(nextSquares);
          
        } else {
          setXIsNext(!xIsNext);
          setXatcenter(xIsNext ? false : XatCenter);
          setOatcenter(xIsNext ? OatCenter : false);
        }
      } else {
        nextSquares[preMove] = xIsNext ? 'X' : 'O';
        setSquares(nextSquares);
        
      }
      setPreMove(null);
      
    }
  }
    

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}