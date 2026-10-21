import { useState } from 'react';
import './App.css';

const SIZE = 10;

const ladders = {
  4: 14,
  9: 31,
  20: 38,
  28: 84,
  40: 59,
  63: 81,
  71: 91,
};

const snakes = {
  17: 7,
  54: 34,
  62: 19,
  64: 60,
  87: 24,
  93: 73,
  95: 75,
  99: 78,
};

function App() {
  const [p1Pos, setP1Pos] = useState(1);
  const [p2Pos, setP2Pos] = useState(1);
  const [turn, setTurn] = useState('P1');
  const [dice, setDice] = useState(null);
  const [winner, setWinner] = useState(null);
  const [isGameOver, setIsGameOver] = useState(false);

  const getNumber = (i) => {
    const row = Math.floor(i / SIZE); // 0 = top row on screen
    const col = i % SIZE;
    const rowFromBottom = SIZE - 1 - row;
    const offset = rowFromBottom % 2 === 0 ? col : SIZE - 1 - col;
    return rowFromBottom * SIZE + offset + 1;
  };

  const handleRollDice = () => {
    if (isGameOver) return;

    const roll = Math.floor(Math.random() * 6) + 1;
    setDice(roll);

    const currentPos = turn === 'P1' ? p1Pos : p2Pos;
    let newPos = currentPos + roll;

    if (newPos > 100) {
      // If move goes beyond 100, keep current position
      newPos = currentPos;
    } else {
      // Climb ladders or slide down snakes
      if (ladders[newPos]) {
        newPos = ladders[newPos];
      } else if (snakes[newPos]) {
        newPos = snakes[newPos];
      }
    }

    if (newPos === 100) {
      if (turn === 'P1') {
        setP1Pos(100);
      } else {
        setP2Pos(100);
      }
      setWinner(turn);
      setIsGameOver(true);
      setDice(0);
    } else {
      if (turn === 'P1') {
        setP1Pos(newPos);
        setTurn('P2');
      } else {
        setP2Pos(newPos);
        setTurn('P1');
      }
    }
  };

  const handleReset = () => {
    setP1Pos(1);
    setP2Pos(1);
    setTurn('P1');
    setDice(null);
    setWinner(null);
    setIsGameOver(false);
  };

  const cells = Array.from({ length: 100 }, (_, i) => i);

  return (
    <div className="app">
      <div className="container">
        <h1>Snake & Ladders</h1>
        <div className="info">
          <div className="turn">
            <p>
              {winner ? 'Winner: ' : 'Turn: '}
              <span
                className="turn-pill"
                style={{
                  background: (winner || turn) === 'P1' ? '#ef4444' : '#3b82f6',
                }}
              >
                {winner || turn}
              </span>
            </p>
          </div>
          <div className="color-info">
            <div className="p1">
              <div className="p1-color"></div>
              <p>P1</p>
            </div>
            <div className="p2">
              <div className="p2-color"></div>
              <p>P2</p>
            </div>
          </div>
        </div>

        <div className="board">
          {cells.map((_, i) => {
            const num = getNumber(i);
            const isP1 = p1Pos === num;
            const isP2 = p2Pos === num;
            const ladderTo = ladders[num];
            const snakeTo = snakes[num];

            return (
              <div key={num} className="cell">
                <div className="cell-top">
                  <div className="cell-number">{num}</div>
                  <div className="snake-ladder">
                    {ladderTo && (
                      <span className="badge ladder-badge">→ {ladderTo}</span>
                    )}
                    {snakeTo && (
                      <span className="badge snake-badge">→ {snakeTo}</span>
                    )}
                  </div>
                </div>
                <div className="positions">
                  {isP1 && <div className="token p1-token">P1</div>}
                  {isP2 && <div className="token p2-token">P2</div>}
                </div>
              </div>
            );
          })}
        </div>

        <div className="ctas">
          <button
            className="roll-dice"
            disabled={isGameOver}
            onClick={handleRollDice}
          >
            {isGameOver
              ? 'Roll Dice (0)'
              : dice !== null
              ? `Roll Dice (${dice})`
              : 'Roll Dice'}
          </button>
          <button className="reset" onClick={handleReset}>
            Reset
          </button>
        </div>

        <p className="description">
          Exact 100 is required to win. Land on a ladder to climb up, a snake to
          slide down.
        </p>
      </div>
    </div>
  );
}

export default App;
