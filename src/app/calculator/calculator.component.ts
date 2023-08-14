import { Component } from '@angular/core';
import { UnitsConversor } from '../../utils/unitsConversor';
import {
  State,
  MetricMeasurement,
  ImperialMeasurement,
  Unity,
} from 'src/types';

export const HEALTHY_BMI = {
  min: 18.5,
  max: 24.9,
};

const CONVERSION_FACTOR = 703;

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.scss'],
})
export class CalculatorComponent {
  state: State = 'initial';
  unity: Unity = 'metric';

  result!: string;
  metricRange = '';
  imperialRange = '';

  metricData: MetricMeasurement = {
    height: 0,
    weight: 0,
  };

  imperialData: ImperialMeasurement = {
    height: {
      feet: 0,
      inches: 0,
    },
    weight: {
      stones: 0,
      pounds: 0,
    },
  };

  classification = '';

  constructor(private conversor: UnitsConversor) {}

  public setUnity(event: Event) {
    const input = event.target as HTMLInputElement;
    this.unity = input.value as Unity;
    this.state = 'initial';
  }

  public calculate() {
    const hasMetricData =
      this.metricData.height > 0 && this.metricData.weight > 0;

    const hasImperialData =
      this.imperialData.height.feet > 0 &&
      this.imperialData.height.inches > 0 &&
      this.imperialData.weight.pounds > 0 &&
      this.imperialData.weight.stones > 0;

    if (hasMetricData) {
      const weightRange = {
        min: this.getMetricWeight(
          this.metricData.height,
          HEALTHY_BMI.min
        ).toFixed(1),
        max: this.getMetricWeight(
          this.metricData.height,
          HEALTHY_BMI.max
        ).toFixed(1),
      };
      const BMI = this.metricBMI(this.metricData);
      this.result = BMI.toFixed(1);
      this.classification = this.verifyClassification(BMI);
      this.metricRange = `${weightRange.min}kgs - ${weightRange.max}kgs`;
      this.state = 'result';
    } else if (hasImperialData) {
      const BMI = this.imperialBMI(this.imperialData);
      this.classification = this.verifyClassification(BMI);
      this.result = BMI.toFixed(1);

      const weightRange = {
        min: this.getImperialWeight(this.imperialData, HEALTHY_BMI.min),
        max: this.getImperialWeight(this.imperialData, HEALTHY_BMI.max),
      };

      this.imperialRange = `${weightRange.min.stones.result}st ${weightRange.min.stones.rest}lbs - ${weightRange.max.stones.result}st ${weightRange.max.stones.rest}lbs`;
      this.state = 'result';
    }
  }

  public getMetricWeight(height: number, BMI: number): number {
    return BMI * this.conversor.cmToMeters(height) ** 2;
  }

  public getImperialWeight(data: ImperialMeasurement, BMI: number) {
    const totalHeight =
      data.height.inches + this.conversor.feetToInches(data.height.feet);

    const result = (BMI * totalHeight ** 2) / CONVERSION_FACTOR;
    const stones = this.conversor.poudsToStone(Math.floor(result));

    return { result, stones };
  }

  public verifyClassification(BMI: number): string {
    let classification = '';

    if (BMI < 18.5) {
      classification = 'Underweight';
    }

    if (BMI > 18.5 && BMI < 24.9) {
      classification = 'Healthy Weight';
    }

    if (BMI > 25 && BMI < 29.9) {
      classification = 'Overweight';
    }

    if (BMI > 30) {
      classification = 'Obesity';
    }

    return classification;
  }

  private metricBMI(data: MetricMeasurement): number {
    return data.weight / this.conversor.cmToMeters(data.height) ** 2;
  }

  private imperialBMI(data: ImperialMeasurement): number {
    const totalHeight =
      data.height.inches + this.conversor.feetToInches(data.height.feet);

    const totalWeight =
      data.weight.pounds + this.conversor.stoneToPounds(data.weight.stones);

    return (totalWeight / totalHeight ** 2) * CONVERSION_FACTOR;
  }
}
