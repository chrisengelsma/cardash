import { PrimaryTabItemType, PrndlType, UnitsType } from './types';

export interface ITrip {
  distance?: number;
  speed?: number;
  fuelEconomy?: number;
}

export interface IRpmZone {
  color?: string;
  low?: number;
  outlineColor?: string;
}

declare global {
  interface Window {
    rpm?: number;
    prndl?: PrndlType;
    gear?: number;
    speed?: number;
    units?: UnitsType;
    fuelLevel?: number;
    temp?: number;
    tirePressure?: number[];
    totalMileage?: number;
    oilPressure?: number;
    selectedPrimaryTab?: PrimaryTabItemType;
    selectedSecondaryTab?: string;
    tripComputer?: {
      trip1?: ITrip;
      trip2?: ITrip;
    };
  }
}
