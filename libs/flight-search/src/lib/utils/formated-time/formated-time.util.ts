export function formatDuration(ms: number): string {
  if (!ms || ms <= 0) return '0м';

  const totalMinutes = Math.floor(ms / (1000 * 60));

  const days = Math.floor(totalMinutes / (24 * 60));
  const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
  const minutes = totalMinutes % 60;

  const parts: string[] = [];

  if (days > 0) {
    parts.push(`${days}д`);
  }

  if (hours > 0 || days > 0) {
    parts.push(`${hours}ч`);
  }

  if (minutes > 0 || parts.length === 0) {
    parts.push(`${minutes}м`);
  }

  return parts.join(' ');
}
