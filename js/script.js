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

        return docs;
    }
}

// display todo
class TodoDisplayer {
    constructor(prop, docId, todoGroup) {
        this.prop = prop;
        this.docId = docId;
        this.todoGroup = todoGroup;
    }

    display = function () {
        this.todoGroup.innerHTML += `
            <li class="todo-item" data-id="${this.docId}">
                <p class="todo-text">${this.prop.todo}</p>
                <button class="todo-delete-btn"><i class="fas fa-trash-alt todo-delete-icon"></i></button>
            </li>
        `;
    }
}

// add todo (to database)
class TodoAdder {
    constructor(colName, newTodo, updateTodo) {
        this.colName = colName;
        this.newTodo = newTodo;
        this.updateTodo = updateTodo;
    }

    add = function () {
        firebase.firestore().collection(this.colName).add(this.newTodo).then(() => {
            console.log('Todo added!');
            this.updateTodo;
        }).catch((err) => {
            console.log(err);
        });
    }
}

// delete todo (from database)
class TodoDeleter {
    constructor(colName, docId, updateTodo) {
        this.colName = colName;
        this.docId = docId;
        this.updateTodo = updateTodo;
    }

    delete = function () {
        firebase.firestore().collection(this.colName).doc(this.docId).delete().then(() => {
            console.log('Todo deleted!')
            this.updateTodo;
        }).catch(err => {
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
        todoGetter.get().then(docs => {
            // remove todo from ui
            todoGroup.innerHTML = '';
    
            // display todo & set custom attribute
            docs.forEach(doc => {
                const todoDisplayer = new TodoDisplayer(doc.data(), doc.id, todoGroup);
                todoDisplayer.display();
            });

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

        // add todo to database & update todo
        const todoAdder = new TodoAdder(colName, newTodo, updateTodo());
        todoAdder.add();

        addTodoForm.reset();
    });

    // delete todo
    todoGroup.addEventListener('click', e => {
        if (e.target.tagName === 'I' || e.target.tagName === 'BUTTON') {
            const docId = e.target.parentElement.parentElement.getAttribute('data-id');

            // delete todo from databse & update todo
            const todoDeleter = new TodoDeleter(colName, docId, updateTodo());
            todoDeleter.delete();
        };
    });
};

main();