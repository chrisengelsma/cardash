import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CardinalDirectionType, GearType, PrimaryTabItemType, UnitType } from '../../models';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  styleUrls: [ './controls.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControlsComponent implements OnInit, OnChanges {

  @Input() relevantKeys: { key: string, default_: any }[] = [];

  menu: { primary: PrimaryTabItemType, secondary: string[] }[] = [
    {
      primary: 'tripComputer',
      secondary: [ 'trip1' ]
    },
    {
      primary: 'performance',
      secondary: [ 'gforce', 'performanceTimer', 'lapTimer' ]
    },
    {
      primary: 'audio',
      secondary: [ 'audio' ]
    },
    {
      primary: 'maintenance',
      secondary: [ 'fluidLife', 'engineLife' ]
    },
    {
      primary: 'options',
      secondary: [ 'options' ]
    },
    {
      primary: 'simplify',
      secondary: [ 'simplify' ]
    }
  ];

  readonly firstColFlex: number = 30;
  readonly secondColFlex: number = 50;

  readonly gearList: GearType[] = [ 'P', 'R', 'N', 'D', 'M' ];
  readonly directionList: CardinalDirectionType[] = [ 'N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW' ];
  readonly unitList: UnitType[] = [ 'imperial', 'metric' ];

  readonly controls: any[] = [
    { title: 'Units', type: 'header' },

    { title: 'Units', key: 'unit', type: 'radio', options: this.unitList },

    { title: 'G-Force', type: 'header' },

    { title: 'X', key: 'gforce', type: 'slider', range: [ -1.0, 1.0, 0.01 ], idx: 0 },
    { title: 'Y', key: 'gforce', type: 'slider', range: [ -1.0, 1.0, 0.01 ], idx: 1 },

    { title: 'Indicators', type: 'header' },

    { title: 'Total Mileage', key: 'totalMileage', type: 'slider', range: [ 0, 120000, 0.1 ] },
    { title: 'Compass', key: 'compass', type: 'select', options: this.directionList },

    { title: 'Left Turn', key: 'leftTurn', parent: 'indicators', type: 'checkbox' },
    { title: 'Right Turn', key: 'rightTurn', parent: 'indicators', type: 'checkbox' },
    { title: 'High Beam', key: 'highBeam', parent: 'indicators', type: 'checkbox' },
    { title: 'External Headlights', key: 'externalLights', parent: 'indicators', type: 'checkbox' },
    { title: 'Headlights', key: 'headlights', parent: 'indicators', type: 'checkbox' },
    { title: 'Auto Headlights', key: 'autoHeadlights', parent: 'indicators', type: 'checkbox' },
    { title: 'Battery', key: 'battery', parent: 'indicators', type: 'checkbox' },
    { title: 'Door Ajar', key: 'doorAjar', parent: 'indicators', type: 'checkbox' },
    { title: 'Oil Pressure', key: 'oilPressure', parent: 'indicators', type: 'checkbox' },
    { title: 'Malfunction', key: 'mil', parent: 'indicators', type: 'checkbox' },

    { title: 'Tachometer', type: 'header' },

    { title: 'Gear', key: 'gear', type: 'select', options: this.gearList },
    { title: 'Gear Number', key: 'gearNumber', type: 'slider', range: [ 1, 10, 1 ] },
    { title: 'RPM', key: 'rpm', type: 'slider', range: [ 0, 16000, 0.1 ] },
    { title: 'Speed', key: 'speed', type: 'slider', range: [ 0, 120, 0.1 ] },

    { title: 'Right Bumper', type: 'header' },

    { title: 'Fuel Distance', key: 'fuelDistance', type: 'slider', range: [ 0, 300, 0.1 ] },
    { title: 'Fuel Level', key: 'fuelLevel', type: 'slider', range: [ 0, 100, 0.1 ] },

    { title: 'Left Bumper', type: 'header' },

    { title: 'Oil Temp', key: 'oilTemp', type: 'slider', range: [ 0, 300, 0.1 ] },

    { title: 'Left Peripherals', type: 'header' },

    { title: 'Front Left Tire Pressure', key: 'tirePressure', type: 'slider', range: [ 0, 40, 0.1 ], idx: 0 },
    { title: 'Rear Left Tire Pressure', key: 'tirePressure', type: 'slider', range: [ 0, 40, 0.1 ], idx: 1 },
    { title: 'Rear Right Tire Pressure', key: 'tirePressure', type: 'slider', range: [ 0, 40, 0.1 ], idx: 2 },
    { title: 'Front Right Tire Pressure', key: 'tirePressure', type: 'slider', range: [ 0, 40, 0.1 ], idx: 3 },

    { title: 'Oil Pressure', key: 'oilPressure', type: 'slider', range: [ 0, 80, 0.1 ] },

    { title: 'Trip Computer - Trip 1', type: 'header' },

    { title: 'Distance', key: 'trip1.distance', parent: 'tripComputer', type: 'slider', range: [ 0, 10000, 0.1 ] },
    { title: 'Fuel Economy', key: 'trip1.fuelEconomy', parent: 'tripComputer', type: 'slider', range: [ 0, 40, 0.1 ] },
    { title: 'Time', key: 'trip1.time', parent: 'tripComputer', type: 'slider', range: [ 0, 10000, 0.1 ] },

    { title: 'Audio', type: 'header' },

    { title: 'Wave', key: 'wave', parent: 'audio', type: 'radio', options: [ 'fm', 'am' ] },
    { title: 'Station', key: 'station', parent: 'audio', type: 'slider', range: [ 89.1, 107.5, 0.2 ] },

    { title: 'Maintenance', type: 'header' },

    { title: 'Engine Oil', key: 'oil', parent: 'maintenance', type: 'slider', range: [ 0, 100, 0.1 ] },
    { title: 'Transmission Fluid', key: 'transmissionFluid', parent: 'maintenance', type: 'slider', range: [ 0, 100, 0.1 ] },
    { title: 'Rev\'s/1000', key: 'revs', parent: 'maintenance', type: 'slider', range: [ 0, 2000, 0.1 ] },
    { title: 'Hours', key: 'hours', parent: 'maintenance', type: 'slider', range: [ 0, 1000, 0.1 ] },
    { title: 'Idle Hours', key: 'idleHours', parent: 'maintenance', type: 'slider', range: [ 0, 1000, 0.1 ] },
  ];

  private _form: FormGroup;

  constructor(private _formBuilder: FormBuilder) {
  }

  get selectedPrimaryTab() { return window.selectedPrimaryTab; }

  get selectedSecondaryTab() { return window.selectedSecondaryTab; }

  get tripComputer() { return window.tripComputer; }

  get form(): FormGroup { return this._form; }

  get primaryTabs() {
    try {
      return this.menu.map(x => x.primary);
    } catch (e) { }
  }

  keyToFormControlName(control: any): string {
    if (control.idx === undefined || control.idx === null) {
      return control.key;
    }
    return control.key + control.idx;
  }

  windowValue(key: string, idx?: number) {
    if (key && idx !== null && idx !== undefined) {
      return window[key][idx];
    }
    const keys = key.split('.');
    if (keys.length === 3) {
      return window[keys[0]][keys[1]][keys[2]];
    }
    if (keys.length === 2) {
      return window[keys[0]][keys[1]];
    }
    return window[key];
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.initForm();
  }

  tirePressure(i: number) {
    return window.tirePressure[i];
  }

  leftPressed(): void {
    let i = this.menu.findIndex(x => x.primary === this.selectedPrimaryTab) - 1;
    if (i < 0) { i = this.primaryTabs.length - 1; }
    window.selectedPrimaryTab = this.menu[i].primary;
    window.selectedSecondaryTab = this.menu[i].secondary[0];
    this.update('selectedPrimaryTab', this.selectedPrimaryTab);
    this.update('selectedSecondaryTab', this.selectedSecondaryTab);
  }

  upPressed(): void {
    const currentTab = this.menu.find(x => x.primary === this.selectedPrimaryTab);
    let i = currentTab.secondary.findIndex(x => x === this.selectedSecondaryTab) - 1;
    if (i < 0) { i = currentTab.secondary.length - 1; }
    window.selectedSecondaryTab = currentTab.secondary[i];
    this.update('selectedSecondaryTab', this.selectedSecondaryTab);
  }

  downPressed(): void {
    const currentTab = this.menu.find(x => x.primary === this.selectedPrimaryTab);
    let i = currentTab.secondary.findIndex(x => x === this.selectedSecondaryTab) + 1;
    if (i === currentTab.secondary.length) { i = 0; }
    window.selectedSecondaryTab = currentTab.secondary[i];
    this.update('selectedSecondaryTab', this.selectedSecondaryTab);
  }

  rightPressed(): void {
    let i = this.primaryTabs.findIndex(x => x === this.selectedPrimaryTab) + 1;
    if (i === this.primaryTabs.length) { i = 0; }
    window.selectedPrimaryTab = this.primaryTabs[i];
    this.update('selectedPrimaryTab', this.selectedPrimaryTab);
  }

  ngOnInit(): void {
    this.initForm();
  }

  update(key: string, value: any, idx?: number) {
    if (idx === null || idx === undefined) {
      const split = key.split('.');

      if (split.length === 3) {
        window[split[0]][split[1]][split[2]] = value;
      } else if (split.length === 2) {
        window[split[0]][split[1]] = value;
      } else {
        window[key] = value;
      }
    } else {
      window[key][idx] = value;
    }
  }

  private initForm(): void {
    for (const key of this.relevantKeys) {
      window[key.key] = key.default_;
    }

    this._form = this._formBuilder.group({
      rpm: [ window.rpm ],
      speed: [ window.speed ],
      gear: [ window.gear ],
      gearNumber: [ window.gearNumber ],
      unit: [ window.unit ],
      fuelLevel: [ window.fuelLevel ],
      outsideTemp: [ window.outsideTemp ],
      oilTemp: [ window.oilTemp ],
      oilPressure: [ window.oilPressure ],
      fuelDistance: [ window.fuelDistance ],
      compass: [ window.compass ],
      gforce0: [ window.gforce[0] ],
      gforce1: [ window.gforce[1] ],
      totalMileage: [ window.totalMileage ],
      tripComputer: this._formBuilder.group({
        'trip1.distance': [ window.tripComputer.trip1.distance ],
        'trip1.fuelEconomy': [ window.tripComputer.trip1.fuelEconomy ],
        'trip1.time': [ window.tripComputer.trip1.time ],
      }),
      maintenance: this._formBuilder.group({
        oil: [ window.maintenance.oil ],
        transmissionFluid: [ window.maintenance.transmissionFluid ],
        revs: [ window.maintenance.revs ],
        hours: [ window.maintenance.hours ],
        idleHours: [ window.maintenance.idleHours ],
      }),
      audio: this._formBuilder.group({
        wave: [ window.audio.wave ],
        station: [ window.audio.station ],
      }),
      indicators: this._formBuilder.group({
        autoHeadlights: [ window.indicators.autoHeadlights ],
        externalLights: [ window.indicators.externalLights ],
        headlights: [ window.indicators.headlights ],
        highBeam: [ window.indicators.highBeam ],
        mil: [ window.indicators.mil ],
        battery: [ window.indicators.battery ],
        oilPressure: [ window.indicators.oilPressure ],
        doorAjar: [ window.indicators.doorAjar ],
        leftTurn: [ window.indicators.leftTurn ],
        rightTurn: [ window.indicators.rightTurn ],
      }),
      tirePressure0: [ window.tirePressure[0] ],
      tirePressure1: [ window.tirePressure[1] ],
      tirePressure2: [ window.tirePressure[2] ],
      tirePressure3: [ window.tirePressure[3] ],
    });
  }
}
