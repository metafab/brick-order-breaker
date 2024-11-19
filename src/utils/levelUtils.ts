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
    const expression = `${num1}${operator}${num2}`;
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
    const hours = Math.floor(Math.random() * 12) + 1;
    const mins = Math.floor(Math.random() * 4) * 15;
    const timeStr = `${hours}:${mins.toString().padStart(2, '0')}`;
    const totalMinutes = parseTimeToMinutes(timeStr);
    
    if (!minutes.has(totalMinutes)) {
      times.push(timeStr);
      minutes.add(totalMinutes);
    }
  }
  
  return times;
};

export const generateMixedSymbols = (count: number): Array<{value: number; display: string}> => {
  const symbols: Array<{value: number; display: string}> = [];
  const values = new Set<number>();
  
  while (symbols.length < count) {
    const value = Math.floor(Math.random() * 6) + 1;
    if (!values.has(value)) {
      const type = Math.floor(Math.random() * 3);
      let display: string;
      
      switch (type) {
        case 0:
          display = value.toString();
          break;
        case 1:
          display = toRomanNumeral(value);
          break;
        case 2:
          display = '🦊'.repeat(value);
          break;
        default:
          display = value.toString();
      }
      
      symbols.push({ value, display });
      values.add(value);
    }
  }
  
  return symbols;
};