import { Component } from '@angular/core';

type State = 'initial' | 'result';

type Metric = 'metric' | 'imperial';

type MetricMeasurement = {
  height: number;
  weight: number;
};

type ImperialMeasurement = {
  height: {
    foots: number;
    inches: number;
  };
  weight: {
    stones: number;
    pounds: number;
  };
};

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.scss'],
})
export class CalculatorComponent {
  state: State = 'initial';
  unity: Metric = 'metric';

  result!: number;
  range!: string;

  metricData: MetricMeasurement = {
    height: 0,
    weight: 0,
  };

  imperialData: ImperialMeasurement = {
    height: {
      foots: 0,
      inches: 0,
    },
    weight: {
      stones: 0,
      pounds: 0,
    },
  };

  classification = '';

  public setUnity(event: Event) {
    const input = event.target as HTMLInputElement;
    this.unity = input.value as Metric;
  }
}
