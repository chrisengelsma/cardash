import { PrimaryTabItemType, PrndlType, SecondaryTabItemType, UnitsType } from './types';

export interface IMenuOption {
  primary?: PrimaryTabItemType;
  key?: string;
  secondary?: {
    title?: SecondaryTabItemType;
    key?: string;
    rows?: {
      type?: string;
      title?: string;
      value?: any;
      units?: string;
      decimals?: number;
    }[]
  }[];
}

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
    fuelDistance?: number;
    oilTemp?: number;
    outsideTemp?: number;
    tirePressure?: number[];
    totalMileage?: number;
    oilPressure?: number;
    selectedPrimaryTab?: PrimaryTabItemType;
    selectedSecondaryTab?: string;
    highBeam?: boolean;
    headlamp?: boolean;
    autoHeadlamp?: boolean;
    externalLamp?: boolean;
    leftIndicator?: boolean;
    rightIndicator?: boolean;
    compass?: boolean;
    tripComputer?: {
      trip1?: ITrip;
      trip2?: ITrip;
    };
  }
}
