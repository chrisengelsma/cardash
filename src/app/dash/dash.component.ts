import { Component, OnDestroy, OnInit } from '@angular/core';
import { IDashboardData, IMenuOption, IRpmZone } from '../models';

export function int(v: number): number { return Math.floor(v); }

@Component({
  selector: 'app-dash',
  templateUrl: './dash.component.html',
  styleUrls: [ './dash.component.scss' ]
})
export class DashComponent implements OnInit, OnDestroy {
  fps = 60;
  refreshRate: number = 1000 / this.fps;
  interval: number;
  blinkInterval: number;
  blinkOn: boolean = false;
  isInSubMenu: boolean = false;
  selectedSubMenu: string = '';

  lastSecondaryScrollClickTimestamp: Date = new Date();
  scrollbarOpacity: number = 0.0;
  menuScrollGapHeight: number = 2.0;

  ////////////////////////////////////////////////////////////////////////////
  // Window objects

  data: IDashboardData = {
    rpm: 0,
    gear: 'P',
    speed: 0,
    gearNumber: 1,
    tirePressure: [ 36, 36, 36, 36 ],
    unit: 'imperial',
    fuelLevel: 100,
    fuelDistance: 0,
    oilTemp: 200,
    oilPressure: 28,
    outsideTemp: 75,
    gforce: [ 0.0, 0.0 ],
    totalMileage: 0,
    compass: 'N',
    indicators: {
      externalLights: false,
      leftTurn: false,
      rightTurn: false,
      mil: false,
      headlights: false,
      autoHeadlights: false,
      highBeam: false,
      battery: false,
      doorAjar: false,
      oilPressure: false,
    },
    tripComputer: {
      trip1: {
        distance: 0,
        time: 0,
        fuelEconomy: 0,
      }
    },
    performance: {
      timer: {
        startSpeed: 0,
        stopSpeed: 0,
        time: 2300,
      },
    },
    audio: {
      wave: 'fm',
      station: 89.1,
      artist: '',
      song: '',
      album: '',
    },
    maintenance: {
      oil: 100,
      transmissionFluid: 100,
      revs: 0,
      hours: 0,
      idleHours: 0,
    },
    selectedPrimaryTab: 'tripComputer',
    selectedSecondaryTab: 'trip1',
    selectedOption: 'displayDesign'
  };

  ////////////////////////////////////////////////////////////////////////////
  // Menu indices

  selectedPrimaryTabIndex: number = 0;
  previousPrimaryTabIndex: number = 0;
  selectedSecondaryTabIndex: number = 0;
  previousSecondaryTabIndex: number = 0;

  selectedOptionIndex: number = 0;
  previousOptionIndex: number = 0;

  ////////////////////////////////////////////////////////////////////////////
  // Colors

  colors: { [key: string]: string } = {
    white: '#ffffff',
    gray: '#cccccc',
    blue1: '#313a57',
    yellow1: '#9f8751',
    yellow2: '#ffc348',
    orange1: '#7c4a37',
    orange2: '#ef7f58',
    red1: '#be0b2d',
    red2: '#f11d36',
    green1: '#69bd8a'
  };

  menuIcons: string[] = [
    './assets/glyphs/info-circle.svg',
    './assets/glyphs/tachometer-alt.svg',
    './assets/glyphs/music.svg',
    './assets/glyphs/wrench.svg',
    './assets/glyphs/list.svg',
    '',
  ];
  ////////////////////////////////////////////////////////////////////////////
  // Relative Measurements and Restrictions

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

  indicatorWidth: number = 200;
  indicatorHeight: number = 30;

  ////////////////////////////////////////////////////////////////////////////
  // The menu layout

