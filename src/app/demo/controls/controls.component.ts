import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { MatSliderChange } from '@angular/material/slider';
import { PrndlType } from '../../models';
import { MatOptionSelectionChange } from '@angular/material/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  styleUrls: [ './controls.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControlsComponent implements OnInit {

  readonly relevantKeys: { key: string, default_: any }[] = [
    { key: 'rpm', default_: 0 },
    { key: 'speed', default_: 0 },
    { key: 'fuelLevel', default_: 100 },
    { key: 'fuelDistance', default_: 0 },
    { key: 'prndl', default_: 'P' },
    { key: 'oilTemp', default_: 200 },
    { key: 'oilPressure', default_: 28 },
    { key: 'outsideTemp', default_: 75 },
    { key: 'gear', default_: 1 },
    { key: 'units', default_: 'imperial' },
    { key: 'tirePressure', default_: [ 36, 36, 36, 36 ] },
    { key: 'totalMileage', default_: 0 },
    { key: 'oilPressure', default_: 28 },
    { key: 'selectedPrimaryTab', default_: 0 },
    { key: 'selectedSecondaryTab', default_: 0 },
    { key: 'tripComputer', default_: 0 },
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

  showOnlyRelevant: boolean = true;

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

  get form(): FormGroup { return this._form; }

  get printWindow(): string {
    if (this.showOnlyRelevant) {
      const result = {};
      for (const key of this.relevantKeys) { result[key.key] = window[key.key]; }
      return JSON.stringify(result, null, 2);
    } else {
      const cache = [];
      return JSON.stringify(window, (key, value) => {
        if (typeof value === 'object' && value !== null) {
          if (cache.includes(value)) { return; }
          cache.push(value);
        }
        return value;
      }, 2);
    }
  }

  tirePressure(i: number) { return window.tirePressure[i]; }

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

  ngOnInit(): void {
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
