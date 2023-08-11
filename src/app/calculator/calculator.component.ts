import { Component } from '@angular/core';
import { UnitsConversor } from '../../utils/unitsConversor';
import {
  State,
  Metric,
  IdealWeightRange,
  MetricMeasurement,
  ImperialMeasurement,
} from 'src/types';

const HEALTHY_BMI = {
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
  unity: Metric = 'metric';

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
    this.unity = input.value as Metric;
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
      this.result = this.metricBMI(this.metricData);
      this.metricRange = `${weightRange.min}kgs - ${weightRange.max}kgs`;
      this.state = 'result';
    } else if (hasImperialData) {
      this.result = this.imperialBMI(this.imperialData);

      const weightRange = {
        min: this.conversor.poudsToStone(
          this.getImperialWeight(this.imperialData, HEALTHY_BMI.min)
        ),
        max: this.conversor.poudsToStone(
          this.getImperialWeight(this.imperialData, HEALTHY_BMI.max)
        ),
      };
      console.log(weightRange);
      this.state = 'result';
    }
  }

  private metricBMI(data: MetricMeasurement): string {
    return (data.weight / this.conversor.cmToMeters(data.height) ** 2).toFixed(
      1
    );
  }

  private imperialBMI(data: ImperialMeasurement): string {
    const totalHeight =
      data.height.inches + this.conversor.feetToInches(data.height.feet);

    const totalWeight =
      data.weight.pounds + this.conversor.stoneToPounds(data.weight.stones);

    return ((totalWeight / totalHeight ** 2) * CONVERSION_FACTOR).toFixed(1);
  }

  private getMetricWeight(height: number, BMI: number): number {
    return BMI * this.conversor.cmToMeters(height) ** 2;
  }

  private getImperialWeight(data: ImperialMeasurement, BMI: number): number {
    const totalHeight =
      data.height.inches + this.conversor.feetToInches(data.height.feet);

    return (BMI * CONVERSION_FACTOR ** 2) / totalHeight;
  }
}
