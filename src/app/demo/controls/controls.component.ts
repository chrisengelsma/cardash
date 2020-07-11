import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatSliderChange } from '@angular/material/slider';
import { PrimaryTabItemType, PrndlType, SecondaryTabItemType } from '../../models';
import { MatOptionSelectionChange } from '@angular/material/core';
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

  @Input() minRpm: number = 0;
  @Input() maxRpm: number = 16383.75;
  @Input() minOilTemp: number = 0;
  @Input() maxOilTemp: number = 300;
  @Input() maxSpeed: number = 120;
  @Input() maxGear: number = 10;
  @Input() minTirePressure: number = 0;
  @Input() maxTirePressure: number = 40;
  @Input() minOilPressure: number = 0;
  @Input() maxOilPressure: number = 80;


  readonly prndlList: PrndlType[] = [ 'P', 'R', 'N', 'D', 'L' ];
  readonly tires: string[] = [ 'Front Left', 'Rear Left', 'Rear Right', 'Front Right' ];
  private _form: FormGroup;

  constructor(private _formBuilder: FormBuilder) {
  }

  get rpm() { return window.rpm; }

  get speed() { return window.speed; }

  get prndl() { return window.prndl; }

  get gear() { return window.gear; }

  get units() { return window.units; }

  get totalMileage() { return window.totalMileage; }

  get fuelLevel() { return window.fuelLevel; }

  get fuelDistance() { return window.fuelDistance; }

  get oilTemp() { return window.oilTemp; }

  get oilPressure() { return window.oilPressure; }

  get outsideTemp() { return window.outsideTemp; }

  get selectedPrimaryTab() { return window.selectedPrimaryTab; }

  get selectedSecondaryTab() { return window.selectedSecondaryTab; }

  get tripComputer() { return window.tripComputer; }

  get form(): FormGroup { return this._form; }

  get primaryTabs() {
    try {
      return this.menu.map(x => x.primary);
    } catch (e) { }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.initForm();
  }

  tirePressure(i: number) {
    try {
      return window.tirePressure[i];
    } catch (e) {
      return 0;
    }
  }

  updateFuelLevel(event: MatSliderChange): void { this.update('fuelLevel', event.value); }

  updateFuelDistance(event: MatSliderChange): void { this.update('fuelDistance', event.value); }

  updateRpm(event: MatSliderChange): void { this.update('rpm', event.value); }

  updateSpeed(event: MatSliderChange): void { this.update('speed', event.value); }

  updateOilTemp(event: MatSliderChange): void { this.update('oilTemp', event.value); }

  updateOutsideTemp(event: MatSliderChange): void { this.update('temp', event.value); }

  updateOilPressure(event: MatSliderChange): void { this.update('oilPressure', event.value); }

  updatePRNDL(event: MatOptionSelectionChange): void { if (event.isUserInput) { this.update('prndl', event.source.value); } }

  updateTirePressure(event: MatSliderChange, tire: number): void {
    window.tirePressure[tire] = event.value;
    this.update('tirePressure', window.tirePressure);
  }

  updateGear(event: MatSliderChange): void { this.update('gear', event.value); }

  updateUnits(event): void { this.update('units', event.value); }

  updateTotalMileage(event: MatSliderChange): void { this.update('totalMileage', event.value); }

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

  private initForm(): void {
    for (const key of this.relevantKeys) {
      window[key.key] = key.default_;
    }

    this._form = this._formBuilder.group({
      rpm: [ this.rpm ],
      prndl: [ this.prndl ],
      speed: [ this.speed ],
      gear: [ this.gear ],
      units: [ this.units ],
      fuelLevel: [ this.fuelLevel ],
      outsideTemp: [ this.outsideTemp ],
      oilTemp: [ this.oilTemp ],
      oilPressure: [ this.oilPressure ],
      fuelDistance: [ this.fuelDistance ],
      tirePressure0: [ this.tirePressure(0) ],
      tirePressure1: [ this.tirePressure(1) ],
      tirePressure2: [ this.tirePressure(2) ],
      tirePressure3: [ this.tirePressure(3) ],
      totalMileage: [ this.totalMileage ],
    });
  }

  private update(key: string, value: any) {
    window[key] = value;
    window.dispatchEvent(new CustomEvent(key, { detail: value }));
  }

}
