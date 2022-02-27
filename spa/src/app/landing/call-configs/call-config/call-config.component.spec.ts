import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CallConfigComponent } from './call-config.component';

describe('CallConfigComponent', () => {
  let component: CallConfigComponent;
  let fixture: ComponentFixture<CallConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CallConfigComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CallConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
