// ========== imports ==========
import './default.js';
import { TodoAdder, TodoUpdater, TodoDeleter } from './data.js';
import { TodoSearcher } from './search.js';

// ========== DOM references ==========
const todoGroup = document.querySelector('.todo-group');
const addTodoForm = document.querySelector('.add-todo-form');
const searchTodoForm = document.querySelector('.search-todo-form');
const darkToggleForm = document.querySelector('.dark-toggle-form');

// ========== global variables ==========
const colName = 'todos';

// ========== script ==========
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