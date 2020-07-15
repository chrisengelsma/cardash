import { CardinalDirectionType, GearType, PrimaryTabItemType, RadioFrequencyType, SecondaryTabItemType, UnitType } from './types';

export interface IMenuOption {
  key?: PrimaryTabItemType;
  primary?: string;
  secondary?: {
    key?: string;
    title?: string;
    headers?: string[];
    type?: string;
    rows?: {
      type?: string;
      key?: string;
      title?: string;
      value?: any;
      units?: string;
      decimals?: number;
    }[]
  }[];
}

export interface IRpmZone {
  color?: string;
  low?: number;
  outlineColor?: string;
}

export interface IDashboardData {
  rpm?: number;
  gear?: GearType;
  gearNumber?: number;
  speed?: number;
  unit?: UnitType;
  fuelLevel?: number;
  fuelDistance?: number;
  oilTemp?: number;
  outsideTemp?: number;
  tirePressure?: number[];
  totalMileage?: number;
  oilPressure?: number;
  selectedPrimaryTab?: string;
  selectedSecondaryTab?: string;
  compass?: CardinalDirectionType;
  gforce?: number[];
  maintenance: {
    oil?: number;
    transmissionFluid?: number;
    revs?: number;
    hours?: number;
    idleHours?: number;
  };
  indicators: {
    headlights?: boolean;
    autoHeadlights?: boolean;
    externalLights?: boolean;
    highBeam?: boolean;
    leftTurn?: boolean;
    rightTurn?: boolean;
    battery?: boolean;
    oilPressure?: boolean;
    doorAjar?: boolean;
    mil?: boolean;
  };
  tripComputer?: {
    trip1?: {
      distance?: number;
      time?: number;
      fuelEconomy?: number;
    }
  };

  audio?: {
    wave?: RadioFrequencyType;
    station?: number;
  };

  performance: {
    timer?: {
      startSpeed?: number;
      stopSpeed?: number;
      time?: number;
    }
  };
}

declare global {
  interface Window {
    rpm?: number;
    gear?: GearType;
    gearNumber?: number;
    speed?: number;
    unit?: UnitType;
    fuelLevel?: number;
    fuelDistance?: number;
    oilTemp?: number;
    outsideTemp?: number;
    tirePressure?: number[];
    totalMileage?: number;
    oilPressure?: number;
    selectedPrimaryTab?: string;
    selectedSecondaryTab?: string;
    compass?: CardinalDirectionType;
    gforce?: number[];
    maintenance: {
      oil?: number;
      transmissionFluid?: number;
      revs?: number;
      hours?: number;
      idleHours?: number;
    };
    indicators: {
      headlights?: boolean;
      autoHeadlights?: boolean;
      externalLights?: boolean;
      highBeam?: boolean;
      leftTurn?: boolean;
      rightTurn?: boolean;
      battery?: boolean;
      oilPressure?: boolean;
      doorAjar?: boolean;
      mil?: boolean;
    };
    tripComputer?: {
      trip1?: {
        distance?: number;
        time?: number;
        fuelEconomy?: number;
      }
    };

    audio?: {
      wave?: RadioFrequencyType;
      station?: number;
    };

    performance: {
      timer?: {
        startSpeed?: number;
        stopSpeed?: number;
        time?: number;
      }

      // For compatibility.
      navigation: any;
      onresourcetimingbufferfull: any;
      timeOrigin: any;
      timing: any;
      clearMarks: any;
      clearMeasures: any;
      clearResourceTimings: any;
      getEntries: any;
      getEntriesByName: any;
      getEntriesByType: any;
      mark: any;
      measure: any;
      now: any;
      setResourceTimingBufferSize: any;
      toJSON: any;
      addEventListener: any;
      removeEventListener: any;
      dispatchEvent: any;
    };

  }
}
