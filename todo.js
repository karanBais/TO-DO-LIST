function addTodo() {
    let task = document.getElementById("task-todo").value;
    let description = document.getElementById("disc-todo").value;

    let todo = {
        task,
        description
    }
    localStorage.setItem(`${todo.task}`, JSON.stringify(todo));

    axios.post("https://crudcrud.com/api/79427d0f30da4460a31c761456195220/todo", todo)
    .then((response) => {
        console.log(response.data);
        getTodo();
    })
    .catch(error => console.log(error))
}

function getTodo(){
    axios.get("https://crudcrud.com/api/79427d0f30da4460a31c761456195220/todo")
    .then((response) => {
        const todoList = document.getElementById("todo-list");
        todoList.innerHTML = ""; // Clear previous entries
        
        response.data.forEach(todo => {
            const newLi = document.createElement("li");
            newLi.innerHTML = `${todo.task} - ${todo.description}`;
            newLi.style = "width: 40%; margin: 10px auto; list-style-type: none; display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; padding: 10px; border: 1px solid #ccc; border-radius: 5px;";

            const checkBox = document.createElement("input");
            checkBox.type = "checkbox";
            checkBox.name = "check";
            checkBox.id = "check-box";
            checkBox.style = "width: 40px; padding:30px "
            checkBox.addEventListener("change", function() {
                if (this.checked) {
                    deleteTodoAndMoveToDone(todo._id, newLi); // Delete todo item and move to done list
                }
            });
            
            newLi.appendChild(checkBox);
            todoList.appendChild(newLi);

            // Delete button
            const deletebtn = document.createElement("button");
            deletebtn.innerHTML = "Delete";
            deletebtn.addEventListener("click", function() {
                deleteTodo(todo._id);
                newLi.remove(); // Remove the todo item from the list
            });
            newLi.appendChild(deletebtn);
        });
    })
    .catch(error => console.error(error));
}

function deleteTodoAndMoveToDone(id, todoItem) {
    axios.delete("https://crudcrud.com/api/79427d0f30da4460a31c761456195220/todo/" + id)
    .then((response) => {
        console.log("todo deleted: " + id);
        moveTodoToDoneList(todoItem); // Move todo item to done list
    })
    .catch(error => console.log(error))
}

function moveTodoToDoneList(todoItem) {
    const doneList = document.getElementById("done-list");
    doneList.appendChild(todoItem);
}

window.addEventListener("DOMContentLoaded", getTodo);

// Function to load completed todo items from local storage and move them to the done list on page load
window.addEventListener("load", function() {
    const completedTodos = JSON.parse(localStorage.getItem("completedTodos")) || [];
    const doneList = document.getElementById("done-list");
    completedTodos.forEach(todoId => {
        const todoItem = document.getElementById(todoId);
        if (todoItem) {
            doneList.appendChild(todoItem);
        }
    });
});

// Function to store completed todo IDs in local storage
function storeCompletedTodoIds(todoId) {
    const completedTodos = JSON.parse(localStorage.getItem("completedTodos")) || [];
    if (!completedTodos.includes(todoId)) {
        completedTodos.push(todoId);
        localStorage.setItem("completedTodos", JSON.stringify(completedTodos));
    }
}
