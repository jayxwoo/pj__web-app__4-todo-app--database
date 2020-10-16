// add todo
export class TodoAdder {
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
export class TodoUpdater {
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
export class TodoDeleter {
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