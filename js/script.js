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

// main
const main = function () {
    // update todo
    const update = function () {
        // get todo
        const colName = 'todos';
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
    update();
};

main();