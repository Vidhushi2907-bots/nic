import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestPrinterComponent } from './test-printer.component';

describe('WebLoginComponent', () => {
  let component: TestPrinterComponent;
  let fixture: ComponentFixture<TestPrinterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestPrinterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestPrinterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
