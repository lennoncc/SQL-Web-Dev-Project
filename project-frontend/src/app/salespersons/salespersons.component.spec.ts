import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalespersonsComponent } from './salespersons.component';

describe('SalespersonsComponent', () => {
  let component: SalespersonsComponent;
  let fixture: ComponentFixture<SalespersonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalespersonsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SalespersonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
