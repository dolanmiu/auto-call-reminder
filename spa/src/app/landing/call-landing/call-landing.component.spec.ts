import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CallLandingComponent } from './call-landing.component';

describe('CallLandingComponent', () => {
  let component: CallLandingComponent;
  let fixture: ComponentFixture<CallLandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CallLandingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CallLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
