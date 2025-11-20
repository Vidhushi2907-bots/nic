import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelfSurplusLiftingComponent } from './self-surplus-lifting.component';

describe('SelfSurplusLiftingComponent', () => {
  let component: SelfSurplusLiftingComponent;
  let fixture: ComponentFixture<SelfSurplusLiftingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelfSurplusLiftingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelfSurplusLiftingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