  menu: IMenuOption[] = [
    {
      key: 'tripComputer',
      primary: 'Trip Computer',
      secondary: [
        {
          key: 'trip1',
          title: 'Trip 1',
          type: 'rows',
          rows: [
            { type: 'metric', key: 'tripComputer.trip1.distance', title: 'Distance', units: 'dist', decimals: 1 },
            { type: 'metric', key: 'tripComputer.trip1.fuelEconomy', title: 'Fuel Economy', units: 'econ', decimals: 1 },
            { type: 'metric', key: 'tripComputer.trip1.time', title: 'Time', units: 'time', decimals: 0 }
          ]
        }
      ]
    },
    {
      key: 'performance',
      primary: 'Performance',
      secondary: [
        {
          key: 'gforce',
          type: 'frictionCircle',
        },
        {
          key: 'performanceTimer',
          type: 'header',
          title: 'Performance Timer',
        },
        {
          key: 'lapTimer',
          type: 'header',
          title: 'Lap Timer',
          headers: [ 'Configure (PDR)', 'to Start Lap Timer' ],
        }
      ]
    },
    {
      key: 'audio',
      primary: 'Audio',
      secondary: [
        {
          key: 'audio',
          type: 'audio',
        }
      ]
    },
    {
      key: 'maintenance',
      primary: 'Maintenance',
      secondary: [
        {
          key: 'fluidLife',
          title: 'Oil & Fluid Life',
          type: 'rows',
          rows: [
            { type: 'metric', key: 'maintenance.oil', title: 'Engine Oil', units: 'percent', decimals: 0 },
            { type: 'metric', key: 'maintenance.transmissionFluid', title: 'Transmission Fluid', units: 'percent', decimals: 0 },
          ]
        },
        {
          key: 'engineLife',
          title: 'Engine Life',
          type: 'rows',
          rows: [
            { type: 'metric', key: 'maintenance.revs', title: 'Rev\'s/10,000', units: 'none', decimals: 0 },
            { type: 'metric', key: 'maintenance.hours', title: 'Hours', units: 'none', decimals: 1 },
            { type: 'metric', key: 'maintenance.idleHours', title: 'Idle Hours', units: 'none', decimals: 1 },
          ]
        }
      ]
    },
    {
      key: 'options',
      primary: 'Options',
      secondary: [
        {
          key: 'options',
          type: 'menu',
          rows: [
            { type: 'menuOption', key: 'displayDesign', title: 'Display Design' },
            { type: 'menuOption', key: 'infoTiles', title: 'Info Tiles Selection' },
            { type: 'menuOption', key: 'units', title: 'Units' },
            { type: 'menuOption', key: 'softwareInfo', title: 'Software Info' },
          ]
        }
      ]
    },
    {
      key: 'simplify',
      primary: 'Simplify',
      secondary: [
        {
          key: 'simplify',
          type: 'header',
          headers: [ 'Press Center Button', 'to Simplify Display' ],
        }
      ]
    }
  ];

  subMenu: IMenuOption[] = [
    {
      key: 'softwareInfo',
      secondary: [
        {
          key: 'softwareInfo',
          type: 'header',
          title: 'Software Info',
          headers: [ 'Nothing to see', 'here yet' ],
        }
      ]
    },
    {
      key: 'displayDesign',
      secondary: [
        {
          key: 'displayDesign',
          type: 'header',
          title: 'Display Design',
          headers: [ 'Nothing to see', 'here yet' ]
        }
      ]
    },
    {
      key: 'infoTiles',
      secondary: [
        {
          key: 'infoTiles',
          type: 'header',
          title: 'Info Tiles',
          headers: [ 'Nothing to see', 'here yet' ]
        }
      ]
    },
  ];

  secondaryTabProgress: number = 0;

  constructor() {
    for (const key of Object.keys(this.data)) {
      window[key] = this.data[key];
    }
  }

  get menuScrollX0() { return this.menuX0 + this.menuWidth + 4; }

  get menuScrollY0() { return this.menuY0; }

  get menuScrollDashArray() {
    return `${ this.menuScrollSectionHeight }, ${ this.menuScrollGapHeight }`;
  }

  get menuScrollY() {
    const numGaps = this.numSecondarySections - 1;
    return this.selectedSecondaryTabIndex * (this.menuScrollSectionHeight + numGaps);
  }

