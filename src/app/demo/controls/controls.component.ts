import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CardinalDirectionType, PrimaryTabItemType, PrndlType, SecondaryTabItemType, UnitsType } from '../../models';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  styleUrls: [ './controls.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControlsComponent implements OnInit, OnChanges {

  @Input() relevantKeys: { key: string, default_: any }[] = [];
  menu: { primary: PrimaryTabItemType, secondary: SecondaryTabItemType[] }[] = [
    {
      primary: 'Trip Computer',
      secondary: [ 'Trip 1', 'Trip 2' ]
    },
    {
      primary: 'Performance',
      secondary: [ 'None' ]
    },
    {
      primary: 'Audio',
      secondary: [ 'None' ]
    },
    {
      primary: 'Maintenance',
      secondary: [ 'None' ]
    },
    {
      primary: 'Options',
      secondary: [ 'None' ]
    },
    {
      primary: 'Simplify',
      secondary: [ 'None' ]
    }
  ];

  readonly firstColFlex: number = 30;
  readonly secondColFlex: number = 50;

  readonly prndlList: PrndlType[] = [ 'P', 'R', 'N', 'D', 'L' ];
  readonly directionList: CardinalDirectionType[] = [ 'N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW' ];
  readonly unitsList: UnitsType[] = [ 'imperial', 'metric' ];

  readonly controls: any[] = [
    { title: 'Units', type: 'header' },

    { title: 'Units', key: 'units', type: 'radio', options: this.unitsList },

    { title: 'Indicators', type: 'header' },

    { title: 'Total Mileage', key: 'totalMileage', type: 'slider', range: [ 0, 120000, 0.1 ] },
    { title: 'Left Indicator', key: 'leftIndicator', type: 'checkbox' },
    { title: 'Right Indicator', key: 'rightIndicator', type: 'checkbox' },
    { title: 'High Beam', key: 'highBeam', type: 'checkbox' },
    { title: 'Headlamp', key: 'headlamp', type: 'checkbox' },
    { title: 'Auto Headlamp', key: 'autoHeadlamp', type: 'checkbox' },
    { title: 'Compass', key: 'compass', type: 'select', options: this.directionList },

    { title: 'Tachometer', type: 'header' },

    { title: 'PRNDL', key: 'prndl', type: 'select', options: this.prndlList },
    { title: 'Gear', key: 'gear', type: 'slider', range: [ 1, 10, 1 ] },
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
    if (idx !== null) {
      return window[key][idx];
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
      window[key] = value;
    } else {
      window[key][idx] = value;
    }
    window.dispatchEvent(new CustomEvent(key, { detail: window[key] }));
  }

  private initForm(): void {
    for (const key of this.relevantKeys) {
      window[key.key] = key.default_;
    }

    this._form = this._formBuilder.group({
      rpm: [ window.rpm ],
      prndl: [ window.prndl ],
      speed: [ window.speed ],
      gear: [ window.gear ],
      units: [ window.units ],
      fuelLevel: [ window.fuelLevel ],
      outsideTemp: [ window.outsideTemp ],
      oilTemp: [ window.oilTemp ],
      oilPressure: [ window.oilPressure ],
      fuelDistance: [ window.fuelDistance ],
      autoHeadlamp: [ window.autoHeadlamp ],
      externalLamp: [ window.externalLamp ],
      headlamp: [ window.headlamp ],
      highBeam: [ window.highBeam ],
      leftIndicator: [ window.leftIndicator ],
      rightIndicator: [ window.rightIndicator ],
      compass: [ window.compass ],
      tirePressure0: [ window.tirePressure[0] ],
      tirePressure1: [ window.tirePressure[1] ],
      tirePressure2: [ window.tirePressure[2] ],
      tirePressure3: [ window.tirePressure[3] ],
      totalMileage: [ window.totalMileage ],
    });
  }
}
