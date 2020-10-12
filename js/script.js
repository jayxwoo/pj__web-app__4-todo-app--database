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

        console.log(props);
    }
}

// main
const main = function () {
    // get todo (.get())
    const colName = 'todos';
    const todoGetter = new TodoGetter(colName);
    todoGetter.get();
};

main();