  get numSecondarySections() {
    return this.menu[this.selectedPrimaryTabIndex].secondary.length;
  }

  get menuScrollSectionHeight() {
    const numGaps = this.numSecondarySections - 1;
    return ( this.menuHeight - ( numGaps * this.menuScrollGapHeight ) ) / this.numSecondarySections;
  }

  get menuScroll() { return this._menuScroll; }

  set menuScroll(scroll: number) { this._menuScroll = scroll; }

  get selectedPrimaryTabLabel() { return this.menu.find(x => x.key === this.data.selectedPrimaryTab).primary; }

  get fuelBarTickY0() { return 2 * this.meterDimension / 3 - 10; }

  get fuelBarTickY1() { return 2 * this.meterDimension / 3 - 6; }

  get percent() { return 100 * this.data.rpm / this.tachMax; }

  get isInGear() { return this.data.gear === 'D' || this.data.gear === 'M'; }

  get isInDrive() { return this.data.gear === 'D'; }

  get frictionCircleRadius() { return 2 * this.menuHeight / 7; }

  get frictionCircleOuterRadius() { return this.frictionCircleRadius + 12; }

  get frictionCircleOuterCf() { return 2 * Math.PI * this.frictionCircleOuterRadius; }

  get frictionCircleDashArray() {
    return `${ this.frictionCircleOuterCf / 12 }, ${ this.frictionCircleOuterCf / 3 }, ${ this.frictionCircleOuterCf / 6 }, ${ this.frictionCircleOuterCf / 3 }`;
  }

  get gForceXY() {
    const sign = Math.sign(this.data.gforce[0]);

    let x = this.frictionCircleRadius * this.data.gforce[0];
    let y = this.frictionCircleRadius * -this.data.gforce[1];

    if (this.data.gforce[0] === 0) { return { x: 0, y: this.frictionCircleRadius * -this.data.gforce[1] }; }

    const r = Math.min(this.frictionCircleRadius, Math.sqrt(x * x + y * y));
    const theta = Math.atan(y / x);

    x = sign * r * Math.cos(theta);
    y = sign * r * Math.sin(theta);

    return { x, y };
  }

  get needleRotation() {
    const rot = -this.percent * 270 / 100;
    return `rotate(${ rot }deg)`;
  }

  get activeTabSections() {
    let result = [];
    try {
      if (this.isInSubMenu) {
        const sub = this.subMenu.find(x => x.key === this.selectedSubMenu);
        if (sub) {
          result = sub.secondary;
        } else {
          this.isInSubMenu = false;
          this.selectedSubMenu = '';
        }
      }
      if (!this.isInSubMenu) {
        result = this.menu.find(x => x.key === this.data.selectedPrimaryTab).secondary;
      }
      return result;
    } catch (e) {
      return [];
    }
  }

  get meterDimension() { return ( this.tachRadius * 2 ) + 100; }

  get maskDashArray() {
    const meterValue = ( ( this.percent * this.semiCf ) / 100 );

    // This fills in the current RPM
    // return `0, ${ this.semiCf - meterValue }, ${ meterValue }, ${ this.cf - this.semiCf }`;

    // This fills in the remaining RPM
    return `${ this.semiCf - meterValue }, ${ meterValue }, 0, ${ this.cf - this.semiCf }`;
  }

  get indicatorY0() { return this.meterDimension / 3; }

  get cf() { return 2 * Math.PI * this.tachRadius; }

  get semiCf() { return 3 * this.cf / 4.0; }

  get halfDimension() { return this.meterDimension / 2.0; }

  get speedUnits() { return this.isImperial ? 'MPH' : 'KPH'; }

  get distanceUnits() { return this.isImperial ? 'mi' : 'km'; }

  get econUnits() { return this.isImperial ? 'mpg' : 'kpl'; }

  get tempUnits() { return this.isImperial ? 'F' : 'C'; }

