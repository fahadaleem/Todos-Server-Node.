const express = require("express");
const app = express();
const fs = require("fs");

app.use(express.json());

const todos = JSON.parse(fs.readFileSync("data.json"));

app.get("/", (req, res) => {
  res.send("This is a todo server");
});

// get all todos
app.get("/todos", (req, res) => {
  res.send(JSON.stringify(todos));
});

// add new todo
app.post("/todos", (req, res) => {
  const todo = req.body;
  todo.id = todos.length + 1;
  todos.push(todo);
  fs.writeFileSync("data.json", JSON.stringify(todos));
  res.send(JSON.stringify(todos));
});

// get all completed todos
app.get("/todos/completed", (req, res) => {
  const completedTodos = todos.filter((todo) => todo.completed === true);
  res.send(JSON.stringify(completedTodos));
});

// get all in-completed todos
app.get("/todos/incompleted", (req, res) => {
  const completedTodos = todos.filter((todo) => todo.completed === false);
  res.send(JSON.stringify(completedTodos));
});

app.delete("/todos/:id", (req, res) => {
  const id = req.params.id;
  const todo = todos.find((todo) => todo.id === parseInt(id));
  if (!todo) {
    res.status(404).send({
      status: "error",
      message: "Todo not found",
    });
  }
  const index = todos.indexOf(todo);
  todos.splice(index, 1);
  fs.writeFileSync("data.json", JSON.stringify(todos));
  res.send({
    status: "success",
    message: "Todo deleted successfully",
  });
});

app.put("/todos", (req, res) => {
  const id = req.body.id;
  const todo = todos.find((todo) => todo.id === parseInt(id));
  if (!todo) {
    res.status(404).send({
      status: "error",
      message: "Todo not found",
    });
  }
  todo.title = req.body.title;
  todo.completed = req.body.completed;
  fs.writeFileSync("data.json", JSON.stringify(todos));

  res.send(JSON.stringify(todos));
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
