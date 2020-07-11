import { Component, HostListener, OnInit } from '@angular/core';
import { IRpmZone, PrimaryTabItemType, PrndlType, SecondaryTabItemType, UnitsType } from '../models';

@Component({
  selector: 'app-dash',
  templateUrl: './dash.component.html',
  styleUrls: [ './dash.component.scss' ]
})
export class DashComponent implements OnInit {
  refreshRate = 1000 / 60;

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
  secondaryTabs: object = {
    tripComputer: {}
  };
  selectedPrimaryTab: PrimaryTabItemType = 'Trip Computer';
  selectedSecondaryTab: SecondaryTabItemType = 'Trip 1';

  selectedPrimaryTabIndex: number = 0;
  previousPrimaryTabIndex: number = 0;
  selectedSecondaryTabIndex: number = 0;
  previousSecondaryTabIndex: number = 0;

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

  leftPeripheralSectionWidth: number = 250;
  leftPeripheralSectionHeight: number = 100;

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
  oilPressureBarY0: number = 65;

  oilTempMin: number = 0;
  oilTempMax: number = 300;
  oilTempDanger: number = 280;
  oilTempBarLength: number = 100;
  oilTempTickValues: number[] = [];

  mainTicks: number[] = [];
  midTicks: number[] = [];
  minorTicks: number[] = [];
  zones: IRpmZone[] = [];

  menuWidth: number = 220;
  menuHeight: number = 160;
  _menuScroll: number = 0;

  menu: any[] = [
    {
      primary: 'Trip Computer',
      key: 'tripComputer',
      secondary: [
        {
          title: 'Trip 1',
          key: 'trip1',
          rows: [
            { type: 'metric', title: 'Distance', value: 0, units: 'dist', decimals: 1 },
            { type: 'metric', title: 'Fuel Economy', value: 0, units: 'econ', decimals: 1 },
            { type: 'metric', title: 'Time', value: 0, units: 'time', decimals: 0 }
          ]
        },
        {
          title: 'Trip 2',
          key: 'trip2',
          rows: [
            { type: 'metric', title: 'Distance', value: 0, units: 'dist', decimals: 1 },
            { type: 'metric', title: 'Fuel Economy', value: 0, units: 'econ', decimals: 1 },
            { type: 'metric', title: 'Time', value: 0, units: 'time', decimals: 0 }
          ]
        }
      ]
    },
    {
      primary: 'Performance',
      key: 'performance',
      secondary: [ 'None' ]
    },
    {
      primary: 'Audio',
      key: 'audio',
      secondary: [ 'None' ]
    },
    {
      primary: 'Maintenance',
      key: 'maintenance',
      secondary: [ 'None' ]
    },
    {
      primary: 'Options',
      key: 'options',
      secondary: [ 'None' ]
    },
    {
      primary: 'Simplify',
      key: 'simplify',
      secondary: [ 'None' ]
    }
  ];
  secondaryTabProgress: number = 0;

  constructor() {
  }

  get menuScroll() { return this._menuScroll; }

  set menuScroll(scroll: number) { this._menuScroll = scroll; }

  get selectedPrimaryTabLabel() { return this.selectedPrimaryTab; }

  get fuelBarTickY0() { return 2 * this.meterDimension / 3 - 10; }

  get fuelBarTickY1() { return 2 * this.meterDimension / 3 - 6; }

  get percent() { return 100 * this.rpm / this.tachMax; }

  get isInDrive() { return this.prndl === 'D'; }

  get needleRotation() {
    const rot = -this.percent * 270 / 100;
    return `rotate(${ rot }deg)`;
  }

