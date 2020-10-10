// ========== imports ==========
import './default.js';

// ========== DOM references ==========
const todoGroup = document.querySelector('.todo-group');

// ========== script ==========
// get todo
class TodoGetter {
    constructor(colName) {
        this.colName = colName;
    }

    get = async function () {
        // get collection
        const cols = await firebase.firestore().collection(this.colName).get();

        // get documents
        const docs = cols.docs;

        // get properties
        const props = [];
        docs.forEach(doc => {
            props.push(doc.data());
        });

        // get todos
        const todos = [];
        props.forEach(prop => {
            todos.push(prop.todo);
        });

        return todos;
    }
}

// display todo
class TodoDisplayer {
    constructor(todos, todoGroup) {
        this.todos = todos;
        this.todoGroup = todoGroup;
    }

    display = function () {
        this.todos.forEach(todo => {
            this.todoGroup.innerHTML += `
                <li class="todo-item">
                    <p class="todo-text">${todo}</p>
                    <button class="todo-delete-btn"><i class="fas fa-trash-alt todo-delete-icon"></i></button>
                </li>
            `;
        });
    }
}

// main
const main = function () {
    // initialise
    const init = function () {
        // get todo
        const colName = 'todos';
        const todoGetter = new TodoGetter(colName);
        todoGetter.get().then(todos => {
            // display todo
            const todoDisplayer = new TodoDisplayer(todos, todoGroup);
            todoDisplayer.display();
        }).catch(err => {
            console.log(err);
        });
    };
    init();
};

main();