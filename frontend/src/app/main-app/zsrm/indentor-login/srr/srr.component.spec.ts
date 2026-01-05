import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SrrComponent } from './srr.component';

describe('SrrComponent', () => {
  let component: SrrComponent;
  let fixture: ComponentFixture<SrrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SrrComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SrrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
