import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZsrmComponent } from './zsrm.component';

describe('ZsrmComponent', () => {
  let component: ZsrmComponent;
  let fixture: ComponentFixture<ZsrmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ZsrmComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZsrmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
