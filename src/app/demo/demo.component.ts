import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../environments/environment';
import { DashComponent } from '../dash/dash.component';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: [ './demo.component.scss' ]
})
export class DemoComponent implements OnInit {

  @ViewChild('dashboard', { static: false }) dashboardComponent!: DashComponent;

  relevantKeys: { key: string, default_: any }[] = [
    { key: 'rpm', default_: 0 },
    { key: 'speed', default_: 0 },
    { key: 'fuelLevel', default_: 100 },
    { key: 'fuelDistance', default_: 0 },
    { key: 'gear', default_: 'P' },
    { key: 'oilTemp', default_: 200 },
    { key: 'oilPressure', default_: 28 },
    { key: 'outsideTemp', default_: 75 },
    { key: 'gearNumber', default_: 1 },
    { key: 'unit', default_: 'imperial' },
    { key: 'tirePressure', default_: [ 36, 36, 36, 36 ] },
    { key: 'totalMileage', default_: 0 },
    { key: 'oilPressure', default_: 28 },
    { key: 'selectedPrimaryTab', default_: 'tripComputer' },
    { key: 'selectedSecondaryTab', default_: 'trip1' },
    { key: 'selectedOption', default_: 'displayDesign' },
    { key: 'gforce', default_: [ 0.0, 0.0 ] },
    { key: 'compass', default_: 'N' },
    {
      key: 'tripComputer', default_: {
        trip1: {
          distance: 0,
          fuelEconomy: 0,
          time: 0
        }
      }
    },
    {
      key: 'maintenance', default_: {
        oil: 100,
        transmissionFluid: 100,
        revs: 0,
        hours: 0,
        idleHours: 0,
      }
    },
    {
      key: 'audio', default_: {
        wave: 'fm',
        station: 89.1,
        artist: 'Prince',
        album: 'Purple Rain',
        song: 'Let\'s Go Crazy'
      }
    },
    {
      key: 'indicators', default_: {
        externalLights: false,
        headlights: false,
        autoHeadlights: false,
        leftTurn: false,
        rightTurn: false,
        highBeam: false,
        battery: false,
        doorAjar: false,
        oilPressure: false,
        mil: false,
      }
    },
  ];
  private _form: FormGroup;
  private _authenticated = false;

  constructor(private _formBuilder: FormBuilder) {
  }

  get authenticated(): boolean {
    if (this.isProd) { return true; }
    return this._authenticated;
  }

  get form(): FormGroup { return this._form; }

  get isProd(): boolean { return false; }

  centerButtonPressed($event: any): void {
    try {
      this.dashboardComponent.onCenterButtonClicked($event);
    } catch (e) {
      console.error(e);
    }
  }

  submit(): void {
    this.login(this.form.controls.user.value, this.form.controls.pass.value);
  }

  login(user: string, pass: string): void {
    if (user === environment.user && pass === environment.password) {
      localStorage.setItem('car-dash', JSON.stringify({ user, pass }));
      this._authenticated = true;
    }
  }

  ngOnInit(): void {
    const creds = JSON.parse(localStorage.getItem('car-dash'));
    if (creds) {
      this.login(creds.user, creds.pass);
    }
    this._form = this._formBuilder.group({
      user: [ '', Validators.required ],
      pass: [ '', Validators.required ]
    });
  }

}
