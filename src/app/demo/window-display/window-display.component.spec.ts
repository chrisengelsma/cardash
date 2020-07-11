import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WindowDisplayComponent } from './window-display.component';

describe('WindowDisplayComponent', () => {
  let component: WindowDisplayComponent;
  let fixture: ComponentFixture<WindowDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WindowDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WindowDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
