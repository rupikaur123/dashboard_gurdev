import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddStaticPagesComponent } from './add-static-page.component';

describe('StaticPagesComponent', () => {
  let component: AddStaticPagesComponent;
  let fixture: ComponentFixture<AddStaticPagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddStaticPagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddStaticPagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
