import { Component, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { IRpmZone, PrndlType, UnitsType } from '../models';

@Component({
  selector: 'app-dash',
  templateUrl: './dash.component.html',
  styleUrls: [ './dash.component.scss' ]
})
export class DashComponent implements OnInit, OnDestroy {

  rpm: number = 0;
  prndl: PrndlType = 'P';
  speed: number = 0;
  gear: number = 1;
  tirePressure: number[] = [ 30, 30, 30, 30 ];
  units: UnitsType = 'imperial';
  debug: boolean = false;
  fuelLevel: number = 0;

  @Input() max: number = 7000;
  @Input() radius: number = 400;
  @Input() needleWidth: number = 10;

  mainTicks: number[] = [];
  midTicks: number[] = [];
  minorTicks: number[] = [];
  zones: IRpmZone[] = [];

  constructor() {
  }

  get percent() {
    return 100 * this.rpm / this.max;
  }

  get isInDrive() {
    return this.prndl === 'D';
  }

  get needleRotation() {
    const rot = -this.percent * 270 / 100;
    return `rotate(${ rot }deg)`;
  }

  get meterDimension() {
    return ( this.radius * 2 ) + 100;
  }

  get maskDashArray() {
    const meterValue = ( ( this.percent * this.semiCf ) / 100 );
    return `0, ${ this.semiCf - meterValue }, ${ meterValue }, ${ this.cf - this.semiCf }`;
  }

  get cf() { return 2 * Math.PI * this.radius; }

  get semiCf() { return 3 * this.cf / 4.0; }

  get halfDimension() {
    return this.meterDimension / 2.0;
  }

  get speedUnits() {
    return this.isImperial ? 'MPH' : 'KPH';
  }

  get isImperial() {
    return ( this.units === 'imperial' );
  }

  @HostListener('window:rpm', [ '$event' ]) updateRpm(event) { this.rpm = Math.floor(Math.min(7000, event.detail)); }

  @HostListener('window:speed', [ '$event' ]) updateSpeed(event) { this.speed = Math.floor(event.detail); }

  @HostListener('window:prndl', [ '$event' ]) updatePRNDL(event) { this.prndl = event.detail; }

  @HostListener('window:gear', [ '$event' ]) updateGear(event) { this.gear = Math.floor(event.detail); }

  @HostListener('window:tirePressure', [ '$event' ]) updateTirePressure(event) { this.tirePressure = event.detail; }

  @HostListener('window:units', [ '$event' ]) updateUnits(event) { this.units = event.detail; }

  @HostListener('window:fuelLevel', [ '$event' ]) updateFuelLevel(event) { this.fuelLevel = event.detail; }

  tickRotation(value: number): string {
    const percent = 100 * value / this.max;
    const rot = -percent * 270 / 100;
    return `rotate(${ rot }deg)`;
  }

  radiusCf(percent: number): string {
    const radius = this.radius * percent;

    const cf = 2 * Math.PI * radius;
    const semiCf = 3 * cf / 4.0;

    return `${ semiCf }, ${ cf }`;
  }

  zoneRadiusCf(percent: number, value: number): string {
    const fraction = 1 - value / this.max;
    const radius = this.radius * percent;

    const cf = 2 * Math.PI * radius;
    const semiCf = 3 * cf / 4.0;

    return `${ fraction * semiCf }, ${ cf }`;
  }

  zoneDashArray(value: number = 0): string {
    const fraction = 1 - value / this.max;
    return `${ fraction * this.semiCf }, ${ this.cf }`;
  }

  ngOnDestroy(): void {
  }

  ngOnInit(): void {
    this.populateZones();
    this.populateTicks();
  }

  tickLabelPosition(tick: number): string {
    const r = 0.73 * this.radius;
    const percent = tick / this.max;
    const theta = Math.PI / 2 + percent * 270 * Math.PI / 180.0;

    const x = r * Math.cos(theta);
    const y = r * Math.sin(theta);

    return `scale(1, -1) translate(${ x }px, ${ y }px)`;
  }

  populateZones(): void {
    this.zones.push({ color: '#313a57', outlineColor: '#ffffff', low: 0 });
    this.zones.push({ color: '#dab86e', outlineColor: '#ffc348', low: 5500 });
    this.zones.push({ color: '#c37355', outlineColor: '#ef7f58', low: 6000 });
    this.zones.push({ color: '#fc0f3c', outlineColor: '#ee5769', low: 6500 });
  }

  populateTicks(): void {
    for (let i = 0; i <= this.max; i += 100) {
      if (i % 1000 === 0) {
        this.mainTicks.push(i);
      } else if (i % 500 === 0) {
        this.midTicks.push(i);
      } else {
        this.minorTicks.push(i);
      }
    }
  }

  mainTickColor(tick: number): string {
    const n = this.zones.length;
    return ( tick < this.zones[n - 1].low )
      ? '#ffffff'
      : '#e91e41';
  }


}
