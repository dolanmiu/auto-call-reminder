import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhatsappLandingComponent } from './whatsapp-landing.component';

describe('WhatsappLandingComponent', () => {
  let component: WhatsappLandingComponent;
  let fixture: ComponentFixture<WhatsappLandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WhatsappLandingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WhatsappLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
