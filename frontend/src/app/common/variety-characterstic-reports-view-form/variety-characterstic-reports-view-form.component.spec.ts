import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VarietyCharactersticReportsViewFormComponent } from './variety-characterstic-reports-view-form.component';

describe('VarietyCharactersticReportsViewFormComponent', () => {
  let component: VarietyCharactersticReportsViewFormComponent;
  let fixture: ComponentFixture<VarietyCharactersticReportsViewFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VarietyCharactersticReportsViewFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VarietyCharactersticReportsViewFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
