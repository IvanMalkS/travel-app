import { buildSegments } from './flight-calculations.util';
import { Flight } from '../models';

const createMockFlight = (
  id: string,
  from: string,
  to: string,
  depHour: number,
  arrHour: number,
): Flight => ({
  id,
  origin: { code: from, city: from },
  destination: { code: to, city: to },
  departureTime: new Date(2025, 0, 1, depHour, 0),
  arrivalTime: new Date(2025, 0, 1, arrHour, 0),
});

describe('flightCalculationsUtil', () => {
  describe('buildSegments', () => {
    it('should return empty array for empty input', () => {
      expect(buildSegments([])).toEqual([]);
    });

    it('should return single segment for single flight', () => {
      const flights = [createMockFlight('1', 'A', 'B', 10, 12)];
      const result = buildSegments(flights);

      expect(result.length).toBe(1);
      expect(result[0].flights.length).toBe(1);
    });

    it('should merge connected flights into one segment', () => {
      const f1 = createMockFlight('1', 'A', 'B', 10, 12);
      const f2 = createMockFlight('2', 'B', 'C', 13, 15);

      const result = buildSegments([f1, f2]);

      expect(result.length).toBe(1);
      expect(result[0].flights).toEqual([f1, f2]);
    });

    it('should separate unconnected flights with different cities', () => {
      const f1 = createMockFlight('1', 'A', 'B', 10, 12);
      const f2 = createMockFlight('2', 'C', 'D', 13, 15);

      const result = buildSegments([f1, f2]);

      expect(result.length).toBe(2);
    });

    it('should separate unconnected flights with time mismatch', () => {
      const f1 = createMockFlight('1', 'A', 'B', 10, 12);
      const f2 = createMockFlight('2', 'B', 'C', 9, 11);

      const result = buildSegments([f1, f2]);

      expect(result.length).toBe(2);
    });

    it('should handle complex mixed chain', () => {
      const f1 = createMockFlight('1', 'A', 'B', 10, 12);
      const f2 = createMockFlight('2', 'B', 'C', 13, 14);
      const f3 = createMockFlight('3', 'D', 'E', 15, 16);

      const result = buildSegments([f1, f2, f3]);

      expect(result.length).toBe(2);
      expect(result[0].flights.length).toBe(2);
      expect(result[1].flights.length).toBe(1);
    });
  });

  it('should handle the specific scenario from the task description from technical specification', () => {
    const f1 = {
      id: '1',
      origin: { code: 'OVB', city: 'Новосибирск' },
      destination: { code: 'SVO', city: 'Москва' },
      departureTime: new Date('2026-01-10T19:00:00'),
      arrivalTime: new Date('2026-01-10T19:30:00'),
    };

    const f2 = {
      id: '2',
      origin: { code: 'SVO', city: 'Москва' },
      destination: { code: 'IST', city: 'Стамбул' },
      departureTime: new Date('2026-01-11T00:00:00'),
      arrivalTime: new Date('2026-01-11T04:00:00'),
    };

    const f3 = {
      id: '3',
      origin: { code: 'IST', city: 'Стамбул' },
      destination: { code: 'OVB', city: 'Новосибирск' },
      departureTime: new Date('2026-01-13T12:00:00'),
      arrivalTime: new Date('2026-01-13T21:00:00'),
    };

    const f4 = {
      id: '4',
      origin: { code: 'SVO', city: 'Москва' },
      destination: { code: 'OVB', city: 'Новосибирск' },
      departureTime: new Date('2026-01-15T19:30:00'),
      arrivalTime: new Date('2026-01-16T03:00:00'),
    };

    const f5 = {
      id: '5',
      origin: { code: 'OVB', city: 'Новосибирск' },
      destination: { code: 'SVO', city: 'Москва' },
      departureTime: new Date('2026-01-20T06:50:00'),
      arrivalTime: new Date('2026-01-20T07:30:00'),
    };

    const flightsInput = [f5, f1, f3, f2, f4];

    const result = buildSegments(flightsInput);

    expect(result.length).toBe(2);

    const segment1 = result[0];
    expect(segment1.flights.length).toBe(3);
    expect(segment1.flights[0].id).toBe('1');
    expect(segment1.flights[1].id).toBe('2');
    expect(segment1.flights[2].id).toBe('3');

    expect(segment1.flights[0].origin.code).toBe('OVB');
    expect(segment1.flights[0].destination.code).toBe('SVO');
    expect(segment1.flights[1].origin.code).toBe('SVO');
    expect(segment1.flights[1].destination.code).toBe('IST');
    expect(segment1.flights[2].origin.code).toBe('IST');
    expect(segment1.flights[2].destination.code).toBe('OVB');

    const segment2 = result[1];
    expect(segment2.flights.length).toBe(2);
    expect(segment2.flights[0].id).toBe('4');
    expect(segment2.flights[1].id).toBe('5');

    expect(segment2.flights[0].origin.code).toBe('SVO');
    expect(segment2.flights[0].destination.code).toBe('OVB');
    expect(segment2.flights[1].origin.code).toBe('OVB');
    expect(segment2.flights[1].destination.code).toBe('SVO');
  });
});
