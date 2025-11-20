import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CropGroupDetailComponent } from './crop-group-detail.component';

describe('CropGroupDetailComponent', () => {
  let component: CropGroupDetailComponent;
  let fixture: ComponentFixture<CropGroupDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CropGroupDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CropGroupDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
