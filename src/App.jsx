import { useEffect, useRef, useState } from "react";
import "./App.css";
import {
  createInitialObstacles,
  colision,
  calculateVelocity,
  getCactusHeight,
  getRandomEnemyType,
  updateObstacles,
  getRandomSpawnInterval,
} from "./utils/gameHelper";
import { useKeyboardControls } from "./hooks/useKeyboardControls";

function App() {
  const [dinoY, setDinoY] = useState(0);
  const velocityRef = useRef(0);
  const dinoYRef = useRef(0);
  const [dinoRun, setDinoRun] = useState(false);
  const osbtaclesIdRef = useRef(0);
  const tickRef = useRef(0);
  const metaCactusRef = useRef(70);
  const [score, setScore] = useState(0);
  const scoreRef = useRef(0);
  const [isGameOver, setGameOver] = useState(false);
  const gameOverRef = useRef(false);
  const isDuckingRef = useRef(false);
  const [isDucking, setIsDucking] = useState(false);
  const canvasRef = useRef(null);
  const [obstaculos, setObstaculos] = useState(
    createInitialObstacles(osbtaclesIdRef.current, getCactusHeight()),
  );

  const { handleControls, handleControlsUp } = useKeyboardControls({
    velocityRef,
    dinoYRef,
    isDucking,
    isDuckingRef,
    setIsDucking,
  });
  const handleClick = () => {
    setIsDucking(false);
    osbtaclesIdRef.current = 0;
    velocityRef.current = 0;
    metaCactusRef.current = 70;
    scoreRef.current = 0;
    setGameOver(false);
    setScore(0);
    gameOverRef.current = false;
    scoreRef.current = 0;
    dinoYRef.current = 0;
    setDinoY(0);
    setDinoRun(false);
    tickRef.current = 0;
    setObstaculos(
      createInitialObstacles(osbtaclesIdRef.current, getCactusHeight()),
    );
  };
  useEffect(() => {
    const animationFrame = setInterval(() => {
      if (dinoYRef.current === 0 && velocityRef.current === 0) {
        setDinoRun((prev) => !prev);
      }
    }, 150);
    const gameloop = setInterval(() => {
      if (gameOverRef.current) return; //para saber si perdi
      tickRef.current += 1;
      let newEnemie = null;
      if (tickRef.current >= metaCactusRef.current) {
        tickRef.current = 0;
        metaCactusRef.current = getRandomSpawnInterval();
        setScore((prev) => prev + 10);
        scoreRef.current += 10;
        let id = (osbtaclesIdRef.current += 1);
        newEnemie = getRandomEnemyType(id);
      }

      setObstaculos((prev) => {
        const newObs = updateObstacles(prev, scoreRef.current);
        if (colision(newObs, dinoYRef, isDuckingRef)) {
          setGameOver(true);
          gameOverRef.current = true;
          clearInterval(gameloop);
          clearInterval(animationFrame);
        }
        if (newEnemie != null) return [...newObs, newEnemie];
        return newObs;
      });

      setDinoY((prevDino) => {
        if (dinoYRef.current === 0 && velocityRef.current == 0) {
          dinoYRef.current = 0;
          velocityRef.current = 0;
          return 0;
        }

        let newY = prevDino + velocityRef.current;
        //gravedad con la que cae el dino
        velocityRef.current -= 0.5;
        if (newY <= 0) {
          velocityRef.current = 0;
          dinoYRef.current = 0;
          return 0;
        }

        dinoYRef.current = newY;

        return newY;
      });
    }, 20);
    const container = document.querySelector(".game-container");
    if (container) container.focus();
    return () => {
      clearInterval(gameloop);
      clearInterval(animationFrame);
    };
  }, [isGameOver]);

  return (
    <div
      className="game-container"
      tabIndex={0}
      onKeyDown={handleControls}
      onKeyUp={handleControlsUp}
    >
      {isGameOver && (
        <div className="game-over-screen">
          <h2>🎮 Game over 🎮</h2>
          <p>puntuacion final {score}</p>
          <button onClick={handleClick}>Reset Game</button>
        </div>
      )}
      <h1 className="score">{score}</h1>
      <div className="ground"></div>
      <div
        className={isDucking ? "dino ducking" : "dino"}
        style={{ bottom: `${dinoY}px` }}
      >
        {dinoRun ? "🦖" : "🦕"}
      </div>
      {obstaculos.map((cactus) => {
        return (
          <div
            key={cactus.id}
            id={cactus.id}
            style={{
              position: "absolute",
              left: `${cactus.x}px`,
              bottom: `${cactus.poscY}px`,
              fontSize: `${cactus.height}px`,
            }}
          >
            {cactus.type === "cactus" ? "🌵" : "🦅"}
          </div>
        );
      })}
    </div>
  );
}

export default App;