  get isImperial() { return ( this.data.unit === 'imperial' ); }

  get primaryTabY() { return this.menuY0 - 8; }

  get menuX0() { return 11 * this.halfDimension / 8 - 10; }

  get menuY0() { return 9 * this.halfDimension / 10; }

  get topLeftPeripheralX0() { return this.halfDimension / 7; }

  get topLeftPeripheralY0() { return 12 * this.halfDimension / 15; }

  get bottomLeftPeripheralX0() { return this.halfDimension / 7; }

  get bottomLeftPeripheralY0() { return this.topLeftPeripheralY0 + this.leftPeripheralSectionHeight + 2; }

  ngOnDestroy(): void {
    if (typeof this.interval !== 'undefined') {
      window.clearInterval(this.interval);
    }
    if (typeof this.blinkInterval !== 'undefined') {
      window.clearInterval(this.blinkInterval);
    }
  }

  switchUnits(): void {
    window.unit = ( window.unit === 'imperial' ) ? 'metric' : 'imperial';
  }

  activateOptionsMenu(): void {
    switch (this.selectedOptionIndex) {
      case 0: // Display Design
        this.isInSubMenu = true;
        this.selectedSubMenu = 'displayDesign';
        break;
      case 1: // Info Tiles Select
        this.isInSubMenu = true;
        this.selectedSubMenu = 'infoTiles';
        break;
      case 2: // Units
        this.switchUnits();
        break;
      case 3: // Software Version
        this.isInSubMenu = true;
        this.selectedSubMenu = 'softwareInfo';
        break;
      default:
    }
  }

  onCenterButtonClicked(event: any): void {
    switch (this.selectedPrimaryTabIndex) {
      case 4:
        this.activateOptionsMenu();
        break;
      default:
        return;
    }
  }

  isCurrentMenuOption(index: number): boolean {
    return this.selectedOptionIndex === index;
  }

  toHours(min: number) { return int(min / 60); }

  toMinuteOfHour(min: number) { return int(min % 60); }

  tabRows(i: number): any[] {
    return this.activeTabSections[i].rows;
  }

  secondsSince(date: Date): number {
    return Math.round(( new Date() ).getTime() - date.getTime()) / 1000;
  }

  watchLoop(): void {
    const speed = 16;

    this.blinkInterval = window.setInterval(() => {
      this.blinkOn = !this.blinkOn;
    }, 400);

    this.interval = window.setInterval(() => {
      this.data.rpm = Math.max(this.min(this.tachMax, window.rpm));
      this.data.gear = window.gear;
      this.data.speed = window.speed;
      this.data.gearNumber = window.gearNumber;
      this.data.tirePressure = window.tirePressure;
      this.data.unit = window.unit;
      this.data.fuelLevel = window.fuelLevel;
      this.data.fuelDistance = window.fuelDistance;
      this.data.oilTemp = window.oilTemp;
      this.data.oilPressure = window.oilPressure;
      this.data.outsideTemp = window.outsideTemp;
      this.data.gforce = window.gforce;
      this.data.totalMileage = window.totalMileage;
      this.data.indicators = window.indicators;
      this.data.compass = window.compass;
      this.data.tripComputer = window.tripComputer;
      this.data.performance = window.performance;
      this.data.audio = window.audio;
      this.data.maintenance = window.maintenance;


      // For the scroll bar
      if (window.selectedPrimaryTab === this.data.selectedPrimaryTab && window.selectedSecondaryTab !== this.data.selectedSecondaryTab) {
        this.lastSecondaryScrollClickTimestamp = new Date();
      }

      if (window.selectedPrimaryTab === 'options' && window.selectedOption !== this.data.selectedOption) {
        this.animateOptionsChange(window.selectedOption);
      }

      if (window.selectedPrimaryTab !== 'options' && window.selectedSecondaryTab !== this.data.selectedSecondaryTab) {
        this.animateSelectedSecondaryTabChange(window.selectedSecondaryTab);
      }

      if (window.selectedPrimaryTab !== this.data.selectedPrimaryTab) {
        this.animateSelectedPrimaryTabChange(window.selectedPrimaryTab);
      }

      ///////////////////////////////////////////////////////////////////////
      // Animations

      // For the scrollbar opacity, start fading at a second
      if (this.secondsSince(this.lastSecondaryScrollClickTimestamp) > 1.0) {
        this.scrollbarOpacity = Math.max(0.0, this.scrollbarOpacity - 0.05);
      } else {
        this.scrollbarOpacity = 1.0;
      }

      if (Math.abs(this.menuScroll - this.selectedSecondaryTabIndex * this.menuHeight) > 1) {
        this.menuScroll += speed * Math.sign(this.secondaryTabProgress);
      } else {
        this.secondaryTabProgress = 0;
      }

    }, this.refreshRate);
  }

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

