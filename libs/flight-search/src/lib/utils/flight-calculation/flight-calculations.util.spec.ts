import { buildSegments } from './flight-calculations.util';
import { Flight } from '../../models';

const createMockFlight = (
  id: string,
  from: string,
  to: string,
  depHour: number,
  arrHour: number,
  day = 1,
): Flight => ({
  id,
  origin: { code: from, city: from },
  destination: { code: to, city: to },
  departureTime: new Date(2026, 0, day, depHour, 0),
  arrivalTime: new Date(2026, 0, day, arrHour, 0),
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

    it('should separate unconnected flights with time mismatch (arrival > next departure)', () => {
      const f1 = createMockFlight('1', 'A', 'B', 10, 12);
      const f2 = createMockFlight('2', 'B', 'C', 9, 11);

      const result = buildSegments([f1, f2]);

      expect(result.length).toBe(2);
    });

    it('should calculate total duration in ms correctly for a segment', () => {
      const f1 = createMockFlight('1', 'A', 'B', 10, 12);
      const f2 = createMockFlight('2', 'B', 'C', 14, 16);

      const result = buildSegments([f1, f2]);

      const expectedMs = 6 * 60 * 60 * 1000;

      expect(result[0].totalDurationMs).toBe(expectedMs);
      expect(result[0].totalDurationFormated).toBe('6ч');
    });

    it('should handle the specific scenario from the technical specification', () => {
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
      expect(segment1.flights.map((f) => f.id)).toEqual(['1', '2', '3']);

      const segment2 = result[1];
      expect(segment2.flights.length).toBe(2);
      expect(segment2.flights.map((f) => f.id)).toEqual(['4', '5']);
    });
  });
});
