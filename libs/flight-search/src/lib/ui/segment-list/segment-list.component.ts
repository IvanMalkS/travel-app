import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { Segment } from '../../models/segment.interface';

@Component({
  selector: 'lib-segment-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatCardModule],
  templateUrl: './segment-list.component.html',
  styleUrl: './segment-list.component.scss',
})
export class SegmentListComponent {
  segments = input.required<Segment[]>();
}
