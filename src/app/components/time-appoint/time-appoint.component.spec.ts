import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeAppointComponent } from './time-appoint.component';

describe('TimeAppointComponent', () => {
  let component: TimeAppointComponent;
  let fixture: ComponentFixture<TimeAppointComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimeAppointComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeAppointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
