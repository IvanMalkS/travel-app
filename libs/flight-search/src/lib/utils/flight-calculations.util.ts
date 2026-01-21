import { Flight, Segment } from '../models';

export function buildSegments(flights: Flight[]): Segment[] {
  if (!flights || flights.length === 0) return [];

  const sortedFlights = [...flights].sort(
    (a, b) => a.departureTime.getTime() - b.departureTime.getTime(),
  );

  const segments: Segment[] = [];
  let currentSegment: Flight[] = [sortedFlights[0]];

  for (let i = 1; i < sortedFlights.length; i++) {
    const prev = currentSegment[currentSegment.length - 1];
    const curr = sortedFlights[i];

    const isConnected =
      prev.destination.code === curr.origin.code &&
      curr.departureTime.getTime() >= prev.arrivalTime.getTime();

    if (isConnected) {
      currentSegment.push(curr);
    } else {
      segments.push({ flights: [...currentSegment] });
      currentSegment = [curr];
    }
  }

  segments.push({ flights: currentSegment });

  return segments;
}
