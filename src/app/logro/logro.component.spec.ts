import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogroComponent } from './logro.component';

describe('LogroComponent', () => {
  let component: LogroComponent;
  let fixture: ComponentFixture<LogroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
