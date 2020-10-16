// serach todo
export class TodoSearcher {
    constructor(searchInputValue, todoItems) {
        this.searchInputValue = searchInputValue;
        this.todoItems = todoItems;
    }

    search = function () {
        const noMatchTodoItems = this.todoItems.filter(todoItem => {
            return !todoItem.innerText.trim().toLowerCase().includes(this.searchInputValue);
        });
        
        noMatchTodoItems.forEach(noMatchTodoItem => {
            noMatchTodoItem.classList.add('filtered');
        });

        const matchTodoItems = this.todoItems.filter(todoItem => {
            return todoItem.innerText.trim().toLowerCase().includes(this.searchInputValue);
        });

        matchTodoItems.forEach(matchTodoItem => {
            matchTodoItem.classList.remove('filtered');
        });
    }
}