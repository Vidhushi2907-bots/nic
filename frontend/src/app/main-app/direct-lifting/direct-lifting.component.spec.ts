import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectLiftingComponent } from './direct-lifting.component';

describe('DirectLiftingComponent', () => {
  let component: DirectLiftingComponent;
  let fixture: ComponentFixture<DirectLiftingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DirectLiftingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DirectLiftingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
