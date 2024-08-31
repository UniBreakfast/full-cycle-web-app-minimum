const form = document.forms[0];
const ul = document.getElementById('list');

form.onsubmit = handleSubmit;
ul.onclick = handleClick;

main();

async function main() {
  const items = await getItems();

  showItems(items);
}

async function handleSubmit(event) {
  event.preventDefault();

  const name = form.name.value;

  const items = await addItem(name);
  
  form.reset();

  showItems(items);
}

async function handleClick(event) {
  const btn = event.target;
  const li = btn.parentElement;
  const id = li.dataset.id;

  if (btn.value === 'edit') {

  } else if (btn.value === 'delete') {
    const items = await deleteItem(id);

    showItems(items);
  }
}

async function addItem(name) {
  const init = { method: 'POST', body: `name=${name}` };
  const response = await fetch('/new', init);
  const items = await response.json();

  return items;
}

async function getItems() {
  const response = await fetch('/items');
  const items = await response.json();

  return items;
}

async function deleteItem(id) {
  const init = { method: 'DELETE', body: `id=${id}` };
  const response = await fetch('/delete', init);
  const items = await response.json();

  return items;
}

function showItems(items) {
  ul.innerHTML = items.map(buildItem).join('');
}

function buildItem(item) {
  return `<li data-id="${item._id}">
    <span>${item.name}</span>
    <button value="edit">Edit</button>
    <button value="delete">Delete</button>
  </li>`;
}
