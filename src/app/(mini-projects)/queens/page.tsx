'use client';

import { useEffect, useState } from "react";
import TitleBar from "@/components/TitleBar";
import { Button, Input } from "@nextui-org/react";

interface Solution { marker: string; warning: boolean; }

const Queens = () => {
  const [size, setSize] = useState<number | null>(8);
  const [solutions, setSolutions] = useState<Solution[]>(Array.from({ length: size ? size * size : 0 }, () => ({ marker: "", warning: false })));
  const [isCompleted, setIsCompleted] = useState(false);
  const [previousInvalidIdx, setPreviousInvalidIdx] = useState<Set<number>>();

  const handleSizeChanges = (value: string) => {
    console.log("value", value, parseInt(value), parseInt(value) || 1);
    if (!value || value === "0") {
      setSize(null);
      return;
    }
    let newSize = parseInt(value) || 1;
    if (newSize < 1) newSize = 1;
    if (newSize > 16) newSize = 16;
    setSize(newSize);
    // reset solutions
    setSolutions(Array.from({ length: newSize * newSize }, () => ({ marker: "", warning: false })));
    setIsCompleted(false);
    setPreviousInvalidIdx(new Set());
  };

  const boxPress = (position: number) => {
    // update solution state
    const newSolutions = [...solutions];
    switch (newSolutions[position].marker) {
      case "cross":
        newSolutions[position].marker = "queen";
        break;
      case "queen":
        newSolutions[position].marker = "";
        break;
      default:
        newSolutions[position].marker = "cross";
        break;
    }
    const invalidIdxs = validateSolution();
    // add new warning
    invalidIdxs.forEach((idx: number) => newSolutions[idx].warning = true);
    // remove old warning
    if (previousInvalidIdx) {
      previousInvalidIdx.forEach(idx => {
        if (!invalidIdxs.has(idx)) {
          newSolutions[idx].warning = false;
        }
      });
    }
    // preserve states
    setPreviousInvalidIdx(invalidIdxs);

    setSolutions(newSolutions);
  };

  const validateSolution = () => {
    if (!size) {
      return new Set<number>();
    }
    console.log("start validate solution");
    let isValid = true;
    const invalidIdxs = new Set<number>();
    let markerCounter = 0;
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (solutions[i * size + j].marker === "queen") {
          markerCounter++;
          const [currentIdx, invalidIdx] = validateQueen(i, j);
          if (currentIdx != null && invalidIdx != null) {
            console.log("invalid solution: ", currentIdx, invalidIdx);
            invalidIdxs.add(currentIdx);
            invalidIdxs.add(invalidIdx);
            isValid = false;
          }
        }
      }
    }
    console.log(isValid, markerCounter);
    if (isValid && markerCounter === size) {
      setIsCompleted(true);
    } else {
      setIsCompleted(false);
    }
    return invalidIdxs;
  };

  const validateQueen = (row: number, col: number): number[] | null[] => {
    if (!size) {
      return [];
    }
    const currentIdx = row * size + col;
    // check row
    for (let i = 0; i < size; i++) {
      if (i !== col && solutions[row * size + i].marker === "queen") {
        return [currentIdx, row * size + i];
      }
    }

    // check column
    for (let i = 0; i < size; i++) {
      if (i !== row && solutions[i * size + col].marker === "queen") {
        return [currentIdx, i * size + col];
      }
    }

    // check diagonal
    for (let i = 1; i < size; i++) {
      if (row + i < size && col + i < size && solutions[(row + i) * size + (col + i)].marker === "queen") {
        return [currentIdx, (row + i) * size + (col + i)];
      }
      if (row - i >= 0 && col - i >= 0 && solutions[(row - i) * size + (col - i)].marker === "queen") {
        return [currentIdx, (row - i) * size + (col - i)];
      }
      if (row + i < size && col - i >= 0 && solutions[(row + i) * size + (col - i)].marker === "queen") {
        return [currentIdx, (row + i) * size + (col - i)];
      }
      if (row - i >= 0 && col + i < size && solutions[(row - i) * size + (col + i)].marker === "queen") {
        return [currentIdx, (row - i) * size + (col + i)];
      }
    }
    return [null, null];
  };

  const renderMarker = (marker: string) => {
    switch (marker) {
      case "queen": return "♛";
      case "cross": return "✗";
      default: return "";
    }
  };

  const handleClearButton = () => {
    setSolutions(Array.from({ length: size ? size * size : 0 }, () => ({ marker: "", warning: false })));
    setIsCompleted(false);
    setPreviousInvalidIdx(new Set());
  };

  return (<>
    <TitleBar title="Queens Solver" />
    <div className="p-4">
      <p className="my-4">The N-Queens problem is the problem of placing N chess queens on an N×N chessboard so that no two queens threaten each other; thus, a solution requires that no two queens share the same row, column, or diagonal.</p>
      <p className="my-4">The eight queens puzzle is the problem of placing eight chess queens on an 8×8 chessboard so that no two queens threaten each other; thus, a solution requires that no two queens share the same row, column, or diagonal.</p>
      <p className="my-4">The N-Queens problem is a generalization of the eight queens puzzle.</p>
    </div>
    <Input
      className="w-1/3"
      label="Size (1-16)"
      placeholder="Enter size of the board"
      value={`${size || ""}`}
      onValueChange={handleSizeChanges}
    />
    <div className="p-4">
      {size &&
        Array.from({ length: size }, (_, i) => (
          <div key={i} className="flex select-none">
            {Array.from({ length: size }, (_, j) => (
              <div key={j} className={`flex items-center justify-center w-8 h-8 border border-gray-300 ${solutions[i * size + j]?.warning && "bg-red-900"} ${isCompleted && "bg-green-900"}`}
                onClick={() => boxPress(i * size + j)}>
                {renderMarker(solutions[i * size + j]?.marker)}
              </div>
            ))}
          </div>
        ))
      }
    </div>
    <div className="p-4">
      <Button onPress={handleClearButton}>
        Clear
      </Button>
    </div>
    {isCompleted &&
      <div className="text-3xl p-4">You Completed the Queens Puzzle.</div>
    }
  </>);
};

export default Queens;;