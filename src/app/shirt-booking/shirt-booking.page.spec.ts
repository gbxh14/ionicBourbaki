import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShirtBookingPage } from './shirt-booking.page';

describe('ShirtBookingPage', () => {
  let component: ShirtBookingPage;
  let fixture: ComponentFixture<ShirtBookingPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ShirtBookingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
