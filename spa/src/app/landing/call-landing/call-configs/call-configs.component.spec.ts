import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CallConfigsComponent } from './call-configs.component';

describe('CallConfigsComponent', () => {
  let component: CallConfigsComponent;
  let fixture: ComponentFixture<CallConfigsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CallConfigsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CallConfigsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
