import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeAmountTableComponent } from './type-amount-table.component';

describe('TypeAmountTableComponent', () => {
  let component: TypeAmountTableComponent;
  let fixture: ComponentFixture<TypeAmountTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TypeAmountTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TypeAmountTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
