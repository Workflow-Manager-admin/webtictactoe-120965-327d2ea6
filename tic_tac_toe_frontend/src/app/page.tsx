"use client";

import { useState } from "react";

// Highlighted style variables for theme and minimalistic style
const COLOR_PRIMARY = "#1976d2";
const COLOR_SECONDARY = "#424242";
const COLOR_ACCENT = "#f9a825";
const BLANK = "";

type Player = "X" | "O";
type Cell = Player | typeof BLANK;
type Board = Cell[];

function getWinner(board: Board): Player | null {
  const lines = [
    [0, 1, 2], // rows
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6], // cols
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8], // diags
    [2, 4, 6],
  ];
  for (const [a, b, c] of lines) {
    if (
      board[a] !== BLANK &&
      board[a] === board[b] &&
      board[a] === board[c]
    ) {
      return board[a] as Player;
    }
  }
  return null;
}

function isDraw(board: Board): boolean {
  return board.every((cell) => cell !== BLANK) && !getWinner(board);
}

function initialBoard(): Board {
  return Array(9).fill(BLANK) as Board;
}

// PUBLIC_INTERFACE
export default function Home() {
  const [board, setBoard] = useState<Board>(initialBoard());
  const [current, setCurrent] = useState<Player>("X");
  const [winner, setWinner] = useState<Player | null>(null);
  const [draw, setDraw] = useState<boolean>(false);
  const [score, setScore] = useState<{ X: number; O: number }>({ X: 0, O: 0 });

  // PUBLIC_INTERFACE
  function handleClick(idx: number) {
    if (board[idx] !== BLANK || winner || draw) return;
    const newBoard = [...board];
    newBoard[idx] = current;
    const maybeWinner = getWinner(newBoard);
    if (maybeWinner) {
      setWinner(maybeWinner);
      setScore((prev) => ({
        ...prev,
        [maybeWinner]: prev[maybeWinner] + 1,
      }));
    }
    if (!maybeWinner && isDraw(newBoard)) {
      setDraw(true);
    }
    setBoard(newBoard);
    if (!maybeWinner && !isDraw(newBoard)) setCurrent((p) => (p === "X" ? "O" : "X"));
  }

  // PUBLIC_INTERFACE
  function resetGame(full: boolean = false) {
    setBoard(initialBoard());
    setWinner(null);
    setDraw(false);
    setCurrent(full ? "X" : current); // X starts if full, else same player continues
    if (full) setScore({ X: 0, O: 0 });
  }

  const playerColor = (player: Player) =>
    player === "X" ? COLOR_PRIMARY : COLOR_ACCENT;

  return (
    <div
      className="min-h-screen flex flex-col justify-center items-center"
      style={{ background: "#fff" }}
    >
      <div className="w-full max-w-xs flex flex-col items-center">
        <h2
          className="mb-7 mt-3 select-none"
          style={{
            color: COLOR_SECONDARY,
            fontWeight: 600,
            fontSize: "1.2rem",
            letterSpacing: ".02em",
            textAlign: "center",
          }}
        >
          Tic Tac Toe
        </h2>
        {/* Scoreboard */}
        <div
          className="flex flex-row justify-center mb-6 gap-4 w-full"
          style={{ fontWeight: 500 }}
        >
          <span
            className="rounded px-4 py-2"
            style={{
              border: `1.5px solid ${COLOR_PRIMARY}`,
              background: "#f8fafc",
              color: COLOR_PRIMARY,
              minWidth: 44,
              textAlign: "center",
            }}
          >
            X&nbsp;<b>{score.X}</b>
          </span>
          <span
            className="rounded px-4 py-2"
            style={{
              border: `1.5px solid ${COLOR_ACCENT}`,
              background: "#f8fafc",
              color: COLOR_ACCENT,
              minWidth: 44,
              textAlign: "center",
            }}
          >
            O&nbsp;<b>{score.O}</b>
          </span>
        </div>

        {/* Game board */}
        <div
          tabIndex={0}
          role="grid"
          aria-label="Tic Tac Toe game board"
          className="grid grid-cols-3 gap-1 mb-7 transition-all"
          style={{
            width: 240,
            height: 240,
          }}
        >
          {board.map((cell, idx) => (
            <button
              key={idx}
              aria-label={`Cell ${idx + 1}`}
              className="focus:outline-none w-20 h-20 select-none transition-colors"
              style={{
                background: "#fff",
                border: `2px solid ${COLOR_SECONDARY}`,
                borderRadius: 9,
                fontSize: "2.2rem",
                fontWeight: 500,
                color: cell ? playerColor(cell as Player) : COLOR_SECONDARY,
                // No highlighting of winning cells for minimalist design, remove unused 'line' variable and logic
                cursor: cell || winner || draw ? "default" : "pointer",
              }}
              onClick={() => handleClick(idx)}
              disabled={!!cell || !!winner || draw}
              tabIndex={0}
            >
              {cell}
            </button>
          ))}
        </div>

        {/* Game status message */}
        <div
          className="mb-4 h-7 flex flex-col items-center justify-center"
          aria-live="polite"
        >
          {!winner && !draw && (
            <span style={{ color: COLOR_SECONDARY, fontSize: "1.02rem" }}>
              Turn:&nbsp;
              <b style={{ color: playerColor(current) }}>{current}</b>
            </span>
          )}
          {winner && (
            <span
              style={{
                color: playerColor(winner),
                fontWeight: 600,
                fontSize: "1.08rem",
                letterSpacing: ".04em",
              }}
            >
              {winner} wins!
            </span>
          )}
          {!winner && draw && (
            <span
              style={{
                color: COLOR_SECONDARY,
                fontWeight: 500,
                fontSize: "1.08rem",
              }}
            >
              Draw!
            </span>
          )}
        </div>

        {/* Reset and New Game buttons */}
        <div className="flex gap-3 justify-center">
          <button
            className="rounded px-5 py-2 font-medium text-white transition-colors"
            style={{
              background: COLOR_PRIMARY,
              boxShadow: "none",
            }}
            onClick={() => resetGame()}
            aria-label="Restart round"
          >
            Restart Round
          </button>
          <button
            className="rounded px-5 py-2 font-medium text-white transition-colors"
            style={{
              background: COLOR_ACCENT,
            }}
            onClick={() => resetGame(true)}
            aria-label="Reset all"
          >
            Reset All
          </button>
        </div>
      </div>
      {/* Subtle footer for minimalism */}
      <footer className="mt-6 text-xs text-gray-400 select-none">
        Minimal Tic Tac Toe &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}
