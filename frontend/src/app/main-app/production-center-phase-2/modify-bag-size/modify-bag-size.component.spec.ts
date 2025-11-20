import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyBagSizeComponent } from './modify-bag-size.component';

describe('ModifyBagSizeComponent', () => {
  let component: ModifyBagSizeComponent;
  let fixture: ComponentFixture<ModifyBagSizeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModifyBagSizeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModifyBagSizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
