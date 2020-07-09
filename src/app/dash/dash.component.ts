import { Component, HostListener, OnInit } from '@angular/core';
import { IRpmZone, PrndlType, UnitsType } from '../models';

@Component({
  selector: 'app-dash',
  templateUrl: './dash.component.html',
  styleUrls: [ './dash.component.scss' ]
})
export class DashComponent implements OnInit {

  // The values
  rpm: number = 0;
  prndl: PrndlType = 'P';
  speed: number = 0;
  gear: number = 1;
  tirePressure: number[] = [ 36, 36, 36, 36 ];
  units: UnitsType = 'imperial';
  fuelLevel: number = 100;
  fuelDistance: number = 0;
  oilTemp: number = 200;
  oilPressure: number = 28;
  outsideTemp: number = 75;
  totalMileage: number = 0;

  colors: { [key: string]: string } = {
    white: '#ffffff',
    gray: '#cccccc',
    blue1: '#313a57',
    yellow1: '#dab86e',
    yellow2: '#ffc348',
    orange1: '#c37355',
    orange2: '#ef7f58',
    red1: '#fc0f3c',
    red2: '#ee5769',
    green1: '#69bd8a'
  };

  fuelLevelMin: number = 0;
  fuelLevelMax: number = 100;
  fuelBarTicks: number[] = [];
  fuelBarLength = 100;

  tachMax: number = 7000;
  tachRadius: number = 400;
  needleWidth: number = 10;

  tireWidth: number = 10;
  tireHeight: number = 20;
  tireDangerHigh: number = 38;
  tireDangerLow: number = 30;

  oilPressureMin: number = 0;
  oilPressureMax: number = 80;
  oilPressureDanger: number = 10;
  oilPressureBarLength: number = 180;

  oilTempMin: number = 0;
  oilTempMax: number = 300;
  oilTempDanger: number = 280;
  oilTempBarLength: number = 100;
  oilTempTickValues: number[] = [];

  mainTicks: number[] = [];
  midTicks: number[] = [];
  minorTicks: number[] = [];
  zones: IRpmZone[] = [];

  constructor() {
  }

  get fuelBarTickY0() { return 2 * this.meterDimension / 3 - 10; }

  get fuelBarTickY1() { return 2 * this.meterDimension / 3 - 6; }

  get oilPressureBarY0() { return 6 * this.meterDimension / 10 - 5; }

  get percent() { return 100 * this.rpm / this.tachMax; }

  get isInDrive() { return this.prndl === 'D'; }

  get needleRotation() {
    const rot = -this.percent * 270 / 100;
    return `rotate(${ rot }deg)`;
  }

  get meterDimension() { return ( this.tachRadius * 2 ) + 100; }

  get maskDashArray() {
    const meterValue = ( ( this.percent * this.semiCf ) / 100 );
    return `0, ${ this.semiCf - meterValue }, ${ meterValue }, ${ this.cf - this.semiCf }`;
  }

  get cf() { return 2 * Math.PI * this.tachRadius; }

  get semiCf() { return 3 * this.cf / 4.0; }

  get halfDimension() { return this.meterDimension / 2.0; }

  get speedUnits() { return this.isImperial ? 'MPH' : 'KPH'; }

  get distanceUnits() { return this.isImperial ? 'mi' : 'km'; }

  get tempUnits() { return this.isImperial ? 'F' : 'C'; }

  get isImperial() { return ( this.units === 'imperial' ); }

  /**
   * Fuel level x-position
   */
  fuelLevelX(percent: number) {
    const x0 = 4 * this.meterDimension / 5 - 35;
    const x1 = x0 - this.fuelBarLength;
    return ( percent / 100 ) * this.fuelBarLength + x1;
  }

  oilTempBarX(value: number) {
    const x1 = this.meterDimension / 7 + 60;
    const percent = ( value - this.oilTempMin ) / ( this.oilTempMax - this.oilTempMin );
    return percent * this.oilTempBarLength + x1;
  }

  oilPressureBarX(value: number) {
    const x1 = this.halfDimension / 5;
    const percent = ( value - this.oilPressureMin ) / ( this.oilPressureMax - this.oilPressureMin );
    return percent * this.oilPressureBarLength + x1;
  }

  tireXY(i: number) {
    const y0 = 5 * this.halfDimension / 6;
    const x0 = 3 * this.halfDimension / 8;

    const dx = this.tireWidth * 3;
    const dy = this.tireHeight * 2;

    const j = ( i < 2 ) ? i % 2 : ( i + 1 ) % 2;

    const x = -20 + x0 + Math.floor(i / 2) * dx;
    const y = 20 + y0 + j * dy;

    return { x, y };
  }

