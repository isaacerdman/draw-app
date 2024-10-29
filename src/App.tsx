import { useState, MouseEvent, useRef } from "react";
import "./App.css";

interface Dot {
  x: number;
  y: number;
}

function App() {
  const [dots, setDots] = useState<Dot[]>([]);
  const [cache, setCache] = useState<Dot[]>([]);
  const [dotPointer, setDotPointer] = useState<number>(0);
  const [drawing, setDrawing] = useState<boolean>(false);
  const undoIntervalRef = useRef<number | null>(null);
  const redoIntervalRef = useRef<number | null>(null);
  const undoTimeout = useRef<number | null>(null);
  const redoTimeout = useRef<number | null>(null);

  const draw = (event: MouseEvent) => {
    if (drawing) {
      const { clientX, clientY } = event;
      const newDots = [
        ...dots.slice(0, dotPointer),
        { x: clientX, y: clientY },
      ];

      setDots(newDots);
      setDotPointer(newDots.length);
      setCache([]);
    }
  };

  const undo = () => {
    setDotPointer((prevPointer) => Math.max(prevPointer - 1, 0));
  };

  const redo = () => {
    setDotPointer((prevPointer) => Math.min(prevPointer + 1, dots.length));
  };

  const startUndo = () => {
    if (cache.length == 0) {
      undo();
      undoTimeout.current = window.setTimeout(() => {
        undoIntervalRef.current = window.setInterval(undo, 10);
      }, 500);
    } else {
      setDots(cache);
      setDotPointer(cache.length);
      setCache([]);
    }
  };

  const stopUndo = () => {
    if (undoTimeout.current) {
      clearInterval(undoTimeout.current);
      undoTimeout.current = null;
    }
    if (undoIntervalRef.current) {
      clearInterval(undoIntervalRef.current);
      undoIntervalRef.current = null;
    }
  };

  const startRedo = () => {
    redo();
    redoTimeout.current = window.setTimeout(() => {
      redoIntervalRef.current = window.setInterval(redo, 10);
    }, 500);
  };

  const stopRedo = () => {
    if (redoTimeout.current) {
      clearInterval(redoTimeout.current);
      redoTimeout.current = null;
    }
    if (redoIntervalRef.current) {
      clearInterval(redoIntervalRef.current);
      redoIntervalRef.current = null;
    }
  };

  const changeDrawing = () => {
    setDrawing(!drawing);
  };

  const drawingFalse = () => {
    setDrawing(false);
  };

  const clear = () => {
    if (dots.length > 0) {
      setCache(dots.splice(0, dotPointer));
      setDots([]);
      setDotPointer(0);
    }
  };

  return (
    <>
      <div className="App">
        <div id="button-wrapper">
          <button
            onMouseDown={startUndo}
            onMouseUp={stopUndo}
            onMouseLeave={stopUndo}
          >
            Undo
          </button>
          <button
            onMouseDown={startRedo}
            onMouseUp={stopRedo}
            onMouseLeave={stopRedo}
          >
            Redo
          </button>
          <button onClick={clear}>Clear</button>
        </div>
        <div
          id="click-area"
          onMouseMove={draw}
          onClick={changeDrawing}
          onMouseLeave={drawingFalse}
        >
          {dots.slice(0, dotPointer).map(({ x, y }: Dot, i: number) => (
            <div key={`dot-${i}`} style={{ left: x, top: y }} className="dot" />
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
