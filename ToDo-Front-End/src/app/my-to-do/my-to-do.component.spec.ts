import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyToDoComponent } from './my-to-do.component';

describe('MyToDoComponent', () => {
  let component: MyToDoComponent;
  let fixture: ComponentFixture<MyToDoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyToDoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyToDoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
