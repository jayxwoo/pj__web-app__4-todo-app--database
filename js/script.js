// ========== imports ==========
import './default.js';

// ========== references ==========
const todoGroup = document.querySelector('.todo-group');
const addTodoForm = document.querySelector('.add-todo-form');
const colName = 'todos';

// ========== script ==========
// get todo (from database)
class TodoGetter {
    constructor(colName) {
        this.colName = colName;
    }

    get = async function () {
        // get a collection
        const col = await firebase.firestore().collection(this.colName).orderBy('created_at').get();

        // get documents
        const docs = col.docs;
        
        // get properties
        const props = [];
        docs.forEach(doc => {
            props.push(doc.data());
        });

        return props;
    }
}

// display todo
class TodoDisplayer {
    constructor(props) {
        this.props = props;
        this.todoGroup = todoGroup;
    }

    display = function () {
        this.props.forEach(prop => {
            this.todoGroup.innerHTML += `
                <li class="todo-item">
                    <p class="todo-text">${prop.todo}</p>
                    <button class="todo-delete-btn"><i class="fas fa-trash-alt todo-delete-icon"></i></button>
                </li>
            `;
        });
    }
}

// add todo (to database)
class TodoAdder {
    constructor(colName, newTodo) {
        this.colName = colName;
        this.newTodo = newTodo;
    }

    add = function () {
        firebase.firestore().collection(this.colName).add(this.newTodo).then(() => {
            console.log('A new todo added!');
        }).catch((err) => {
            console.log(err);
        });
    }
}


// main
const main = function () {
    // update todo
    const updateTodo = function () {
        // get todo
        const todoGetter = new TodoGetter(colName);
        todoGetter.get().then(props => {
            // remove todo from ui
            todoGroup.innerHTML = '';
    
            // display todo
            const todoDisplayer = new TodoDisplayer(props, todoGroup);
            todoDisplayer.display();
        }).catch(err => {
            console.log(err);
        });
    };
    updateTodo();

    // add todo
    addTodoForm.addEventListener('submit', e => {
        e.preventDefault();
        
        // get input value
        const todo = addTodoForm.addTodoInput.value;

        // get the time
        const created_at = new Date();

        // create a property to be added to database
        const newTodo = {
            todo: todo,
            created_at: created_at
        };

        // add todo to database
        const todoAdder = new TodoAdder(colName, newTodo);
        todoAdder.add();

        // update todo
        updateTodo();

        addTodoForm.reset();
    });
};

main();