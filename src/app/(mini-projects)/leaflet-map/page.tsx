"use client";

import { getHKTrafficData } from "@/lib/map";
import dynamic from "next/dynamic";
import { useEffect, useMemo } from "react";

const LeafletMapPage = () => {

  const Map = useMemo(() => dynamic(() => import("@/components/Map"), { loading: () => <p>Map is loading</p>, ssr: false }), []);

  useEffect(() => {
    const init = async () => {
      const data = await getHKTrafficData();
      console.log(data);
    };
    init();
  }, []);

  return (
    <div>
      <Map />
    </div>
  );
};

export default LeafletMapPage;