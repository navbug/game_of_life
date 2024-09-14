'use client';

import { useState, useEffect, useCallback } from "react";
import GameGrid from "./GameGrid";
import GameControls from "./GameControls";
import { GameState, GameSettings, Grid, CellState } from "../types/game";
import { createEmptyGrid, randomizeGrid, nextGeneration, isGridEmpty } from "../utils/gameLogic";

const DEFAULT_SETTINGS: GameSettings = {
  rows: 30,
  cols: 30,
  speed: 100,
};

const GameOfLife: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(() => ({
    grid: createEmptyGrid(DEFAULT_SETTINGS.rows, DEFAULT_SETTINGS.cols),
    isRunning: false,
  }));

  const updateGrid = useCallback(() => {
    setGameState((prevState) => {
      const newGrid = nextGeneration(prevState.grid);

      if (isGridEmpty(newGrid)) {
        return {
          ...prevState,
          grid: newGrid,
          isRunning: false,
        }
      }

      return {
        ...prevState,
        grid: nextGeneration(prevState.grid),
      }
    });
  }, []);

  useEffect(() => {
    let intervalId: number | null = null;
    if (gameState.isRunning) {
      intervalId = setInterval(updateGrid, DEFAULT_SETTINGS.speed);
    }
    return () => {
      if (intervalId !== null) clearInterval(intervalId);
    };
  }, [gameState.isRunning, updateGrid]);

  const handleCellClick = (x: number, y: number) => {
    setGameState((prevState) => {
      const newGrid: Grid = prevState.grid.map((row, rowIndex) => 
        rowIndex === x 
          ? row.map((cell, colIndex) => 
              colIndex === y ? (cell === 1 ? 0 : 1) : cell
            )
          : [...row]
      );
      return { ...prevState, grid: newGrid };
    });
  };

  const handleStart = () => setGameState((prev) => ({ ...prev, isRunning: true }));

  const handleStop = () => setGameState((prev) => ({ ...prev, isRunning: false }));

  const handleReset = () => setGameState({
    grid: createEmptyGrid(DEFAULT_SETTINGS.rows, DEFAULT_SETTINGS.cols),
    isRunning: false,
  });

  const handleRandomize = () => setGameState((prev) => ({
    ...prev,
    grid: randomizeGrid(prev.grid),
  }));

  return (
    <div className="flex flex-col items-center">
      <div className="w-full">
        <GameGrid grid={gameState.grid} onCellClick={handleCellClick} />
      </div>
      <GameControls
        isRunning={gameState.isRunning}
        onStart={handleStart}
        onStop={handleStop}
        onReset={handleReset}
        onRandomize={handleRandomize}
      />
    </div>
  );
};

export default GameOfLife;