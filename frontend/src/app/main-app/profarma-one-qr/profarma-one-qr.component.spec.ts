import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfarmaOneQrComponent } from './profarma-one-qr.component';

describe('ProfarmaOneQrComponent', () => {
  let component: ProfarmaOneQrComponent;
  let fixture: ComponentFixture<ProfarmaOneQrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfarmaOneQrComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfarmaOneQrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
