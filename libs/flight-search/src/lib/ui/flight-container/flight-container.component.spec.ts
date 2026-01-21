import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FlightContainerComponent } from './flight-container.component';
import { FlightService } from '../../services/flight/flight.service';
import { signal, WritableSignal } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Flight, Segment, Airport } from '../../models';

jest.mock('uuid', () => ({
  v4: () => 'test-uuid-container',
}));

describe('FlightContainerComponent', () => {
  let component: FlightContainerComponent;
  let fixture: ComponentFixture<FlightContainerComponent>;

  const mockFlightService = {
    flights: signal<Flight[]>([]),
    segments: signal<Segment[]>([]),
    addFlight: jest.fn(),
    removeFlight: jest.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlightContainerComponent],
      providers: [{ provide: FlightService, useValue: mockFlightService }],
    }).compileComponents();

    fixture = TestBed.createComponent(FlightContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
    (mockFlightService.flights as WritableSignal<Flight[]>).set([]);
    (mockFlightService.segments as WritableSignal<Segment[]>).set([]);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Integration with FlightFormComponent', () => {
    it('should call service.addFlight when form emits "add" event', () => {
      const formDebugElement = fixture.debugElement.query(
        By.css('lib-flight-form'),
      );
      expect(formDebugElement).toBeTruthy();

      const mockOrigin: Airport = { code: 'OVB', city: 'Новосибирск' };
      const mockDest: Airport = { code: 'SVO', city: 'Москва' };

      const mockFlight: Flight = {
        id: 'test-id-1',
        origin: mockOrigin,
        destination: mockDest,
        departureTime: new Date('2025-01-01T10:00:00'),
        arrivalTime: new Date('2025-01-01T14:00:00'),
      };

      formDebugElement.triggerEventHandler('add', mockFlight);

      expect(mockFlightService.addFlight).toHaveBeenCalledTimes(1);
      expect(mockFlightService.addFlight).toHaveBeenCalledWith(mockFlight);
    });
  });

  describe('Integration with FlightListComponent', () => {
    it('should pass data from service signals to list inputs', () => {
      const mockFlights: Flight[] = [
        {
          id: 'f1',
          origin: { code: 'A', city: 'CityA' },
          destination: { code: 'B', city: 'CityB' },
          departureTime: new Date(),
          arrivalTime: new Date(),
        },
      ];

      const mockSegments: Segment[] = [
        {
          flights: mockFlights,
          totalDuration: '2h',
        },
      ];

      (mockFlightService.flights as WritableSignal<Flight[]>).set(mockFlights);
      (mockFlightService.segments as WritableSignal<Segment[]>).set(
        mockSegments,
      );

      fixture.detectChanges();

      const listDebugElement = fixture.debugElement.query(
        By.css('lib-flight-list'),
      );
      const listComponentInstance = listDebugElement.componentInstance;

      expect(listComponentInstance.flights()).toEqual(mockFlights);
      expect(listComponentInstance.segments()).toEqual(mockSegments);
    });

    it('should call service.removeFlight when list emits "delete" event', () => {
      const listDebugElement = fixture.debugElement.query(
        By.css('lib-flight-list'),
      );
      const flightIdToDelete = 'test-flight-id';

      listDebugElement.triggerEventHandler('delete', flightIdToDelete);

      expect(mockFlightService.removeFlight).toHaveBeenCalledTimes(1);
      expect(mockFlightService.removeFlight).toHaveBeenCalledWith(
        flightIdToDelete,
      );
    });
  });
});
