export function validEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
const form = document.querySelector('form');
const input = document.querySelector('#email');
const result = document.querySelector('[role="status"]');
if (
  form instanceof HTMLFormElement &&
  input instanceof HTMLInputElement &&
  result instanceof HTMLElement
) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    result.textContent = validEmail(input.value)
      ? 'Validation complete.'
      : 'Enter a valid email address.';
  });
}
