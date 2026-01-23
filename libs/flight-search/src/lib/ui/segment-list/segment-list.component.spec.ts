import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SegmentListComponent } from './segment-list.component';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatCardHarness } from '@angular/material/card/testing';
import { By } from '@angular/platform-browser';
import { Segment } from '../../models/segment.interface';
import { Flight } from '../../models/flight.interface';

describe('SegmentListComponent', () => {
  let component: SegmentListComponent;
  let fixture: ComponentFixture<SegmentListComponent>;
  let loader: HarnessLoader;

  const mockFlight1: Flight = {
    id: 'f1',
    origin: { code: 'OVB', city: 'Новосибирск' },
    destination: { code: 'SVO', city: 'Москва' },
    departureTime: new Date('2025-01-01T10:00:00'),
    arrivalTime: new Date('2025-01-01T14:00:00'),
  };

  const mockFlight2: Flight = {
    id: 'f2',
    origin: { code: 'SVO', city: 'Москва' },
    destination: { code: 'IST', city: 'Стамбул' },
    departureTime: new Date('2025-01-01T18:00:00'),
    arrivalTime: new Date('2025-01-01T22:00:00'),
  };

  const mockSegment: Segment = {
    flights: [mockFlight1, mockFlight2],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SegmentListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SegmentListComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('segments', []);

    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display empty state message when segments list is empty', () => {
    fixture.componentRef.setInput('segments', []);
    fixture.detectChanges();

    const emptyStateEl = fixture.debugElement.query(By.css('.empty-state'));

    expect(emptyStateEl).toBeTruthy();
    expect(emptyStateEl.nativeElement.textContent).toContain(
      'Маршрутов пока нет',
    );
  });

  it('should not display empty state when segments are provided', () => {
    fixture.componentRef.setInput('segments', [mockSegment]);
    fixture.detectChanges();

    const emptyStateEl = fixture.debugElement.query(By.css('.empty-state'));
    expect(emptyStateEl).toBeNull();
  });

  it('should render correct number of segment cards', async () => {
    fixture.componentRef.setInput('segments', [mockSegment, mockSegment]);
    fixture.detectChanges();

    const cards = await loader.getAllHarnesses(
      MatCardHarness.with({ selector: '.segment-card' }),
    );
    expect(cards.length).toBe(2);
  });

  it('should display correct title and subtitle in the card', async () => {
    fixture.componentRef.setInput('segments', [mockSegment]);
    fixture.detectChanges();

    const card = await loader.getHarness(
      MatCardHarness.with({ selector: '.segment-card' }),
    );

    const title = await card.getTitleText();
    const subtitle = await card.getSubtitleText();

    expect(title).toBe('Маршрут #1');
    expect(subtitle).toContain('2 пересадок');
  });

  it('should display the chain of cities', async () => {
    fixture.componentRef.setInput('segments', [mockSegment]);
    fixture.detectChanges();

    const card = await loader.getHarness(MatCardHarness);
    const text = await card.getText();

    expect(text).toContain('Новосибирск');
    expect(text).toContain('Москва');
    expect(text).toContain('Стамбул');
  });
});
