export class UnitsConversor {
  public cmToMeters(value: number): number {
    return value / 100;
  }

  public stoneToPounds(value: number): number {
    return value * 14;
  }

  public poudsToStone(value: number) {
    const result = Math.floor(value / 14);
    const rest = value % 14;
    return { result, rest };
  }

  public feetToInches(value: number): number {
    return value * 12;
  }
}
