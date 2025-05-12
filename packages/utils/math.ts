export const pow = (base: number, exponent: number) => {
  return Math.pow(base, exponent);
};

export const round = (number: number, decimalDigits = 0) => {
  const powValue = pow(10, decimalDigits);
  return Math.round(number * powValue) / powValue;
};

export const calculateBmi = (height: number, weight: number) => {
  if (height === 0 || weight === 0) {
    return 0;
  }

  const heightInMeter = height / 100;
  return round(weight / pow(heightInMeter, 2), 1);
};

export const max = (...numbers: number[]) => {
  return Math.max(...numbers);
};