    const x = -20 + x0 + int(i / 2) * dx;
    const y = 20 + y0 + j * dy;

    return { x, y };
  }

  primaryTabColor(tab) {
    return ( tab === this.menu.find(x => x.key === this.data.selectedPrimaryTab).key ) ? this.colors.white : this.colors.gray;
  }

  primaryTabOpacity(tab) {
    return ( tab === this.menu.find(x => x.key === this.data.selectedPrimaryTab).key ) ? 1.0 : 0.5;
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
    if (this.data.tirePressure[i] < this.tireDangerLow) {
      return this.colors.yellow1;
    }
    return this.colors.green1;
  }

  animateSelectedSecondaryTabChange(tab: string): void {
    if (!this.isInSubMenu) {

      this.data.selectedSecondaryTab = tab;
      this.previousSecondaryTabIndex = this.selectedSecondaryTabIndex;

      this.selectedSecondaryTabIndex = this.activeTabSections.findIndex(x => x.key === tab);

      this.secondaryTabProgress = ( this.selectedSecondaryTabIndex - this.previousSecondaryTabIndex ) * this.menuHeight;
    }
  }

  animateOptionsChange(option: string): void {
    if (!this.isInSubMenu) {
      this.data.selectedOption = option;
      this.previousOptionIndex = this.selectedOptionIndex;
      this.selectedOptionIndex = this.activeTabSections[0].rows.findIndex(x => x.key === option);
    }
  }

  animateSelectedPrimaryTabChange(tab: string): void {
    this.previousPrimaryTabIndex = this.selectedPrimaryTabIndex;
    this.selectedPrimaryTabIndex = this.menu.findIndex(x => x.key === tab);

    this.isInSubMenu = false;
    this.selectedSubMenu = '';

    this.data.selectedPrimaryTab = tab;

    window.selectedSecondaryTab = this.data.selectedSecondaryTab = this.menu[this.selectedPrimaryTabIndex].secondary[0].key;
    this.previousSecondaryTabIndex = 0;
    this.selectedSecondaryTabIndex = 0;

    this.menuScroll = 0;
  }

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
    this.watchLoop();
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
    this.zones.push({ colorOff: this.colors.blue1, colorOn: this.colors.white, outlineColor: this.colors.white, low: 0 });
    this.zones.push({ colorOff: this.colors.yellow1, colorOn: this.colors.yellow2, outlineColor: this.colors.yellow2, low: 5500 });
    this.zones.push({ colorOff: this.colors.orange1, colorOn: this.colors.orange2, outlineColor: this.colors.orange2, low: 6000 });
    this.zones.push({ colorOff: this.colors.red1, colorOn: this.colors.red2, outlineColor: this.colors.red2, low: 6500 });
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

  min(v1: number, v2: number) { return ( v1 < v2 ) ? v1 : v2; }

  windowValue(key: string) {
    try {
      const split = key.split('.');
      if (split.length === 3) {
        return window[split[0]][split[1]][split[2]];
      }
      if (split.length === 2) {
        return window[split[0]][split[1]];
      }
      return window[key];
    } catch (e) {
      return '';
    }
  }
}
