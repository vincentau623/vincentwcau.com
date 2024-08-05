"use client";

import React, { useEffect, useState } from "react";
import { getRouteEta, getRouteList, getRouteStop, getStop } from "@/lib/kmb";
import moment from "moment";
import {
  Autocomplete,
  AutocompleteSection,
  AutocompleteItem
} from "@nextui-org/autocomplete";

const HkBusChecker = () => {
  const [routeList, setRouteList] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState<any>();
  const [routeStopList, setRouteStopList] = useState<any>([]);
  const [selectedRouteStop, setSelectedRouteStop] = useState<any>();
  const [routeEta, setRouteEta] = useState([]);
  const [etaResult, setEtaResult] = useState([]);

  const fetchRouteStop = async () => {
    const newRouteStops = (
      await getRouteStop(
        selectedRoute?.route,
        selectedRoute?.bound === "I" ? "inbound" : "outbound",
        selectedRoute?.service_type
      )
    ).data;
    await Promise.all(
      newRouteStops.map(async (el: any, index: number) => {
        const result = (await getStop(el.stop)).data;
        return { ...result, seq: index };
      })
    ).then((list) => {
      setRouteStopList(list);
    });
  };

  const fetchRouteEta = async () => {
    console.log("getETA");
    const newRouteEta = (await getRouteEta(selectedRoute.route, selectedRoute.service_type)).data;
    setRouteEta(newRouteEta);
  };

  useEffect(() => {
    if (selectedRoute) {
      fetchRouteStop();
      fetchRouteEta();
    }
  }, [selectedRoute]);

  useEffect(() => {
    const lastStop = localStorage.getItem("lastRouteStop");
    if (lastStop && routeStopList.length > 0) {
      setSelectedRouteStop(
        routeStopList.find((el: any) => `${el.seq}` === `${lastStop}`) || routeStopList[0]
      );
    } else {
      setSelectedRouteStop(routeStopList[0]);
    }
  }, [routeStopList]);

  useEffect(() => {
    if (selectedRouteStop && routeEta.length > 0 && selectedRoute) {
      const stopEta = routeEta.filter(
        (el: any) => el.seq === selectedRouteStop.seq && el.dir === selectedRoute.bound
      );
      setEtaResult(stopEta);
    }
  }, [routeEta, selectedRoute, selectedRouteStop]);

  useEffect(() => {
    const init = async () => {
      const newRouteList = (await getRouteList()).data;
      setRouteList(newRouteList);
      const lastRoute = localStorage.getItem("lastRoute");
      if (lastRoute) {
        setSelectedRoute(
          newRouteList.find((el: any) => `${el.route}${el.bound}${el.service_type}` === lastRoute)
        );
      } else {
        setSelectedRoute(newRouteList[0]);
      }
    };
    init();
  }, []);

  useEffect(() => {
    console.log("selectedRouteStop", selectedRouteStop);
  }, [selectedRouteStop]);

  const displayETA = () => {
    return (
      <div>
        {/* {etaResult.length > 0 ? (
          etaResult.map((el:any) => {
            console.log(el);
            return (
              <div>
                {el.eta ? (
                  <div>
                    {moment(el.eta).format("HH:mm:ss")} ({moment(el.eta).diff(moment(), "minutes")})
                  </div>
                ) : (
                  <div>No ETA at the moment</div>
                )}
                <Typography variant="caption" display="block" gutterBottom>
                  Last Update: {moment(el.data_timestamp).format("HH:mm:ss")}{" "}
                </Typography>
              </div>
            );
          })
        ) : (
          <div>No service at the moment</div>
        )}
        <Button color="primary" aria-label="refresh" onClick={fetchRouteEta}>
          Refresh
        </Button> */}
      </div>
    );
  };

  return (
    <div>
      ETA
    </div>
    // <Stack spacing={2} style={{ paddingTop: "1em" }}>
    //   {routeList.length > 0 && selectedRoute && (
    //     <Autocomplete
    //       disablePortal
    //       value={selectedRoute}
    //       onChange={(event, newValue) => {
    //         localStorage.setItem(
    //           "lastRoute",
    //           `${newValue.route}${newValue.bound}${newValue.service_type}`
    //         );
    //         setSelectedRoute(newValue);
    //       }}
    //       id="combo-box-demo"
    //       options={routeList}
    //       getOptionLabel={(option) =>
    //         `${option.route} - ${option.orig_tc}->${option.dest_tc} (${option.bound}${option.service_type})`
    //       }
    //       sx={{ width: "90vw" }}
    //       renderInput={(params) => <TextField {...params} label="Route" />}
    //     />
    //   )}
    //   {routeStopList.length > 0 && selectedRouteStop && (
    //     <Autocomplete
    //       disablePortal
    //       value={selectedRouteStop}
    //       onChange={(event, newValue) => {
    //         localStorage.setItem("lastRouteStop", `${newValue.seq}`);
    //         setSelectedRouteStop(newValue);
    //       }}
    //       id="combo-box-demo"
    //       options={routeStopList}
    //       getOptionLabel={(option) => `${option.seq} - ${option.name_tc}`}
    //       sx={{ width: "90vw" }}
    //       renderInput={(params) => <TextField {...params} label="Stop" />}
    //     />
    //   )}
    //   {selectedRouteStop && routeEta.length > 0 && displayETA()}
    // </Stack>
  );
};

export default HkBusChecker;
