'use client';

import { Button, Input, Switch } from "@nextui-org/react";
import { useState } from "react";

const RandomNumberGenerator = () => {
  const [count, setCount] = useState<number | null>(6);
  const [min, setMin] = useState<number | null>(1);
  const [max, setMax] = useState<number | null>(49);
  const [repeatable, setRepeatable] = useState<boolean>(false);
  const [warningText, setWarningText] = useState<string>("");

  const handleGenerateButton = () => {
    if (validation()) {
      setWarningText("Invalid input");
      return;
    } else {
      setWarningText("");
    }
    const list = document.getElementById("list");
    const li = document.createElement("li");
    if (count != null && min != null && max != null) {
      const numberList = generateUniqueNumbers(count, min, max);
      li.textContent = numberList.sort((a, b) => a >= b ? 1 : -1).map((number) => number.toString().padStart(2, "0")).toString();
      list?.appendChild(li);
    }
  };

  const generateUniqueNumbers = (count: number, min: number, max: number) => {
    const numbers: number[] = [];
    while (numbers.length < count) {
      let randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
      if (repeatable || !numbers.includes(randomNum)) {
        numbers.push(randomNum);
      }
    }
    return numbers;
  };

  const handleClearButton = () => {
    const list = document.getElementById("list");
    if (list) {
      list.innerHTML = "";
    }
  };

  const validation = () => {
    return count == null ||
      min == null ||
      max == null ||
      count < 1 ||
      min < 1 ||
      max < 1 ||
      min > max ||
      (!repeatable && (count > (max - min + 1)));
  };

  return (
    <div className="flex flex-col gap-2 items-center">
      <div className="flex flex-row gap-2 w-3/4">
        <Input
          className="shrink"
          label="Count"
          placeholder="Enter count"
          value={`${count || ""}`}
          onValueChange={(value) => {
            if (value != null) {
              setCount(parseInt(value) || 0);
            } else {
              setCount(null);
            }
          }}
        />
        <Input
          className="shrink"
          label="Min"
          placeholder="Enter min"
          value={`${min || ""}`}
          onValueChange={(value) => {
            if (value != null) {
              setMin(parseInt(value) || 0);
            } else {
              setMin(null);
            }
          }}
        />
        <Input
          className="shrink"
          label="Max"
          placeholder="Enter max"
          value={`${max || ""}`}
          onValueChange={(value) => {
            if (value != null) {
              setMax(parseInt(value) || 0);
            } else {
              setMax(null);
            }
          }}
        />
        <Switch className="shrink" isSelected={repeatable} onValueChange={setRepeatable}>
          Is Number Repeatable?
        </Switch>
      </div>
      <div>
        <Button onClick={handleGenerateButton}>Generate Random Number</Button>
      </div>
      <div>
        <Button onClick={handleClearButton}>Clear</Button>
      </div>
      {warningText && <div className="text-red-300 text-2xl	font-bold">{warningText}</div>}
      <div>
        <ul id="list" className="font-mono text-xl"></ul>
      </div>
    </div>
  );

};

export default RandomNumberGenerator;