  tireStatusColor(i: number) {
    if (this.tirePressure[i] < this.tireDangerLow) {
      return this.colors.yellow1;
    }
    return this.colors.green1;
  }

  @HostListener('window:rpm', [ '$event' ]) updateRpm(event) { this.rpm = Math.floor(Math.min(7000, event.detail)); }

  @HostListener('window:speed', [ '$event' ]) updateSpeed(event) { this.speed = Math.floor(event.detail); }

  @HostListener('window:prndl', [ '$event' ]) updatePRNDL(event) { this.prndl = event.detail; }

  @HostListener('window:gear', [ '$event' ]) updateGear(event) { this.gear = Math.floor(event.detail); }

  @HostListener('window:tirePressure', [ '$event' ]) updateTirePressure(event) { this.tirePressure = event.detail; }

  @HostListener('window:units', [ '$event' ]) updateUnits(event) { this.units = event.detail; }

  @HostListener('window:fuelLevel', [ '$event' ]) updateFuelLevel(event) { this.fuelLevel = event.detail; }

  @HostListener('window:fuelDistance', [ '$event' ]) updateFuelDistance(event) { this.fuelDistance = event.detail; }

  @HostListener('window:oilTemp', [ '$event' ]) updateOilTemp(event) { this.oilTemp = event.detail; }

  @HostListener('window:oilPressure', [ '$event' ]) updateOilPressure(event) { this.oilPressure = Math.floor(event.detail); }

  @HostListener('window:totalMileage', [ '$event' ]) updateTotalMileage(event) { this.totalMileage = Math.floor(event.detail); }

  @HostListener('window:outsideTemp', [ '$event' ]) updateOutsideTemp(event) { this.outsideTemp = event.detail; }

  tickRotation(value: number): string {
    const percent = 100 * value / this.tachMax;
    const rot = -percent * 270 / 100;
    return `rotate(${ rot }deg)`;
  }

  radiusCf(percent: number): string {
    const radius = this.tachRadius * percent;

    const cf = 2 * Math.PI * radius;
    const semiCf = 3 * cf / 4.0;

    return `${ semiCf }, ${ cf }`;
  }

  zoneRadiusCf(percent: number, value: number): string {
    const fraction = 1 - value / this.tachMax;
    const radius = this.tachRadius * percent;

    const cf = 2 * Math.PI * radius;
    const semiCf = 3 * cf / 4.0;

    return `${ fraction * semiCf }, ${ cf }`;
  }

  zoneDashArray(value: number = 0): string {
    const fraction = 1 - value / this.tachMax;
    return `${ fraction * this.semiCf }, ${ this.cf }`;
  }

  ngOnInit(): void {
    this.populateZones();
    this.populateTicks();
  }

  tickLabelPosition(tick: number): string {
    const r = 0.73 * this.tachRadius;
    const percent = tick / this.tachMax;
    const theta = Math.PI / 2 + percent * 270 * Math.PI / 180.0;

    const x = r * Math.cos(theta);
    const y = r * Math.sin(theta);

    return `scale(1, -1) translate(${ x }px, ${ y }px)`;
  }

  populateZones(): void {
    this.zones.push({ color: this.colors.blue1, outlineColor: this.colors.white, low: 0 });
    this.zones.push({ color: this.colors.yellow1, outlineColor: this.colors.yellow2, low: 5500 });
    this.zones.push({ color: this.colors.orange1, outlineColor: this.colors.orange2, low: 6000 });
    this.zones.push({ color: this.colors.red1, outlineColor: this.colors.red2, low: 6500 });
  }

  populateTicks(): void {
    for (let i = 0; i <= this.tachMax; i += 100) {
      if (i % 1000 === 0) {
        this.mainTicks.push(i);
      } else if (i % 500 === 0) {
        this.midTicks.push(i);
      } else {
        this.minorTicks.push(i);
      }
    }

    const oilTempRange = this.oilTempMax - this.oilTempMin;
    for (let i = 0; i < 3; i++) {
      this.oilTempTickValues.push(this.oilTempMax - ( i + 1 ) * 0.25 * oilTempRange);
    }

    const fuelLevelRange = this.fuelLevelMax - this.fuelLevelMin;
    for (let i = 0; i < 5; i++) {
      this.fuelBarTicks.push(this.fuelLevelMax - i * 0.25 * fuelLevelRange);
    }
  }

  mainTickColor(tick: number): string {
    const n = this.zones.length;
    return ( tick < this.zones[n - 1].low )
      ? this.colors.white
      : this.colors.red1;
  }

  max(v1: number, v2: number) { return (v1 > v2) ? v1 : v2; }

  min(v1: number, v2: number) { return (v1 < v2) ? v1 : v2; }

}
