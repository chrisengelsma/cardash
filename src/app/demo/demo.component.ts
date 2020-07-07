import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: [ './demo.component.scss' ]
})
export class DemoComponent implements OnInit {

  authenticated: boolean = false;

  private _form: FormGroup;

  constructor(private _formBuilder: FormBuilder) {
  }

  get form(): FormGroup { return this._form; }

  submit(): void {
    this.login(this.form.controls.user.value, this.form.controls.pass.value);
  }

  login(user: string, pass: string): void {
    if (user === environment.user && pass === environment.password) {
      localStorage.setItem('car-dash', JSON.stringify({ user, pass }));
      this.authenticated = true;
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
