import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { PrndlType, UnitsType } from '../../models';

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

  private _rpm: BehaviorSubject<number>;
  private _prndl: BehaviorSubject<PrndlType>;
  private _speed: BehaviorSubject<number>;
  private _gear: BehaviorSubject<number>;
  private _units: BehaviorSubject<UnitsType>;
  private _debug: BehaviorSubject<boolean>;

  private _dataStore: {
    rpm: number,
    prndl: PrndlType,
    speed: number,
    gear: number,
    units: UnitsType,
    debug: boolean,
  };

  constructor() {
    this._dataStore = {
      rpm: 0,
      prndl: 'P',
      speed: 0,
      gear: 1,
      units: 'Imperial',
      debug: false,
    };

    this._rpm = new BehaviorSubject(0) as BehaviorSubject<number>;
    this._prndl = new BehaviorSubject('P') as BehaviorSubject<PrndlType>;
    this._speed = new BehaviorSubject(0) as BehaviorSubject<number>;
    this._gear = new BehaviorSubject(1) as BehaviorSubject<number>;
    this._units = new BehaviorSubject('Imperial') as BehaviorSubject<UnitsType>;
    this._debug = new BehaviorSubject(false) as BehaviorSubject<boolean>;

    this.rpm$ = this._rpm.asObservable();
    this.prndl$ = this._prndl.asObservable();
    this.speed$ = this._speed.asObservable();
    this.gear$ = this._gear.asObservable();
    this.units$ = this._units.asObservable();
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
}
