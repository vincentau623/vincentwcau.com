"use client";

import InfoCard from "@/components/InfoCard";
import TitleBar from "@/components/TitleBar";

export default function LandingPage() {

  return (
    <div className="flex flex-col grow">
      <div id="header" className="-mb-16">
      </div>
      <div id="landing" className="pt-20 -mb-20">
        <TitleBar title="Home" />
      </div>
      <div id="about-me" className="pt-20 -mb-20">
        <TitleBar title="About Me" />
      </div>
      <div id="mini-project" className="pt-20">
        <div className="flex flex-col items-center">
          <TitleBar title="Mini Project Page" />
          <InfoCard
            title="Json To Model"
            description="Convert JSON string to model class TypeScript."
            href="/json-to-model" />
          <InfoCard
            title="HK Bus Checker"
            description="Check the real-time Estimated Time of Arrival(ETA) by HK Bus Route."
            href="/hk-bus-checker" />
          <InfoCard
            title="Queens"
            description="A solver for the N-Queens problem."
            href="/queens" />
        </div>
        <div id="footer">
          <div className="flex justify-center items-center p-4">
            <p className="text-center">© 2024 Vincent AU</p>
          </div>
        </div>
      </div>
    </div>
  );
}
