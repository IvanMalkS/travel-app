import { Flight, Segment } from '../../models';
import { formatDuration } from '../formated-time/formated-time.util';

// Вынес в утилиты для будущего переиспользования и удобства тестирования
export function buildSegments(flights: Flight[]): Segment[] {
  if (!flights || flights.length === 0) return [];

  // В нашем случае массив сортируется уже в сторе, но я решил сделать чистую функцию
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
      segments.push(createSegment(currentSegment));
      currentSegment = [curr];
    }
  }

  segments.push(createSegment(currentSegment));

  return segments;
}

// Допом сделал, чтобы с пайпом поработать и вывести время
function createSegment(flights: Flight[]): Segment {
  const firstFlight = flights[0];
  const lastFlight = flights[flights.length - 1];

  const durationMs =
    lastFlight.arrivalTime.getTime() - firstFlight.departureTime.getTime();

  return {
    flights: [...flights],
    totalDurationMs: durationMs,
    totalDurationFormated: formatDuration(durationMs),
  };
}
