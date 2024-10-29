import { useState, MouseEvent } from "react";
import "./App.css";

interface Dots {
  x: number;
  y: number;
}

function App() {
  const [dots, setDots] = useState<Dots[]>([]);

  const draw = (event: MouseEvent) => {
    const { clientX, clientY } = event;
    setDots([...dots, { x: clientX, y: clientY }]);
  };

  const undo = () => {
    console.log(dots.length);
    dots.pop();
    console.log(dots.length);
    setDots(dots);
  };

  return (
    <>
      <div className="App">
        <div id="button-wrapper">
          <button onClick={undo}>Undo</button>
          <button>Redo</button>
        </div>
        <div id="click-area" onClick={draw}>
          {dots.map(({ x, y }: Dots, i: number) => (
            <div key={`dot-${i}`} style={{ left: x, top: y }} className="dot" />
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
