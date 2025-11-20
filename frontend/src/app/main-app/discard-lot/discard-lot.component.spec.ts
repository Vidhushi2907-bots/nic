import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscardLotComponent } from './discard-lot.component';

describe('DiscardLotComponent', () => {
  let component: DiscardLotComponent;
  let fixture: ComponentFixture<DiscardLotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiscardLotComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiscardLotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
