import { generateDates } from '../App';

describe('generateDates', () => {
  test('generates correct number of dates for group size 7', () => {
    const dates = generateDates(7);
    expect(dates.length).toBe(28);
  });

  test('generates correct number of dates for group size 5', () => {
    const dates = generateDates(5);
    expect(dates.length).toBe(30);
  });

  test('excludes Sundays', () => {
    const dates = generateDates(7);
    dates.forEach(date => {
      expect(date.getDay()).not.toBe(0);
    });
  });

  test('generates dates in chronological order', () => {
    const dates = generateDates(7);
    for (let i = 1; i < dates.length; i++) {
      expect(dates[i] > dates[i - 1]).toBe(true);
    }
  });

  test('generates correct number of dates for group size 3', () => {
    const dates = generateDates(3);
    expect(dates.length).toBe(30);
  });

  test('generates dates spanning exactly 4 weeks plus any necessary extra days', () => {
    const dates = generateDates(4);
    const lastDate = dates[dates.length - 1];
    const firstDate = dates[0];
    const daysDifference = Math.round((lastDate - firstDate) / (1000 * 60 * 60 * 24));
    expect(daysDifference).toBeGreaterThanOrEqual(27);
    expect(daysDifference).toBeLessThan(35);
  });
});
