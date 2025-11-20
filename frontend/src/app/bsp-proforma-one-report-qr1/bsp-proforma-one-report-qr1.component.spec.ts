import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BspProformaOneReportQr1Component } from './bsp-proforma-one-report-qr1.component';

describe('BspProformaOneReportQr1Component', () => {
  let component: BspProformaOneReportQr1Component;
  let fixture: ComponentFixture<BspProformaOneReportQr1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BspProformaOneReportQr1Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BspProformaOneReportQr1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
