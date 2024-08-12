"use client";

import React, { Key, useEffect, useState } from "react";
import moment from "moment";
import { getRouteEta, getRouteList, getRouteStop, getStop } from "@/lib/kmb";
import { useFilter } from "@react-aria/i18n";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  MenuTriggerAction,
  Select,
  SelectItem,
} from "@nextui-org/react";
import TitleBar from "@/components/TitleBar";
import { Route, RouteOption, RouteStopOption } from "@/models/kmb";

const HkBusChecker = () => {
  const [routeList, setRouteList] = useState<RouteOption[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<any>();
  const [routeStopList, setRouteStopList] = useState<RouteStopOption[]>([]);
  const [selectedRouteStop, setSelectedRouteStop] = useState<any>();
  const [routeEta, setRouteEta] = useState([]);
  const [etaResult, setEtaResult] = useState([]);

  const [routeFieldState, setRouteFieldState] = useState({
    selectedKey: "",
    inputValue: "",
    items: [] as RouteOption[],
  });

  const { startsWith } = useFilter({ sensitivity: "base" });

  // init
  useEffect(() => {
    const init = async () => {
      // get route list
      const newRouteList = (await getRouteList()).data;
      // return if route list is empty
      if (!newRouteList || newRouteList.length == 0) {
        return;
      }
      // set value and label to each route
      const labelledRouteList = newRouteList.map((route: Route) => ({
        ...route,
        value: `${route.route}-${route.bound}-${route.service_type}`,
        label: `${route.route} - ${route.orig_tc}->${route.dest_tc} (${route.bound}${route.service_type})`,
      }));
      setRouteList(labelledRouteList);
      // get last route from localstorage
      const lastRouteValue = localStorage.getItem("lastRoute");
      if (!lastRouteValue) {
        setRouteFieldState({ ...routeFieldState, items: labelledRouteList });
      } else {
        const lastRoute = labelledRouteList.find((el: any) => el.value === lastRouteValue);
        if (lastRoute) {
          setSelectedRoute(lastRoute);
          setRouteFieldState({ selectedKey: lastRouteValue ? lastRouteValue : "", inputValue: lastRoute ? lastRoute.label : "", items: labelledRouteList });
        }
      }
    };
    init();
  }, []);

  // update selected route after routeFieldState.selectedKey is updated
  useEffect(() => {
    if (routeFieldState.selectedKey) {
      setSelectedRoute(routeFieldState.items.find((el) => el.value === routeFieldState.selectedKey));
    }
  }, [routeFieldState.selectedKey]);

  // get route stop and eta after selected route
  useEffect(() => {
    if (selectedRoute) {
      fetchRouteStop();
      fetchRouteEta();
    }
  }, [selectedRoute]);

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
        const value = `${index}`;
        const label = `${index + 1} - ${result.name_tc}`;
        return { ...result, seq: index, label, value };
      })
    ).then((list) => {
      setRouteStopList(list);
    });
  };

  const fetchRouteEta = async () => {
    const newRouteEta = (await getRouteEta(selectedRoute.route, selectedRoute.service_type)).data;
    setRouteEta(newRouteEta);
  };

  // get last stop from localstorage
  useEffect(() => {
    // get cached stop
    const lastStop = localStorage.getItem("lastRouteStop");
    if (lastStop
      && routeStopList.length > 0
    ) {
      setSelectedRouteStop(
        routeStopList.find((el: any) => el.value === lastStop)
        || routeStopList[0]
      );
    } else {
      setSelectedRouteStop(routeStopList[0]);
    }
  }, [routeStopList]);

  // show eta result after the stop is selected
  useEffect(() => {
    if (selectedRouteStop && routeEta.length > 0 && selectedRoute) {
      const stopEta = routeEta.filter(
        (el: any) => el.seq === selectedRouteStop.seq && el.dir === selectedRoute.bound
      );
      setEtaResult(stopEta);
    }
  }, [routeEta, selectedRoute, selectedRouteStop]);

  /**
   * Autocomplete Controls
   */
  const onSelectionChange = (key: any, setState: React.Dispatch<React.SetStateAction<any>>, optionList: any) => {
    setState((prevState: any) => {
      let selectedItem = prevState.items.find((option: any) => option.value === key);
      localStorage.setItem("lastRoute", key);
      return {
        inputValue: selectedItem?.label || "",
        selectedKey: key,
        // items: selectedItem?.label ? optionList.filter((item: any) => startsWith(item.label, selectedItem?.label || "")) : [],
        items: optionList.filter((item: any) => startsWith(item.label, selectedItem?.label || "")),
      };
    });
  };

  const onInputChange = (value: any, setState: React.Dispatch<React.SetStateAction<any>>, optionList: any) => {
    setState((prevState: any) => ({
      inputValue: value,
      selectedKey: value === "" ? null : prevState.selectedKey,
      // items: value === "" ? [] : optionList.filter((item: any) => startsWith(item.label, value)),
      items: optionList.filter((item: any) => startsWith(item.label, value)),
    }));
  };

  // Show entire list if user opens the menu manually
  const onOpenChange = (isOpen: any, menuTrigger: any, setState: React.Dispatch<React.SetStateAction<any>>) => {
    if (menuTrigger === "manual" && isOpen) {
      setState((prevState: any) => ({
        inputValue: prevState.inputValue,
        selectedKey: prevState.selectedKey,
        items: [],
      }));
    }
  };

  /**
   * Autocomplete Controls - END
   */

  // routeStop Select Control
  const handleRouteStopSelect = (e: { target: { value: any; }; }) => {
    setSelectedRouteStop(routeStopList.find((el: any) => el.value === e.target.value));
    localStorage.setItem("lastRouteStop", e.target.value);
  };

  // display ETA Part
  const displayETA = () => {
    return (
      <div className="grid gap-2">
        {etaResult.length > 0 ? (
          etaResult.map((el: any) => {
            return (
              <div key={el.eta_seq}>
                {el.eta ? (
                  <div className="text-lg font-semibold">
                    {moment(el.eta).format("HH:mm:ss")} ({moment(el.eta).diff(moment(), "minutes")})
                  </div>
                ) : (
                  <div>No ETA at the moment</div>
                )}
                <div className="text-sm">
                  Last Update: {moment(el.data_timestamp).format("HH:mm:ss")}{" "}
                </div>
              </div>
            );
          })
        ) : (
          <div>No service at the moment</div>
        )}
        <Button variant="ghost" aria-label="refresh" onClick={fetchRouteEta}>
          Refresh
        </Button>
      </div>
    );
  };

  return (
    <>
      <TitleBar title="Hong Kong Bus Checker" />
      <div className="text-center justify-items-center gap-2 grid grid-cols-1">
        <Autocomplete
          isDisabled={routeFieldState.items.length === 0}
          items={routeFieldState.items}
          inputValue={routeFieldState.inputValue}
          label="Route List"
          placeholder="Select a route"
          className="max-w-sm"
          selectedKey={routeFieldState.selectedKey}
          onSelectionChange={(key: Key | null) => onSelectionChange(key, setRouteFieldState, routeList)}
          onInputChange={(value: string) => onInputChange(value, setRouteFieldState, routeList)}
          onOpenChange={(isOpen: boolean, menuTrigger?: MenuTriggerAction) => onOpenChange(isOpen, menuTrigger, setRouteFieldState)}
        >
          {(route: RouteOption) =>
            <AutocompleteItem key={route.value}>
              {route.label}
            </AutocompleteItem>}
        </Autocomplete>

        <Select
          isDisabled={routeStopList.length === 0}
          label="Stop List"
          placeholder="Select a stop"
          className="max-w-sm"
          selectedKeys={[selectedRouteStop?.value]}
          onChange={handleRouteStopSelect}
        >
          {routeStopList.map((routeStop: RouteStopOption) =>
            <SelectItem key={routeStop.value}>
              {routeStop.label}
            </SelectItem>)}
        </Select>

        {selectedRouteStop && routeEta.length > 0 && displayETA()}
      </div>
    </>
  );
};

export default HkBusChecker;