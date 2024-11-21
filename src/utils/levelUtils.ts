import { toRomanNumeral } from './romanNumerals';

export const evaluateMathExpression = (expression: string): number => {
  const [num1, operator, num2] = expression.match(/(\d+)([-+])(\d+)/)?.slice(1) || [];
  if (!num1 || !operator || !num2) return 0;
  
  return operator === '+' 
    ? parseInt(num1) + parseInt(num2)
    : parseInt(num1) - parseInt(num2);
};

export const parseTimeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

export const generateMathExpressions = (count: number): string[] => {
  const expressions: string[] = [];
  const results = new Set<number>();
  
  while (expressions.length < count) {
    const num1 = Math.floor(Math.random() * 9) + 1;
    const num2 = Math.floor(Math.random() * 9) + 1;
    const operator = Math.random() < 0.5 ? '+' : '-';
    const expression = `${num1} ${operator} ${num2}`; // Added spaces around operator
    const result = evaluateMathExpression(expression);
    
    if (!results.has(result)) {
      expressions.push(expression);
      results.add(result);
    }
  }
  
  return expressions;
};

export const generateTimes = (count: number): string[] => {
  const times: string[] = [];
  const minutes = new Set<number>();
  
  while (times.length < count) {
    const hours = Math.floor(Math.random() * 24); // Changed to 24-hour format
    const mins = Math.floor(Math.random() * 4) * 15;
    const timeStr = `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`; // Added leading zeros
    const totalMinutes = parseTimeToMinutes(timeStr);
    
    if (!minutes.has(totalMinutes)) {
      times.push(timeStr);
      minutes.add(totalMinutes);
    }
  }
  
  return times;
};

export const generateMixedSymbols = (count: number): Array<{value: number; display: string}> => {
  if (count !== 6) {
    throw new Error('Level 11 requires exactly 6 bricks');
  }

  // Create 2 of each type
  const symbols: Array<{value: number; display: string}> = [];
  
  // Generate 2 numbers (1-6)
  for (let i = 0; i < 2; i++) {
    let value: number;
    do {
      value = Math.floor(Math.random() * 6) + 1;
    } while (symbols.some(s => s.value === value));
    
    symbols.push({ value, display: value.toString() });
  }
  
  // Generate 2 roman numerals (1-6)
  for (let i = 0; i < 2; i++) {
    let value: number;
    do {
      value = Math.floor(Math.random() * 6) + 1;
    } while (symbols.some(s => s.value === value));
    
    symbols.push({ value, display: toRomanNumeral(value) });
  }
  
  // Generate 2 fox sequences (1-6)
  for (let i = 0; i < 2; i++) {
    let value: number;
    do {
      value = Math.floor(Math.random() * 6) + 1;
    } while (symbols.some(s => s.value === value));
    
    symbols.push({ value, display: '🦊'.repeat(value) });
  }
  
  // Shuffle the array before returning
  return symbols.sort(() => Math.random() - 0.5);
};