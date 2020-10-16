// ========== imports ==========
import './default.js';

// ========== DOM references ==========
const todoGroup = document.querySelector('.todo-group');
const addTodoForm = document.querySelector('.add-todo-form');
const searchTodoForm = document.querySelector('.search-todo-form');
const darkToggleForm = document.querySelector('.dark-toggle-form');

// ========== global variables ==========
const colName = 'todos';

// ========== script ==========
// add todo
class TodoAdder {
    constructor(colName, todo) {
        this.colName = colName;
        this.todo = todo;
        this.created_at = new Date();
        this.newTodo = {
            todo: this.todo,
            created_at: this.created_at
        };
    }

    add = function () {
        // add to database
        firebase.firestore().collection(this.colName).add(this.newTodo).then(() => {
            console.log('Todo added!');
        }).catch(err => {
            console.log(err);
        });
    }
}

// update todo
class TodoUpdater {
    constructor(colName, todoGroup) {
        this.colName = colName;
        this.todoGroup = todoGroup;
    }

    update = function () {
        firebase.firestore().collection(this.colName).orderBy('created_at').onSnapshot(snapshot => {
            snapshot.docChanges().forEach(change => {
                const todo = change.doc.data().todo;
                const id = change.doc.id;
                const todoItems = document.querySelectorAll('.todo-item');

                // update todo
                if (change.type === 'added') {
                    // add todo
                    this.todoGroup.innerHTML += `
                        <li class="todo-item" data-id="${id}">
                            <p class="todo-text">${todo}</p>
                            <button class="todo-delete-btn"><i class="fas fa-trash-alt todo-delete-icon"></i></button>
                        </li>
                    `;
                } else if (change.type === 'removed') {
                    // delete todo
                    todoItems.forEach(todoItem => {
                        if (todoItem.getAttribute('data-id') === id) {
                            todoItem.remove();
                        };
                    });
                };
            });
        });
    }
}

// delete todo
class TodoDeleter {
    constructor(colName, id) {
        this.colName = colName;
        this.id = id;
    }

    delete = function () {
        firebase.firestore().collection(this.colName).doc(this.id).delete().then(() => {
            console.log('Todo deleted!');
        }).catch(err => {
            console.log(err);
        })
    }
}

// serach todo
class TodoSearcher {
    constructor(searchInputValue, todoItems) {
        this.searchInputValue = searchInputValue;
        this.todoItems = todoItems;
    }

    search = function () {
        const noMatchTodoItems = this.todoItems.filter(todoItem => {
            return !todoItem.innerText.trim().toLowerCase().includes(this.searchInputValue);
        });
        
        noMatchTodoItems.forEach(noMatchTodoItem => {
            noMatchTodoItem.classList.add('filtered');
        });

        const matchTodoItems = this.todoItems.filter(todoItem => {
            return todoItem.innerText.trim().toLowerCase().includes(this.searchInputValue);
        });

        matchTodoItems.forEach(matchTodoItem => {
            matchTodoItem.classList.remove('filtered');
        });
    }
}


// main
const main = function () {
    // update todo
    const todoUpdater = new TodoUpdater(colName, todoGroup);
    todoUpdater.update();

    // add todo
    addTodoForm.addEventListener('submit', e => {
        e.preventDefault();

        // get todo input value
        const todo = addTodoForm.addTodoInput.value.trim();

        // add to database
        if (!todo) {
            alert('Empty todo cannot be added!');
        } else if (todo) {
            const todoAdder = new TodoAdder(colName, todo);
            todoAdder.add();
        };

        // reset the form
        addTodoForm.reset();
    });

    // delete todo
    todoGroup.addEventListener('click', (e) => {
        if (e.target.tagName === 'I' || e.target.tagName === 'BUTTON') {
            const id = e.target.parentElement.parentElement.getAttribute('data-id');

            // delete todo from database
            const todoDeleter = new TodoDeleter(colName, id);
            todoDeleter.delete();
        };
    });

    // search todo
    searchTodoForm.addEventListener('keyup', e => {
        const searchInputValue = e.target.value.trim().toLowerCase();
        const todoItems = Array.from(todoGroup.children);

        // search todo
        const todoSearcher = new TodoSearcher(searchInputValue, todoItems);
        todoSearcher.search();
    });

    // dark mode
    darkToggleForm.addEventListener('change', () => {
        if (darkToggleForm.darkToggle.checked) {
            document.documentElement.style.setProperty('--main', 'rgba(0, 0, 0, 0.7)');
            document.documentElement.style.setProperty('--contrast', 'rgba(255, 255, 255, 0.7)');
        } else if (!darkToggleForm.darkToggle.checked) {
            document.documentElement.style.setProperty('--main', 'rgba(255, 255, 255, 0.7)');
            document.documentElement.style.setProperty('--contrast', 'rgba(0, 0, 0, 0.7');
        };
    });
};

main();