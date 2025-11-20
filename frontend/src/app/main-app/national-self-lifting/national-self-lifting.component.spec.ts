import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NationalSelfLiftingComponent } from './national-self-lifting.component';

describe('NationalSelfLiftingComponent', () => {
  let component: NationalSelfLiftingComponent;
  let fixture: ComponentFixture<NationalSelfLiftingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NationalSelfLiftingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NationalSelfLiftingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
