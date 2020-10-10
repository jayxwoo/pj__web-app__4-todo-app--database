// ========== imports ==========
import './default.js';

// ========== DOM references ==========
const todoGroup = document.querySelector('.todo-group');
const addTodoForm = document.querySelector('.add-todo-form');

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

// create todo document
class TodoDocCreater {
    constructor(addTodoInputValue, now) {
        this.addTodoInputValue = addTodoInputValue;
        this.now = now;
    }

    create = function () {
        const newDoc = {
            todo: this.addTodoInputValue,
            created_at: this.now
        };
        return newDoc;
    }
}

// save todo to database
class TodoSaver {
    constructor(newDoc) {
        this.newDoc = newDoc;
    }

    save = function () {
        firebase.firestore().collection('todos').add(this.newDoc).then(() => {
            console.log('A new document added.');
        }).catch(err => {
            console.log(err);
        });
    }
}

// main
const main = function () {
    // update todo list
    const updateTodoList = function () {
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
    updateTodoList();

    // add todo
    addTodoForm.addEventListener('submit', e => {
        e.preventDefault();

        // get todo input value
        const addTodoInputValue = addTodoForm.addTodoInput.value;

        // get the current time
        const now = new Date();

        // create todo document
        const todoDocCreater = new TodoDocCreater(addTodoInputValue, now);
        const newDoc = todoDocCreater.create();

        // save todo
        const todoSaver = new TodoSaver(newDoc);
        todoSaver.save();
        
        addTodoForm.reset();
    });
};

main();