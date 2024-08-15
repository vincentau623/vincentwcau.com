"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";

const LeafletMapPage = () => {

  const Map = useMemo(() => dynamic(() => import("@/components/Map"), { loading: () => <p>Map is loading</p>, ssr: false }), []);

  return (
    <div>
      <Map/>
    </div>
  );
};

export default LeafletMapPage;