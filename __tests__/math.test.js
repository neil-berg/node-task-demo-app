const {
  calculateTip,
  fahrenheitToCelsius,
  celsiusToFahrenheit
} = require('../src/math');

test('Should calculate total with tip', () => {
  const total = calculateTip(10, 0.3);
  expect(total).toBe(13);
});

test('Convert 32 F to 0 C', () => {
  expect(fahrenheitToCelsius(32)).toBe(0);
});

test('Convert 0 C to 32 F', () => {
  expect(celsiusToFahrenheit(0)).toBe(32);
});
