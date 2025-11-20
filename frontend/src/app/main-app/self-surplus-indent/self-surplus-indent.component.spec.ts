import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelfSurplusIndentComponent } from './self-surplus-indent.component';

describe('SelfSurplusIndentComponent', () => {
  let component: SelfSurplusIndentComponent;
  let fixture: ComponentFixture<SelfSurplusIndentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelfSurplusIndentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelfSurplusIndentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
