const menu = document.querySelector('button[aria-controls="navigation"]');
const navigation = document.querySelector('#navigation');
if (menu instanceof HTMLButtonElement && navigation instanceof HTMLElement) {
  menu.addEventListener('click', () => {
    const expanded = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(expanded));
    navigation.hidden = !expanded;
  });
}
const dialog = document.querySelector('dialog');
const open = document.querySelector('#open-dialog');
const close = document.querySelector('#close-dialog');
if (dialog instanceof HTMLDialogElement && open instanceof HTMLButtonElement) {
  open.addEventListener('click', () => {
    open.focus();
    dialog.showModal();
  });
  close?.addEventListener('click', () => {
    dialog.close();
  });
}
const form = document.querySelector('form');
const error = document.querySelector('#error');
const success = document.querySelector('#success');
if (
  form instanceof HTMLFormElement &&
  error instanceof HTMLElement &&
  success instanceof HTMLElement
) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const valid = form.checkValidity();
    error.hidden = valid;
    success.hidden = !valid;
  });
}
