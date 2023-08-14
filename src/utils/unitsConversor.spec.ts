import { UnitsConversor } from './unitsConversor';

const sut = () => {
  return new UnitsConversor();
};

describe('Conversor', () => {
  it('should convert centimeters to meters', () => {
    expect(sut().cmToMeters(100)).toBeCloseTo(1);
  });

  it('should convert stones to pounds', () => {
    expect(sut().stoneToPounds(1)).toBeCloseTo(14);
  });

  it('should convert pounds to stones', () => {
    expect(sut().poudsToStone(14).result).toBeCloseTo(1);
  });

  it('should convert feet to inches', () => {
    expect(sut().feetToInches(1)).toBeCloseTo(12);
  });
});
