export function toRomanNumeral(num: number): string {
  const romanNumerals = [
    { value: 10, numeral: 'X' },
    { value: 9, numeral: 'IX' },
    { value: 5, numeral: 'V' },
    { value: 4, numeral: 'IV' },
    { value: 1, numeral: 'I' }
  ];

  let result = '';
  let remaining = num;

  for (const { value, numeral } of romanNumerals) {
    while (remaining >= value) {
      result += numeral;
      remaining -= value;
    }
  }

  return result;
}

export function fromRomanNumeral(roman: string): number {
  const romanValues: { [key: string]: number } = {
    'I': 1,
    'V': 5,
    'X': 10
  };

  let result = 0;
  for (let i = 0; i < roman.length; i++) {
    const current = romanValues[roman[i]];
    const next = romanValues[roman[i + 1]];

    if (next && current < next) {
      result += next - current;
      i++; // Skip the next character as we've already used it
    } else {
      result += current;
    }
  }

  return result;
}