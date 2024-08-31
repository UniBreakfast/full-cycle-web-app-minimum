const form = document.forms[0];
const ul = document.getElementById('list');

form.onsubmit = handleSubmit;

main();

async function main() {
  const items = await getItems();

  showItems(items);
}

async function handleSubmit(event) {
  event.preventDefault();

  const name = form.name.value;

  addItem(name);
  form.reset();
}

async function addItem(name) {
  const init = { method: 'POST', body: `name=${name}` };
  const response = await fetch('/new', init);
  const items = await response.json();

  showItems(items);
}

async function getItems() {
  const response = await fetch('/items');
  const items = await response.json();

  return items;
}

function showItems(items) {
  ul.innerHTML = items.map(item => `<li>${item.name}</li>`).join('');
}
