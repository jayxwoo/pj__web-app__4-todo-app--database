// ========== imports ==========
import './default.js';

// ========== references ==========
const todoGroup = document.querySelector('.todo-group');
const addTodoForm = document.querySelector('.add-todo-form');
const colName = 'todos';

// ========== script ==========
// add todo
class TodoAdder {
    constructor(colName, newTodo) {
        this.colName = colName;
        this.newTodo = newTodo;
    }

    add = function () {
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
                    console.log(todoItems);
                    todoItems.forEach(todoItem => {
                        // find the item with a particular attribute and delete it
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

        // get time
        const created_at = new Date();

        // create a todo object (that will be saved to database)
        const newTodo = {
            todo: todo,
            created_at: created_at
        };

        // add to database
        const todoAdder = new TodoAdder(colName, newTodo);
        todoAdder.add();

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
};
main();












































// // get todo (from database)
// class TodoGetter {
//     constructor(colName) {
//         this.colName = colName;
//     }

//     get = async function () {
//         // get a collection
//         const col = await firebase.firestore().collection(this.colName).orderBy('created_at').get();

//         // get documents
//         const docs = col.docs;

//         return docs;
//     }
// }

// // display todo
// class TodoDisplayer {
//     constructor(prop, docId, todoGroup) {
//         this.prop = prop;
//         this.docId = docId;
//         this.todoGroup = todoGroup;
//     }

//     display = function () {
//         this.todoGroup.innerHTML += `
//             <li class="todo-item" data-id="${this.docId}">
//                 <p class="todo-text">${this.prop.todo}</p>
//                 <button class="todo-delete-btn"><i class="fas fa-trash-alt todo-delete-icon"></i></button>
//             </li>
//         `;
//     }
// }

// // add todo (to database)
// class TodoAdder {
//     constructor(colName, newTodo, updateTodo) {
//         this.colName = colName;
//         this.newTodo = newTodo;
//         this.updateTodo = updateTodo;
//     }

//     add = function () {
//         firebase.firestore().collection(this.colName).add(this.newTodo).then(() => {
//             console.log('Todo added!');
//             this.updateTodo;
//         }).catch((err) => {
//             console.log(err);
//         });
//     }
// }

// // delete todo (from database)
// class TodoDeleter {
//     constructor(colName, docId, updateTodo) {
//         this.colName = colName;
//         this.docId = docId;
//         this.updateTodo = updateTodo;
//     }

//     delete = function () {
//         firebase.firestore().collection(this.colName).doc(this.docId).delete().then(() => {
//             console.log('Todo deleted!')
//             this.updateTodo;
//         }).catch(err => {
//             console.log(err);
//         });
//     }
// }


// // main
// const main = function () {
//     // update todo
//     const updateTodo = function () {
//         // get todo
//         const todoGetter = new TodoGetter(colName);
//         todoGetter.get().then(docs => {
//             // remove todo from ui
//             todoGroup.innerHTML = '';
    
//             // display todo & set custom attribute
//             docs.forEach(doc => {
//                 const todoDisplayer = new TodoDisplayer(doc.data(), doc.id, todoGroup);
//                 todoDisplayer.display();
//             });

//         }).catch(err => {
//             console.log(err);
//         });
//     };
//     updateTodo();

//     // add todo
//     addTodoForm.addEventListener('submit', e => {
//         e.preventDefault();
        
//         // get input value
//         const todo = addTodoForm.addTodoInput.value;

//         // get the time
//         const created_at = new Date();

//         // create a property to be added to database
//         const newTodo = {
//             todo: todo,
//             created_at: created_at
//         };

//         // add todo to database & update todo
//         const todoAdder = new TodoAdder(colName, newTodo, updateTodo());
//         todoAdder.add();

//         addTodoForm.reset();
//     });

//     // delete todo
//     todoGroup.addEventListener('click', e => {
//         if (e.target.tagName === 'I' || e.target.tagName === 'BUTTON') {
//             const docId = e.target.parentElement.parentElement.getAttribute('data-id');

//             // delete todo from databse & update todo
//             const todoDeleter = new TodoDeleter(colName, docId, updateTodo());
//             todoDeleter.delete();
//         };
//     });
// };

// main();