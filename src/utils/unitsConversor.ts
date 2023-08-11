export class UnitsConversor {
  public cmToMeters(value: number): number {
    return value / 100;
  }

  public stoneToPounds(value: number): number {
    return value * 14;
  }

  public feetToInches(value: number): number {
    return value * 12;
  }
}
