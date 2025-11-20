import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BspProformaOneReportQrComponent } from './bsp-proforma-one-report-qr.component';

describe('BspProformaOneReportQrComponent', () => {
  let component: BspProformaOneReportQrComponent;
  let fixture: ComponentFixture<BspProformaOneReportQrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BspProformaOneReportQrComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BspProformaOneReportQrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
