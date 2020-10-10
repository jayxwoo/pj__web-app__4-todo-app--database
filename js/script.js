// ========== imports ==========
import './default.js';

// ========== references ==========


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


// main
const main = function () {
    // get todo
    const colName = 'todos';
    const todoGetter = new TodoGetter(colName);
    todoGetter.get().then(todos => {
        console.log(todos);
    }).catch(err => {
        console.log(err);
    });
};

main();