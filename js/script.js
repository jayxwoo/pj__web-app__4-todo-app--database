// ========== imports ==========
import './default.js';

// ========== references ==========


// ========== script ==========
// get todo
class GetTodo {
    constructor(colName) {
        this.colName = colName;
    }

    get = function () {
        firebase.firestore().collection(this.colName).get().then((cols) => {
            cols.docs.forEach((doc) => {
                console.log(doc.data());
            });
        }).catch((err) => {
            console.log(err);
        });
    }
}


// main
const main = function () {
    // get todo
    const colName = 'todos';
    const getTodo = new GetTodo(colName);
    getTodo.get();
};

main();