"use client";

import { Button, Code, Textarea } from "@nextui-org/react";
import { useState } from "react";


const JsonToModelPage = () => {
  const [jsonValue, setJsonValue] = useState("");

  const [output, setOutput] = useState("");

  const convertJsonToModel = () => {
    let result = jsonValue;
    // validate json
    if (!result) {
      result = "Empty JSON";
      setOutput(result);
      return;
    }
    try {
      result = JSON.parse(result);
    } catch (e) {
      result = "Invalid JSON";
      setOutput(result);
      return;
    }
    // convert json to model
    const modelString = generateModelString(result);
    setOutput(modelString);
  };

  const generateModelString = (obj: any, indent: number = 0): string => {
    let modelString = "";
    const spaces = " ".repeat(indent * 2);

    if (Array.isArray(obj)) {
      if (obj.length === 0) {
        modelString += `${spaces}[]`;
      } else {
        modelString += `${spaces}[\n`;
        obj.forEach((item: any) => {
          modelString += `${generateModelString(item, indent + 1)},\n`;
        });
        modelString += `${spaces}]`;
      }
    } else if (typeof obj === "object" && obj !== null) {
      modelString += `${spaces}{\n`;
      Object.entries(obj).forEach(([key, value]) => {
        modelString += `${spaces}  ${key}: ${generateModelString(value, indent + 1)},\n`;
      });
      modelString += `${spaces}}`;
    } else if (typeof obj === "string") {
      modelString += "string";
    } else if (typeof obj === "number") {
      modelString += "number";
    } else if (typeof obj === "boolean") {
      modelString += "boolean";
    } else if (obj === null) {
      modelString += "null";
    } else {
      modelString += "unknown";
    }

    return modelString;
  };


  return (
    <main className="min-h-screen">
      <div>JSON to Model Converter</div>
      <div>Input:</div>
      <div className="w-full flex flex-col gap-2 max-w-[240px]">
        <Textarea
          variant="underlined"
          placeholder="Enter your JSON"
          value={jsonValue}
          onValueChange={setJsonValue}
        />
      </div>
      <div>
        <Button color="primary" onPress={() => convertJsonToModel()}>
          Convert
        </Button>
      </div>
      <div>
        <div>Output:</div>
        <Code style={{ whiteSpace: 'pre' }}>{output}</Code>
      </div>
    </main>);
};

export default JsonToModelPage;