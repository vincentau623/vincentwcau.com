
export interface RouteList {
  type: string,
  version: string,
  generated_timestamp: string,
  data: [
    {
      route: string,
      bound: string,
      service_type: string,
      orig_en: string,
      orig_tc: string,
      orig_sc: string,
      dest_en: string,
      dest_tc: string,
      dest_sc: string,
    },
  ],
}
