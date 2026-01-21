import { TestBed } from '@angular/core/testing';
import { FlightService } from './flight.service';
import { StorageService } from '../storage-service/storage.service';
import { Flight, Airport, FlightRawFromJson, Segment } from '../../models';

const mockAirportA: Airport = { code: 'A', city: 'City A' };
const mockAirportB: Airport = { code: 'B', city: 'City B' };
const mockAirportC: Airport = { code: 'C', city: 'City C' };

function createFlight(
  id: string,
  from: Airport,
  to: Airport,
  depStr: string,
  arrStr: string,
): Flight {
  return {
    id,
    origin: from,
    destination: to,
    departureTime: new Date(depStr),
    arrivalTime: new Date(arrStr),
  };
}

describe('FlightService', () => {
  let service: FlightService;
  let storageServiceMock: { getItem: jest.Mock; setItem: jest.Mock };

  beforeEach(() => {
    storageServiceMock = {
      getItem: jest.fn(),
      setItem: jest.fn(),
    };

    storageServiceMock.getItem.mockReturnValue(null);

    TestBed.configureTestingModule({
      providers: [
        FlightService,
        { provide: StorageService, useValue: storageServiceMock },
      ],
    });
  });

  it('should be created', () => {
    service = TestBed.inject(FlightService);
    expect(service).toBeTruthy();
  });

  describe('Storage Interaction', () => {
    it('should load and parse data from StorageService on init', () => {
      const rawData: FlightRawFromJson[] = [
        {
          id: '1',
          origin: mockAirportA,
          destination: mockAirportB,
          departureTime: '2025-01-01T10:00:00.000Z',
          arrivalTime: '2025-01-01T12:00:00.000Z',
        },
      ];

      storageServiceMock.getItem.mockReturnValue(rawData);

      service = TestBed.inject(FlightService);

      const flights: Flight[] = service.flights();

      expect(storageServiceMock.getItem).toHaveBeenCalledWith('flight_data');
      expect(flights.length).toBe(1);
      expect(flights[0].id).toBe('1');
      expect(flights[0].departureTime).toBeInstanceOf(Date);
      expect(flights[0].departureTime.toISOString()).toBe(
        rawData[0].departureTime,
      );
    });

    it('should save data to StorageService when flights change', () => {
      service = TestBed.inject(FlightService);

      const flight: Flight = createFlight(
        '1',
        mockAirportA,
        mockAirportB,
        '2025-01-01T10:00',
        '2025-01-01T12:00',
      );

      service.addFlight(flight);

      TestBed.tick();

      expect(storageServiceMock.setItem).toHaveBeenCalledTimes(1);

      const [key, value] = storageServiceMock.setItem.mock.calls[0];
      expect(key).toBe('flight_data');
      expect(value[0].id).toBe('1');
    });
  });

  describe('Business Logic', () => {
    beforeEach(() => {
      service = TestBed.inject(FlightService);
    });

    it('should add flights and sort them by departure time', () => {
      const flight1 = createFlight(
        '1',
        mockAirportA,
        mockAirportB,
        '2025-01-01T15:00',
        '2025-01-01T16:00',
      );
      const flight2 = createFlight(
        '2',
        mockAirportA,
        mockAirportB,
        '2025-01-01T10:00',
        '2025-01-01T11:00',
      );

      service.addFlight(flight1);
      service.addFlight(flight2);

      const flights: Flight[] = service.flights();
      expect(flights.length).toBe(2);
      expect(flights[0].id).toBe('2');
      expect(flights[1].id).toBe('1');
    });

    it('should remove flight by id', () => {
      const flight = createFlight(
        '1',
        mockAirportA,
        mockAirportB,
        '2025-01-01T10:00',
        '2025-01-01T12:00',
      );
      service.addFlight(flight);

      expect(service.flights().length).toBe(1);

      service.removeFlight('1');
      expect(service.flights().length).toBe(0);
    });
  });

  describe('Segments Calculation', () => {
    beforeEach(() => {
      service = TestBed.inject(FlightService);
    });

    it('should update segments signal when flights are added', () => {
      const f1 = createFlight(
        '1',
        mockAirportA,
        mockAirportB,
        '2025-01-01T10:00',
        '2025-01-01T12:00',
      );

      expect(service.segments().length).toBe(0);

      service.addFlight(f1);

      const segments = service.segments();
      expect(segments.length).toBeGreaterThan(0);
      expect(segments[0].flights[0].id).toBe('1');
    });
  });
});