  get activeTabSections() {
    try {
      return this.menu.find(x => x.primary === this.selectedPrimaryTab).secondary;
    } catch (e) {
      return [];
    }
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

  get econUnits() { return this.isImperial ? 'mpg' : 'kpl'; }

  get tempUnits() { return this.isImperial ? 'F' : 'C'; }

  get isImperial() { return ( this.units === 'imperial' ); }

  get primaryTabY() { return this.menuY0 - 8; }

  get menuX0() { return 11 * this.halfDimension / 8 - 10; }

  get menuY0() { return 9 * this.halfDimension / 10; }

  get topLeftPeripheralX0() { return this.halfDimension / 7; }

  get topLeftPeripheralY0() { return 12 * this.halfDimension / 15; }

  get bottomLeftPeripheralX0() { return this.halfDimension / 7; }

  get bottomLeftPeripheralY0() { return this.topLeftPeripheralY0 + this.leftPeripheralSectionHeight + 2; }

  toHours(min: number) { return Math.floor(min / 60); }

  toMinuteOfHour(min: number) { return Math.floor(min % 60); }

  tabRows(i: number): any[] {
    return this.activeTabSections[i].rows;
  }

  /**
   * Animation loop for the selected secondary tab.
   */
  secondaryMenuAnimationLoop(): void {
    const speed = 16;

    setInterval(() => {
      if (Math.abs(this.menuScroll - this.selectedSecondaryTabIndex * this.menuHeight) > 1) {
        this.menuScroll += speed * Math.sign(this.secondaryTabProgress);
      } else {
        this.secondaryTabProgress = 0;
      }
    }, this.refreshRate);
  }

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
    const x1 = this.leftPeripheralSectionWidth / 2 - ( this.oilPressureBarLength / 2 );
    const percent = ( value - this.oilPressureMin ) / ( this.oilPressureMax - this.oilPressureMin );
    return percent * this.oilPressureBarLength + x1;
  }

  tireXY(i: number) {
    const y0 = 10;
    const x0 = this.leftPeripheralSectionWidth / 2;

    const dx = this.tireWidth * 3;
    const dy = this.tireHeight * 2;

    const j = ( i < 2 ) ? i % 2 : ( i + 1 ) % 2;

    const x = -20 + x0 + Math.floor(i / 2) * dx;
    const y = 20 + y0 + j * dy;

    return { x, y };
  }

  primaryTabColor(tab: PrimaryTabItemType) {
    return ( tab === this.selectedPrimaryTabLabel ) ? this.colors.white : this.colors.gray;
  }

  primaryTabOpacity(tab: PrimaryTabItemType) {
    return ( tab === this.selectedPrimaryTabLabel ) ? 1.0 : 0.5;
  }

  primaryTabXY(i: number) {
    const padding: number = 2;

    const n: number = this.menu.length;
    const dx: number = this.menuWidth / n;

    const x1 = this.menuX0 + ( i * dx );
    const x2 = x1 + dx - padding;

    return { x1, x2 };
  }

  tireStatusColor(i: number) {
    if (this.tirePressure[i] < this.tireDangerLow) {
      return this.colors.yellow1;
    }
    return this.colors.green1;
  }

  animateSelectedSecondaryTabChange(tab: SecondaryTabItemType): void {
    this.selectedSecondaryTab = tab;
    this.previousSecondaryTabIndex = this.selectedSecondaryTabIndex;
    this.selectedSecondaryTabIndex = this.activeTabSections.findIndex(x => x.title === tab);

    this.secondaryTabProgress = ( this.selectedSecondaryTabIndex - this.previousSecondaryTabIndex ) * this.menuHeight;
  }

  animateSelectedPrimaryTabChange(tab: PrimaryTabItemType): void {
    this.previousPrimaryTabIndex = this.selectedPrimaryTabIndex;
    this.selectedPrimaryTabIndex = this.menu.findIndex(x => x.primary === tab);

    this.previousSecondaryTabIndex = 0;
    this.selectedSecondaryTabIndex = 0;

    this.selectedPrimaryTab = tab;
    this.menuScroll = 0;
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

  @HostListener('window:selectedPrimaryTab', [ '$event' ]) updateSelectedPrimaryTab(event) { this.animateSelectedPrimaryTabChange(event.detail); }

  @HostListener('window:selectedSecondaryTab', [ '$event' ]) updateSelectedSecondaryTab(event) { this.animateSelectedSecondaryTabChange(event.detail); }

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
    this.secondaryMenuAnimationLoop();
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

  max(v1: number, v2: number) { return ( v1 > v2 ) ? v1 : v2; }

  min(v1: number, v2: number) { return ( v1 < v2 ) ? v1 : v2; }

}
