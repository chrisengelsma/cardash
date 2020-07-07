import { PrndlType, UnitsType } from './types';

export interface IDashboardData {
  debug?: boolean;
  tirePressure?: number[];
  tireStatus?: string;
  oilPressure?: number;
  oilTemperature?: number;
  mileage?: number;
  gear?: number;
  prndl?: PrndlType;
  rpm?: number;
  speed?: number;
  units?: UnitsType;
  fuel?: number;
  milesRemaining?: number;
}

export interface IRpmZone {
  color: string;
  low: number;
  outlineColor: string;
}

declare global {
  interface Window { Dashboard: any; }
}
