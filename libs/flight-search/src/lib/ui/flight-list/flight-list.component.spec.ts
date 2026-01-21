import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FlightListComponent } from './flight-list.component';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatCardHarness } from '@angular/material/card/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { Flight } from '../../models/flight.interface';
import { By } from '@angular/platform-browser';

describe('FlightListComponent', () => {
  let component: FlightListComponent;
  let fixture: ComponentFixture<FlightListComponent>;
  let loader: HarnessLoader;

  const mockFlight: Flight = {
    id: 'f1',
    origin: { code: 'OVB', city: 'Новосибирск' },
    destination: { code: 'MOW', city: 'Москва' },
    departureTime: new Date('2025-10-05T12:00:00'),
    arrivalTime: new Date('2025-10-05T16:00:00'),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlightListComponent],
      providers: [provideNoopAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(FlightListComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('flights', []);

    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show empty state when no flights provided', () => {
    fixture.componentRef.setInput('flights', []);
    fixture.detectChanges();

    const emptyState = fixture.debugElement.query(By.css('.empty-state'));
    expect(emptyState).toBeTruthy();
    expect(emptyState.nativeElement.textContent).toContain(
      'Нет добавленных перелетов',
    );
  });

  it('should render flight card with correct details', async () => {
    fixture.componentRef.setInput('flights', [mockFlight]);
    fixture.detectChanges();

    const cards = await loader.getAllHarnesses(
      MatCardHarness.with({ selector: '.flight-card' }),
    );
    expect(cards.length).toBe(1);

    const cardText = await cards[0].getText();

    expect(cardText).toContain('Новосибирск');
    expect(cardText).toContain('OVB');
    expect(cardText).toContain('Москва');

    expect(cardText).toContain('05.10.2025 12:00');
  });

  it('should emit delete event with flight ID when delete button is clicked', async () => {
    fixture.componentRef.setInput('flights', [mockFlight]);
    fixture.detectChanges();

    let deletedId: string | undefined;
    component.delete.subscribe((id) => (deletedId = id));

    const deleteBtn = await loader.getHarness(MatButtonHarness);

    await deleteBtn.click();

    expect(deletedId).toBe('f1');
  });
});
