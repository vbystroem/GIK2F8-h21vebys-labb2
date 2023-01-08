todoForm.title.addEventListener('keyup', (e) => validateField(e.target));
todoForm.title.addEventListener('blur', (e) => validateField(e.target));
todoForm.description.addEventListener('input', (e) => validateField(e.target));
todoForm.description.addEventListener('blur', (e) => validateField(e.target));

todoForm.dueDate.addEventListener('input', (e) => validateField(e.target));
todoForm.dueDate.addEventListener('blur', (e) => validateField(e.target));

todoForm.addEventListener('submit', onSubmit);

const todoListElement = document.getElementById('todoList');

let titleValid = true;
let descriptionValid = true;
let dueDateValid = true;

const api = new Api('http://localhost:5000/tasks');

function validateField(field) {
  const { name, value } = field;
  let = validationMessage = '';
  switch (name) {
    case 'title': {
      if (value.length < 2) {
        titleValid = false;
        validationMessage = "Fältet 'Titel' måste innehålla minst 2 tecken.";
      } else if (value.length > 100) {
        titleValid = false;
        validationMessage =
          "Fältet 'Titel' får inte innehålla mer än 100 tecken.";
      } else {
        titleValid = true;
      }
      break;
    }
    case 'description': {
      if (value.length > 500) {
        descriptionValid = false;
        validationMessage =
          "Fältet 'Beskrvining' får inte innehålla mer än 500 tecken.";
      } else {
        descriptionValid = true;
      }
      break;
    }
    case 'dueDate': {
      if (value.length === 0) {
        dueDateValid = false;
        validationMessage = "Fältet 'Slutförd senast' är obligatorisk.";
      } else {
        dueDateValid = true;
      }
      break;
    }
  }
  field.previousElementSibling.innerText = validationMessage;
  field.previousElementSibling.classList.remove('hidden');
}


function onSubmit(e) {
  e.preventDefault();
  if (titleValid && descriptionValid && dueDateValid) {
    console.log('Submit');

    saveTask();
  }
}


function saveTask() {
  const task = {
    title: todoForm.title.value,
    description: todoForm.description.value,
    dueDate: todoForm.dueDate.value,
    completed: false,
  };
  api.create(task).then((task) => {
    if (task) {
      renderList();
    }
  });
}


function renderList() {
  console.log('rendering');

  api.getAll().then((tasks) => {
    todoListElement.innerHTML = '';

    tasks.sort(function(taskone, tasktwo) {
      if(taskone.dueDate > tasktwo.dueDate) {return 1;}
      if(taskone.dueDate < tasktwo.dueDate) {return -1;}
      return 0;
    })
    if (tasks && tasks.length > 0) {
      tasks.forEach((task) => {
        todoListElement.insertAdjacentHTML('beforeend', renderTask(task));
      });
    }
  });
}


function renderTask({ id, title, description, dueDate, completed }) {
  let html =`<li class="select-none mt-2 py-2">`

  if (completed == false) {
    html += `
      <div class="flex items-center">
        <h3 class="flex-1 text-xl font-mono text-teal-600 lowercase">${title}</h3>
        <div>
          <span>${dueDate}</span>
          <button onclick="deleteTask(${id})" class="inline-block bg-gray-400 text-xs text-black px-3 py-1 rounded-md ml-2">Ta bort</button>
        </div>
      </div>`;
  }
  else {
    html += `
      <div class="flex items-center">
        <h3 class="flex-1 text-xl font-bold font-mono text-lime-600 uppercase">${title}</h3>
        <div>
          <span>${dueDate}</span>
          <button onclick="deleteTask(${id})" class="inline-block bg-gray-400 text-xs text-black px-3 py-1 rounded-md ml-2">Ta bort</button>
        </div>
      </div>`;
  }

  description &&
    (html += `
      <p class="text-s font-mono">${description}</p>
  `);

  html += `
    </li>`;
  if (completed == false) {
    html +=
    `
    <div id="id${id}" class="mb-10" onclick="done(${id}, ${completed})">
      <div id="child${id}" class="m-1 h-4 w-4 bg-white rounded-full"></div>
    </div>
    `;
  }
  else {
    html +=
    `
      <div id="id${id}" class="mb-10" onclick="done(${id}, ${completed})">
        <div id="child${id}" class="m-1 h-4 w-4 border-3 bg-lime-500 rounded-full"></div>
      </div>
    `;
  }
  return html;
}


function deleteTask(id) {
  api.remove(id).then((result) => {

    renderList();
  });
}


function done (id, completed) {
  if (completed == false) {
    completed = true;
  }
  else {
    completed = false;
  }
    api.update(id, completed).then((result) => {renderList()});
}


renderList();