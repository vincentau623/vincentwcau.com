
export interface RouteListResponse {
  type: string;
  version: string;
  generated_timestamp: string;
  data: [Route];
}

export interface Route {
  route: string;
  bound: string;
  service_type: string;
  orig_en: string;
  orig_tc: string;
  orig_sc: string;
  dest_en: string;
  dest_tc: string;
  dest_sc: string;
}

export interface RouteOption extends Route {
  value: string;
  label: string;
}

export interface RouteStopListResponse {
  type: string;
  version: string;
  generated_timestamp: string;
  data: [RouteStop];
}

export interface RouteStop {
  route: string;
  bound: string;
  service_type: string;
  seq: string;
  stop: string;
}

export interface RouteStopOption extends RouteStop {
  value: string;
  label: string;
}

export interface ETAListResponse {
  type: string;
  version: string;
  generated_timestamp: string;
  data: ETA;
}

export interface ETA {
  stop: string;
  name_en: string;
  name_tc: string;
  name_sc: string;
  lat: string;
  long: string;
}