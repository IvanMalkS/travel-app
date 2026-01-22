import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FlightFormComponent } from './flight-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatSelectHarness } from '@angular/material/select/testing';
import { MatInputHarness } from '@angular/material/input/testing';
import { MatButtonHarness } from '@angular/material/button/testing';
import { By } from '@angular/platform-browser';
import { AIRPORTS } from '../../const';

jest.mock('uuid', () => ({
  v4: () => 'test-uuid-1234',
}));

describe('FlightFormComponent', () => {
  let component: FlightFormComponent;
  let fixture: ComponentFixture<FlightFormComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlightFormComponent, ReactiveFormsModule],
      providers: [],
    }).compileComponents();

    fixture = TestBed.createComponent(FlightFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Validation', () => {
    it('should disable submit button if arrival time is before departure time', async () => {
      const depDateInput = await loader.getHarness(
        MatInputHarness.with({ selector: '[formControlName="depDate"]' }),
      );
      const arrDateInput = await loader.getHarness(
        MatInputHarness.with({ selector: '[formControlName="arrDate"]' }),
      );
      const depTimeInput = await loader.getHarness(
        MatInputHarness.with({ selector: '[formControlName="depTime"]' }),
      );
      const arrTimeInput = await loader.getHarness(
        MatInputHarness.with({ selector: '[formControlName="arrTime"]' }),
      );
      const submitBtn = await loader.getHarness(
        MatButtonHarness.with({ text: 'Добавить в маршрут' }),
      );

      await depDateInput.setValue('2026-01-10');
      await arrDateInput.setValue('2026-01-10');

      await depTimeInput.setValue('12:00');
      await arrTimeInput.setValue('10:00');
      await arrTimeInput.blur();

      expect(await submitBtn.isDisabled()).toBe(true);

      const errorMsg = fixture.debugElement.query(By.css('.error-message'));
      expect(errorMsg).toBeTruthy();
      expect(errorMsg.nativeElement.textContent).toContain(
        'Время прилета не может быть раньше',
      );
    });

    it('should enable submit button if form is valid', async () => {
      const originSelect = await loader.getHarness(
        MatSelectHarness.with({ selector: '[formControlName="origin"]' }),
      );
      const destSelect = await loader.getHarness(
        MatSelectHarness.with({ selector: '[formControlName="destination"]' }),
      );
      const depTimeInput = await loader.getHarness(
        MatInputHarness.with({ selector: '[formControlName="depTime"]' }),
      );
      const arrTimeInput = await loader.getHarness(
        MatInputHarness.with({ selector: '[formControlName="arrTime"]' }),
      );
      const submitBtn = await loader.getHarness(
        MatButtonHarness.with({ text: 'Добавить в маршрут' }),
      );

      await originSelect.open();
      await originSelect.clickOptions({ text: new RegExp(AIRPORTS[0].city) });

      await destSelect.open();
      await destSelect.clickOptions({ text: new RegExp(AIRPORTS[1].city) });

      await depTimeInput.setValue('12:00');
      await arrTimeInput.setValue('14:00');

      expect(await submitBtn.isDisabled()).toBe(false);
    });
  });

  describe('Interaction Logic', () => {
    it('should reset destination when origin changes', async () => {
      const originSelect = await loader.getHarness(
        MatSelectHarness.with({ selector: '[formControlName="origin"]' }),
      );
      const destSelect = await loader.getHarness(
        MatSelectHarness.with({ selector: '[formControlName="destination"]' }),
      );

      await originSelect.open();
      const originOptions = await originSelect.getOptions();
      await originOptions[0].click();

      await destSelect.open();
      const destOptions = await destSelect.getOptions();
      await destOptions[0].click();

      expect(await destSelect.isEmpty()).toBe(false);

      const destValueText = await destSelect.getValueText();

      await originSelect.open();
      await originSelect.clickOptions({ text: destValueText });

      expect(await destSelect.isEmpty()).toBe(true);
    });

    it('should filter destination airports with exclude selected origin', async () => {
      const originSelect = await loader.getHarness(
        MatSelectHarness.with({ selector: '[formControlName="origin"]' }),
      );
      const destSelect = await loader.getHarness(
        MatSelectHarness.with({ selector: '[formControlName="destination"]' }),
      );

      await originSelect.open();
      const originOptions = await originSelect.getOptions();
      const firstOriginText = await originOptions[0].getText();
      await originOptions[0].click();

      await destSelect.open();
      const destOptions = await destSelect.getOptions();
      const destTexts = await Promise.all(destOptions.map((o) => o.getText()));

      const found = destTexts.find((text) => text === firstOriginText);
      expect(found).toBeUndefined();

      expect(destOptions.length).toBe(AIRPORTS.length - 1);
    });
  });
});
