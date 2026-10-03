export function validEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
const form = document.querySelector('form');
const input = document.querySelector('#email');
const result = document.querySelector('[role="status"]');
const submit = document.querySelector('button[type="submit"]');
if (
  form instanceof HTMLFormElement &&
  input instanceof HTMLInputElement &&
  result instanceof HTMLElement &&
  submit instanceof HTMLButtonElement
) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    result.textContent = validEmail(input.value)
      ? 'Validation complete.'
      : 'Enter a valid email address.';
  });
  submit.disabled = false;
}
