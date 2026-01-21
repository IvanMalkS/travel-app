import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FlightListComponent } from './flight-list.component';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatTabGroupHarness } from '@angular/material/tabs/testing';
import { MatCardHarness } from '@angular/material/card/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { Flight, Segment } from '../models';
import { By } from '@angular/platform-browser';

describe('FlightListComponent', () => {
  let component: FlightListComponent;
  let fixture: ComponentFixture<FlightListComponent>;
  let loader: HarnessLoader;

  const mockFlight: Flight = {
    id: 'f1',
    origin: { code: 'OVB', city: 'Novosibirsk' },
    destination: { code: 'MOW', city: 'Moscow' },
    departureTime: new Date('2025-10-05T12:00:00'),
    arrivalTime: new Date('2025-10-05T16:00:00'),
  };

  const mockSegment: Segment = {
    flights: [mockFlight],
    totalDuration: '4h',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlightListComponent],
      providers: [provideNoopAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(FlightListComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('flights', []);
    fixture.componentRef.setInput('segments', []);

    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Flights Tab', () => {
    it('should show empty state when no flights', () => {
      fixture.componentRef.setInput('flights', []);
      fixture.detectChanges();

      const text = fixture.nativeElement.textContent;
      expect(text).toContain('Нет добавленных перелетов');
    });

    it('should render flight details including Year', async () => {
      fixture.componentRef.setInput('flights', [mockFlight]);
      fixture.detectChanges();

      const card = await loader.getHarness(
        MatCardHarness.with({ selector: '.flight-card' }),
      );
      const text = await card.getText();

      expect(text).toContain('Novosibirsk');
      expect(text).toContain('05.10.2025 12:00');
    });

    it('should emit delete event with flight ID on button click', async () => {
      fixture.componentRef.setInput('flights', [mockFlight]);
      fixture.detectChanges();

      const deleteSpy = jest.spyOn(component.delete, 'emit');

      const deleteBtn = await loader.getHarness(
        MatButtonHarness.with({ text: 'delete' }),
      );
      await deleteBtn.click();

      expect(deleteSpy).toHaveBeenCalledWith(mockFlight.id);
    });
  });

  describe('Segments Tab', () => {
    it('should show segments content when switching tab', async () => {
      fixture.componentRef.setInput('segments', [mockSegment]);
      fixture.detectChanges();

      const tabGroup = await loader.getHarness(MatTabGroupHarness);
      await tabGroup.selectTab({ label: 'Сегменты' });

      fixture.detectChanges();

      const segmentCard = await loader.getHarness(
        MatCardHarness.with({ selector: '.segment-card' }),
      );

      const title = await segmentCard.getTitleText();
      expect(title).toContain('Маршрут #1');

      const content = await segmentCard.getText();
      expect(content).toContain('Novosibirsk');
    });

    it('should show empty state in segments tab', async () => {
      fixture.componentRef.setInput('segments', []);
      fixture.detectChanges();

      const tabGroup = await loader.getHarness(MatTabGroupHarness);
      await tabGroup.selectTab({ label: 'Сегменты' });

      fixture.detectChanges();

      const emptyStates = fixture.debugElement.queryAll(By.css('.empty-state'));
      const segmentMsg = emptyStates.find((el) =>
        el.nativeElement.textContent.includes('Нет маршрутов'),
      );

      expect(segmentMsg).toBeTruthy();
    });
  });
});
