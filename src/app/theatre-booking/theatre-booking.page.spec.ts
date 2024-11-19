import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TheatreBookingPage } from './theatre-booking.page';

describe('TheatreBookingPage', () => {
  let component: TheatreBookingPage;
  let fixture: ComponentFixture<TheatreBookingPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TheatreBookingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
