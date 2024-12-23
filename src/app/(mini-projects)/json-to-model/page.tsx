"use client";

import TitleBar from "@/components/TitleBar";
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
        modelString += `${spaces}  ${key}: ${generateModelString(
          value,
          indent + 1
        )},\n`;
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
    <>
      <TitleBar title="JSON to TS Interface Converter" />
      <div className="grid grid-flow-row auto-rows-max gap-4">
        <div className="">
          <div>Input:</div>
          <Textarea
            variant="faded"
            className="w-1/3"
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
          <Code style={{ whiteSpace: "pre" }}>{output}</Code>
        </div>
      </div>
    </>
  );
};

export default JsonToModelPage;
