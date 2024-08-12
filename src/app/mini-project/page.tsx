"use client";

import InfoCard from "@/components/InfoCard";
import TitleBar from "@/components/TitleBar";

const MiniProjectPage = () => {
  return (
    <div className="flex flex-col items-center">
      <TitleBar title="Mini Project Page" />
      <InfoCard
        title="Json To Model"
        description="Convert JSON string to model class TypeScript."
        href="/mini-project/json-to-model" />
      <InfoCard
        title="HK Bus Checker"
        description="Check the real-time Estimated Time of Arrival(ETA) by HK Bus Route."
        href="/mini-project/hk-bus-checker" />
      <InfoCard
        title="Queens"
        description="A solver for the N-Queens problem."
        href="/mini-project/queens" />
    </div>
  );
};
export default MiniProjectPage;;