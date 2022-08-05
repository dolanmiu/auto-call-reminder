import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkingComponent } from './linking.component';

describe('LinkingComponent', () => {
  let component: LinkingComponent;
  let fixture: ComponentFixture<LinkingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LinkingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LinkingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
