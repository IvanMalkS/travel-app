import { Pipe, PipeTransform } from '@angular/core';
import { formatDuration } from '../../utils/formated-time/formated-time.util';

@Pipe({
  name: 'duration',
})
export class DurationPipe implements PipeTransform {
  transform(value: number): string {
    return formatDuration(value);
  }
}
