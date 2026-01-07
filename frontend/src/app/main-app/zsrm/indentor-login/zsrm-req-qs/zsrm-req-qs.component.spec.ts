import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZsrmReqQsComponent } from './zsrm-req-qs.component';

describe('ZsrmReqQsComponent', () => {
  let component: ZsrmReqQsComponent;
  let fixture: ComponentFixture<ZsrmReqQsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ZsrmReqQsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZsrmReqQsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
