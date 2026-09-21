export type Reading = {
  temp: number;
  time: string;
};

type Station = {
  name: string;
  readings: Reading[];
};

export function readingsOutsideRange(station: Station, min: number, max: number) {
  return station.readings.filter((r) => r.temp < min || r.temp > max);
}
