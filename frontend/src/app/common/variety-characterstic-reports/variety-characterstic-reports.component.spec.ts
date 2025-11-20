import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VarietyCharactersticReportsComponent } from './variety-characterstic-reports.component';

describe('VarietyCharactersticReportsComponent', () => {
  let component: VarietyCharactersticReportsComponent;
  let fixture: ComponentFixture<VarietyCharactersticReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VarietyCharactersticReportsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VarietyCharactersticReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
