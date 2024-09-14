import { Grid } from '../types/game';

export function createEmptyGrid(rows: number, cols: number): Grid {
  return Array.from({ length: rows }, () => Array(cols).fill(0)) as Grid;
}

export function randomizeGrid(grid: Grid): Grid {
  return grid.map(row => row.map(() => Math.random() > 0.6 ? 1 : 0)) as Grid;
}

export function isGridEmpty(grid: Grid): boolean {
  return grid.every(row => row.every(col => col === 0));
}

export function countNeighbors(row: number, col: number, grid: Grid): number {
  const directions: [number, number][] = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1], [0, 1],
    [1, -1], [1, 0], [1, 1]
  ];

  let count = 0;
  const rowCount = grid.length;
  const colCount = grid[0]?.length ?? 0;

  for (const [dx, dy] of directions) {
    const newRow = row + dx;
    const newCol = col + dy;

    if (newRow >= 0 && newRow < rowCount && newCol >= 0 && newCol < colCount) {
      const cell = grid[newRow]?.[newCol];
      if (cell !== undefined) {
        count += cell <= 0 ? 0 : 1;
      }
    }
  }

  return count;
}

export function nextGeneration(grid: Grid): Grid {
  // Optimized Sol: Time Complexity: O(n*m)
  //                Space Complexity: O(1)

  {/*
      Approach: (Inplace solution)
      Iterate over the matrix and for each cell count the number of neighbours
      Now check if the cell is live(with 1 value) and it's neighbours count is < 2 or > 3 -> change cell value to 2(it indicates that it will be dead)
      And similarly for dead cell(cell with 0 value) and it's neighbours count is equal to 3 -> change cell value to -3(it indicates that it will become alive)

      Finally, iterate over the matrix and for each cell apply the condition: cell value is equal to 2 change it to 0 or if cell value is equal to -3 change it to 1.
  */}

  const rowCount = grid.length;
  const colCount = grid[0]?.length ?? 0;

  const newGrid: Grid = grid.map(row => [...row]);

  for (let i = 0; i < rowCount; i++) {
    const row = newGrid[i];
    if (!row) continue;

    for (let j = 0; j < colCount; j++) {
      const liveNeighbors = countNeighbors(i, j, grid);

      if (row[j] === 1) {
        if (liveNeighbors < 2 || liveNeighbors > 3) {
          row[j] = 2;
        }
      } else if (row[j] === 0 && liveNeighbors === 3) {
        row[j] = -3;
      }
    }
  }

  for (let i = 0; i < rowCount; i++) {
    const row = newGrid[i];
    if (!row) continue;

    for (let j = 0; j < colCount; j++) {
      if (row[j] === -3) {
        row[j] = 1;
      } else if (row[j] === 2) {
        row[j] = 0;
      }
    }
  }

  return newGrid as Grid;
}