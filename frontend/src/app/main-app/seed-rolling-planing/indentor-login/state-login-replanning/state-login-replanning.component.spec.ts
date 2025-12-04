import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StateLoginReplanningComponent } from './state-login-replanning.component';

describe('StateLoginReplanningComponent', () => {
  let component: StateLoginReplanningComponent;
  let fixture: ComponentFixture<StateLoginReplanningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StateLoginReplanningComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StateLoginReplanningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
