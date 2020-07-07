import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { DataService } from '../../services/_services/data.service';
import { MatSliderChange } from '@angular/material/slider';
import { PrndlType, UnitsType } from '../../models';
import { MatOptionSelectionChange } from '@angular/material/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatRadioChange } from '@angular/material/radio';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  styleUrls: [ './controls.component.scss' ]
})
export class ControlsComponent implements OnInit, OnDestroy {

  @Input() minRpm: number = 0;
  @Input() maxRpm: number = 7000;
  @Input() maxSpeed: number = 120;
  @Input() maxGear: number = 8;

  rpm: number = 0;
  speed: number = 0;
  prndl: PrndlType = 'P';
  gear: number = 1;
  units: UnitsType = 'Imperial';
  debug: boolean = false;

  subscriptions: Subscription[] = [];

  readonly prndlList: PrndlType[] = [ 'P', 'R', 'N', 'D', 'L' ];

  private _form: FormGroup;

  constructor(private _dataService: DataService,
              private _formBuilder: FormBuilder) {
  }

  get form(): FormGroup { return this._form; }

  updateRPMs(event: MatSliderChange): void {
    this._dataService.rpm = event.value;
  }

  updatePRNDL(event: MatOptionSelectionChange): void {
    if (event.isUserInput) {
      this._dataService.prndl = event.source.value;
    }
  }

  updateSpeed(event: MatSliderChange): void {
    this._dataService.speed = event.value;
  }

  updateGear(event: MatSliderChange): void {
    this._dataService.gear = event.value;
  }

  updateUnits(event: MatRadioChange): void {
    this._dataService.units = event.value;
  }

  updateDebug(event: MatCheckboxChange): void {
    this._dataService.debug = event.checked;
  }

  ngOnInit(): void {
    this._form = this._formBuilder.group({
      rpm: [ this.rpm ],
      prndl: [ this.prndl ],
      speed: [ this.speed ],
      gear: [ this.gear ],
      units: [ this.units ],
      debug: [ this.debug ]
    });

    this.subscriptions.push(this._dataService.rpm$.subscribe(rpm => this.rpm = rpm));
    this.subscriptions.push(this._dataService.prndl$.subscribe(prndl => this.prndl = prndl));
    this.subscriptions.push(this._dataService.speed$.subscribe(speed => this.speed = speed));
    this.subscriptions.push(this._dataService.gear$.subscribe(gear => this.gear = gear));
    this.subscriptions.push(this._dataService.units$.subscribe(units => this.units = units));
    this.subscriptions.push(this._dataService.debug$.subscribe(debug => this.debug = debug));
  }

  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) { subscription.unsubscribe(); }
  }

}
