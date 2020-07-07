import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IDashboardData, PrndlType, UnitsType } from '../../models';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  rpm$: Observable<number>;
  prndl$: Observable<PrndlType>;
  speed$: Observable<number>;
  gear$: Observable<number>;
  units$: Observable<UnitsType>;
  debug$: Observable<boolean>;
  tirePressure$: Observable<number[]>;
  dataMap$: Observable<{ [key: string]: any }>;

  private _rpm: BehaviorSubject<number>;
  private _prndl: BehaviorSubject<PrndlType>;
  private _speed: BehaviorSubject<number>;
  private _gear: BehaviorSubject<number>;
  private _units: BehaviorSubject<UnitsType>;
  private _debug: BehaviorSubject<boolean>;
  private _tirePressure: BehaviorSubject<number[]>;

  private _dataMap: BehaviorSubject<{ [key: string]: any }>;

  private readonly _dataStore: IDashboardData;

  constructor() {
    this._dataStore = {
      debug: false,
      rpm: 0,
      prndl: 'P',
      speed: 0,
      gear: 1,
      tirePressure: [ 30, 30, 30, 30 ],
      units: 'Imperial',
    };

    this._dataMap = new BehaviorSubject({}) as BehaviorSubject<{ [key: string]: any }>;
    this._rpm = new BehaviorSubject(this._dataStore.rpm) as BehaviorSubject<number>;
    this._prndl = new BehaviorSubject(this._dataStore.prndl) as BehaviorSubject<PrndlType>;
    this._speed = new BehaviorSubject(this._dataStore.speed) as BehaviorSubject<number>;
    this._gear = new BehaviorSubject(this._dataStore.gear) as BehaviorSubject<number>;
    this._units = new BehaviorSubject(this._dataStore.units) as BehaviorSubject<UnitsType>;
    this._tirePressure = new BehaviorSubject(this._dataStore.tirePressure) as BehaviorSubject<number[]>;
    this._debug = new BehaviorSubject(this._dataStore.debug) as BehaviorSubject<boolean>;

    this.dataMap$ = this._dataMap.asObservable();
    this.rpm$ = this._rpm.asObservable();
    this.prndl$ = this._prndl.asObservable();
    this.speed$ = this._speed.asObservable();
    this.gear$ = this._gear.asObservable();
    this.units$ = this._units.asObservable();
    this.tirePressure$ = this._tirePressure.asObservable();

    this.debug$ = this._debug.asObservable();

  }

  set rpm(rpm: number) {
    this._dataStore.rpm = rpm;
    this._rpm.next(Object.assign({}, this._dataStore).rpm);
  }

  set prndl(prndl: PrndlType) {
    this._dataStore.prndl = prndl;
    this._prndl.next(Object.assign({}, this._dataStore).prndl);
  }

  set speed(speed: number) {
    this._dataStore.speed = speed;
    this._speed.next(Object.assign({}, this._dataStore).speed);
  }

  set gear(gear: number) {
    this._dataStore.gear = gear;
    this._gear.next(Object.assign({}, this._dataStore).gear);
  }

  set units(units: UnitsType) {
    this._dataStore.units = units;
    this._units.next(Object.assign({}, this._dataStore).units);
  }

  set debug(debug: boolean) {
    this._dataStore.debug = debug;
    this._debug.next(Object.assign({}, this._dataStore).debug);
  }

  set tirePressure(tirePresure: number[]) {
    this._dataStore.tirePressure = tirePresure;
    this._tirePressure.next(Object.assign({}, this._dataStore).tirePressure);
  }
}
