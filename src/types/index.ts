export type State = 'initial' | 'result';

export type Unity = 'metric' | 'imperial';

export type MetricMeasurement = {
  height: number;
  weight: number;
};

export type ImperialMeasurement = {
  height: {
    feet: number;
    inches: number;
  };
  weight: {
    stones: number;
    pounds: number;
  };
};

export type IdealWeightRange = {
  min: string;
  max: string;
};
