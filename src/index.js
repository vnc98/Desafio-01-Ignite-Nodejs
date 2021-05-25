const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  const {username} = request.headers;
  const [findUser] = users.filter(user => user.username == username);
  
  if(!findUser) {
    return response.status(400).json({msg: "user not exists"})
  }

  request.user = findUser;

  next()
}

app.post('/users', (request, response) => {
  // Complete aqui
  const newUser = {};
  const {name, username} = request.body;

  const [findUser] = users.filter(user => user.username == username);
  
  if(findUser) {
    return response.status(400).json({error: "User already exists"})
  }

  newUser.name = name;
  newUser.username = username;
  newUser.id = uuidv4();
  newUser.todos = []

  users.push(newUser);

  return response.status(201).json(newUser)
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const {user} = request;

  const {todos} = user;

  return response.status(200).json(todos)
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const {user} = request;
  const {title, deadline} = request.body;

  const newTodo = {};

  newTodo.title = title;
  newTodo.id = uuidv4();
  newTodo.done = false;
  newTodo.deadline = new Date(deadline).toISOString();
  newTodo.created_at = new Date().toISOString()

  user.todos.push(newTodo);

  return response.status(201).json(newTodo)
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const {user} = request;
  const {title, deadline} = request.body;
  const {id} = request.params;

  const [taskToUpdate] = user.todos.filter(task => task.id === id);

  if(!taskToUpdate) {
    return response.status(404).json({error: "Task does not exists"})
  }

  taskToUpdate.title = title;
  taskToUpdate.deadline = new Date(deadline).toISOString();

  return response.status(200).json(taskToUpdate)
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const {user} = request;
  const {id} = request.params;

  const [taskToDone] = user.todos.filter(task => task.id === id);

  if(!taskToDone) {
    return response.status(404).json({error: "Task does not exists"})
  }

  taskToDone.done = true;

  return response.status(200).json(taskToDone)

});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const {user} = request;
  const {id} = request.params;

  const [taskToFinish] = user.todos.filter(task => task.id === id);
  const indexToDelete = user.todos.indexOf(taskToFinish)
  

  if(!taskToFinish && indexToDelete === -1) {
    return response.status(404).json({error: "Task does not exists"})
  }

  user.todos.splice(indexToDelete,1);
  
  return response.status(204).json({})
});

module.exports = app;

