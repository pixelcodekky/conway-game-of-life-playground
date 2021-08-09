import React, { useState, useCallback, useRef } from 'react';
import produce from 'immer';
import './App.css';

function App() {

  const numRows = 50;
  const numCols = 50;

  const operations = [
    [0,1],
    [0,-1],
    [1,-1],
    [-1,1],
    [1,1],
    [-1,-1],
    [1,0],
    [-1,0],

  ]

  const generateEmptyGreid = () => {
    const rows = [];
    for(let i=0; i < numRows; i++){
      rows.push(Array.from(Array(numCols), () => 0));
    }

    return rows;
  }

  const generateRandomGrid = () => {
    const rows = [];
    for(let i=0; i < numRows; i++){
      rows.push(Array.from(Array(numCols), () => Math.random() > 0.8 ? 1 : 0));
    }

    setGrid(rows);
  }

  const [grid, setGrid] = useState(() => {
    return generateEmptyGreid();
  });

  //console.log(grid);

  const [running, setRunning] = useState(false);

  const runningRef = useRef(running);
  runningRef.current = running;

  const runSimulation = useCallback(() => {
    if(!runningRef.current){
      return;
    }

    setGrid((g) => {
      return produce(g, gridCopy => {
        for(let i=0; i < numRows; i++){
          for(let k=0; k < numCols; k++){
            let neighbors = 0;
            operations.forEach(([x,y]) => {
              const newI = i + x;
              const newK = k + y;

              if(newI >= 0 && newI < numRows && newK >= 0 && newK < numCols){
                neighbors += g[newI][newK];
              }

            })

            if(neighbors < 2 || neighbors > 3){
              gridCopy[i][k] = 0;
            }else if(g[i][k] === 0 && neighbors === 3){
              gridCopy[i][k] = 1;
            }
          }
        }
      });
    })
    setTimeout(runSimulation, 300);
  }, []);

  return (
    <>
    <div className="App-container">
    <button onClick={() => {
      setRunning(!running);
      if(!running){
        runningRef.current = true;
        runSimulation();
      }
      
    }}>
      {running ? 'Stop' : 'Start'}
      </button>

      <button onClick={() => {
        generateRandomGrid();

      }}>
        Random
      </button>

      <button onClick={() => {
        setGrid(generateEmptyGreid());
      }}>Clear</button>
    <div 
      style={{display: "grid", gridTemplateColumns: `repeat(${numCols}, 20px)`}}>
        {grid.map((rows, i) => 
          rows.map((cols,k) => 
            <div key={`${i}-${k}`}
            onClick={() => {
              const newGrid = produce(grid, gridCopy => {
                gridCopy[i][k] = gridCopy[i][k] ? 0 : 1;
              });
              setGrid(newGrid);
            }}
            style={{width:20, 
            height: 20, 
            backgroundColor: grid[i][k] ? "#334dcc" : undefined, 
            border: "1px solid grey" }}>

            </div>
        ))};
    </div>
    </div>
    
    </>
  );
}

export default App;
