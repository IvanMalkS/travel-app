import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlightFormComponent } from '../flight-form/flight-form.component';
import { FlightListComponent } from '../flight-list/flight-list.component';
import { FlightService } from '../../services/flight/flight.service';
import { SegmentListComponent } from '../segment-list/segment-list.component';
import { MatTabsModule } from '@angular/material/tabs';
import { toSignal } from '@angular/core/rxjs-interop';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';

@Component({
  selector: 'lib-flight-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FlightFormComponent,
    FlightListComponent,
    MatTabsModule,
    SegmentListComponent,
  ],
  templateUrl: './flight-container.component.html',
  styleUrl: './flight-container.component.scss',
})
export class FlightContainerComponent {
  protected readonly flightService = inject(FlightService);
  private readonly breakpointObserver = inject(BreakpointObserver);

  /*
   * Сначала просто через css скрывал,
   * потом нащёл в доке этот метод https://material.angular.dev/cdk/layout/overview
   * чтобы DOM был чище и e2e проще писать было, но анимации решили по другому )
   */
  protected readonly isMobile = toSignal(
    this.breakpointObserver
      .observe([Breakpoints.Handset, Breakpoints.TabletPortrait])
      .pipe(map((result) => result.matches)),
    { initialValue: false },
  );
}
