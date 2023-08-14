import { render, screen } from '@testing-library/angular';
import { FormsModule } from '@angular/forms';
import userEvent from '@testing-library/user-event';

import { CalculatorComponent, HEALTHY_BMI } from './calculator.component';
import { UnitsConversor } from '../../utils/unitsConversor';

const sut = async () => {
  const { fixture } = await render(CalculatorComponent, {
    imports: [FormsModule],
    providers: [UnitsConversor],
  });

  return fixture.componentInstance;
};

describe('CalculatorComponent', () => {
  let component: CalculatorComponent;
  it('should create', async () => {
    await sut();

    expect(screen.getByTestId('inputs-container')).toBeTruthy();
  });

  describe('CalculatorComponent - Inputs', () => {
    beforeEach(async () => {
      component = await sut();
    });

    it('should change the unity system and change the inputs container when the radio button is clicked', async () => {
      const imperialRadioBtn = screen.getByTestId('imperial-setter');

      await userEvent.click(imperialRadioBtn);
      expect(component.unity).toBe('imperial');
      expect(screen.queryByTestId('metric-inputs')).toBeFalsy();
      expect(screen.getByTestId('imperial-inputs')).toBeTruthy();
    });

    describe('CalculatorComponent - Inputs - Metric Values', () => {
      it('should set the height in metric object', async () => {
        const heightInput = screen.getByTestId('metric-height-input');

        await userEvent.click(heightInput);
        await userEvent.type(heightInput, '185');
        expect(component.metricData.height).toBeCloseTo(185);
      });

      it('should set the weight in metric object', async () => {
        const weightInput = screen.getByTestId('metric-weight-input');

        await userEvent.click(weightInput);
        await userEvent.type(weightInput, '80');
        expect(component.metricData.weight).toBeCloseTo(80);
      });
    });

    describe('CalculatorComponent - Inputs - Imperial Values', () => {
      beforeEach(async () => {
        const imperialRadioBtn = screen.getByTestId('imperial-setter');
        await userEvent.click(imperialRadioBtn);
      });

      it('should set feet value in the imperial height', async () => {
        const feetInput = screen.getByTestId('feet-input');

        await userEvent.click(feetInput);
        await userEvent.type(feetInput, '5');
        expect(component.imperialData.height.feet).toBeCloseTo(5);
      });

      it('should set inches value in the imperial height', async () => {
        const inchesInput = screen.getByTestId('inches-input');

        await userEvent.click(inchesInput);
        await userEvent.type(inchesInput, '11');
        expect(component.imperialData.height.inches).toBeCloseTo(11);
      });

      it('should set stones value in the imperial weight', async () => {
        const stonesInput = screen.getByTestId('stones-input');

        await userEvent.click(stonesInput);
        await userEvent.type(stonesInput, '11');
        expect(component.imperialData.weight.stones).toBeCloseTo(11);
      });

      it('should set pounds value in the imperial weight', async () => {
        const poundsInput = screen.getByTestId('pounds-input');

        await userEvent.click(poundsInput);
        await userEvent.type(poundsInput, '4');
        expect(component.imperialData.weight.pounds).toBeCloseTo(4);
      });
    });
  });

  describe('CalculatorComponent - Calcule methods', () => {
    beforeEach(async () => {
      component = await sut();
    });

    const metricData = {
      height: 185,
      weight: 80,
    };

    const imperialData = {
      height: {
        feet: 5,
        inches: 11,
      },
      weight: {
        pounds: 4,
        stones: 11,
      },
    };

    it('should not calculate when the data are lower or equal to 0', () => {
      component.metricData = {
        height: 0,
        weight: -1,
      };
      component.calculate();
      expect(component.result).toBeFalsy();
    });

    it('should calculate the BMI in metric system', () => {
      component.metricData = metricData;
      component.calculate();

      expect(component.result).toBe('23.4');
    });

    it('should calculate the BMI in imperial system', () => {
      component.imperialData = imperialData;
      component.calculate();

      expect(component.result).toBe('22.0');
    });

    it('should calculate the min healthy weight in metric system', () => {
      const minWeight = component.getMetricWeight(
        metricData.height,
        HEALTHY_BMI.min
      );

      expect(minWeight).toBeCloseTo(63.3, 1);
    });

    it('should calculate the max healthy weight in metric system', () => {
      const maxWeight = component.getMetricWeight(
        metricData.height,
        HEALTHY_BMI.max
      );

      expect(maxWeight).toBeCloseTo(85.2, 1);
    });

    it('should calculate the min healthy weight in imperial system', () => {
      const weight = component.getImperialWeight(imperialData, HEALTHY_BMI.min);

      expect(weight.result).toBeCloseTo(132, -1);
    });

    it('should calculate the min healthy weight in imperial system', () => {
      const weight = component.getImperialWeight(imperialData, HEALTHY_BMI.max);

      expect(weight.result).toBeCloseTo(178, -1);
    });
  });
});
