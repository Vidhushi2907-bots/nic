import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignSpaComponent } from './assign-spa.component';

describe('AssignSpaComponent', () => {
  let component: AssignSpaComponent;
  let fixture: ComponentFixture<AssignSpaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignSpaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignSpaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
