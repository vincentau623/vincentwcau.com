import { parseXml, xml2json } from './xml2json';

export const getHKRoadNetwork = async () => {
  return await fetch(``)
};

export const getHKTrafficData = async () => {
  return await fetch(`https://resource.data.one.gov.hk/td/traffic-detectors/irnAvgSpeed-all.xml`)
    .then((res) => res.text())
    .then((res) => JSON.parse(xml2json(parseXml(res), '')));
};