import React, { useState, useEffect } from 'react';
import { List, ListItem, ListItemText, Grid, Typography, TextField } from '@material-ui/core';

import { getUsers, createUser } from './data/user';
import { Todo, User } from './types';
import { getUserTodos, createTodo } from './data/todo';

import './App.css';

const Users = ({ selected, users, selectUser }: any) => {
  if (users.length === 0 || !selected) {
    return null;
  }

  return users.map((user: User, index: number) => (
    <div key={index}>
      <List component='nav' aria-label='main mailbox folders'>
        <ListItem button selected={selected.id === user.id} onClick={() => selectUser(user)}>
          <ListItemText primary={`${user.properties?.first_name} ${user.properties?.last_name}`} />
        </ListItem>
      </List>
    </div>
  ));
};

const Todos = ({ todos }: any) => {
  if (!todos) {
    return null;
  }
  
  return todos.map((todo: Todo, index: number) => (
    <div key={index}>
      <List component='nav' aria-label='main mailbox folders'>
        <ListItem button>
          <ListItemText primary={todo.properties?.text} />
        </ListItem>
      </List>
    </div>
  ));
};

const NewTodo = ({ user, onTodoCreated }: any) => {
  const [todoText, setTodoText] = useState('');
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    await createTodo(user.id, {
      text: todoText
    });
    setTodoText('');
    onTodoCreated(user);
  }

  return (
    <form onSubmit={handleSubmit}>
      <TextField value={todoText} required fullWidth variant='outlined' placeholder='New todo' onChange={e => setTodoText(e.target.value)} />
    </form>
  );
}

const NewUser = ({ onUserCreated }: any) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    await createUser({
      first_name: firstName,
      last_name: lastName,
    });
    setFirstName('');
    setLastName('');
    onUserCreated();
  }

  return (
    <form autoComplete='off' onSubmit={handleSubmit}>
      <Grid container spacing={1} alignItems='flex-end'>
        <Grid item xs={12} md={6}>
          <TextField value={firstName} fullWidth label='First name' required onChange={e => setFirstName(e.target.value)} />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField value={lastName} fullWidth label='Last name' required onChange={e => setLastName(e.target.value)} />
        </Grid>
      </Grid>
      <input type='submit' hidden />
    </form>
  );
}

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [todos, setTodos] = useState<Todo[]>([]);

  const [user, setUser] = useState<User>();

  useEffect(() => {
    const fetchInitialData = async () => {
      const usersResult = await getUsers();
      setUsers(usersResult.data);

      if (!user && usersResult.data.length > 0) {
        setUser(usersResult.data[0]);
        const todosResult = await getUserTodos(usersResult.data[0].id);
        setTodos(todosResult.data);
      }
    };
    fetchInitialData();
  }, [user]);

  const handleUserSelected = async (user: User) => {
    setUser(user);
    const result = await getUserTodos(user.id);
    setTodos(result.data);
  }

  const onTodoCreated = async (user: User) => {
    const result = await getUserTodos(user.id);
    setTodos(result.data);
  }

  const onUserCreated = async () => {
    const result = await getUsers();
    setUsers(result.data);
  }

  return (
    <div className='App'>
      <Grid container direction='row' justify='center' alignItems='flex-start' >
        <Grid item xs={12} md={6} style={{ maxWidth: 400, margin: 50 }}>

          <Typography align='left'>Create user</Typography>
          <NewUser onUserCreated={onUserCreated} />

          <Typography align='left' style={{ marginTop: 50 }}>Users</Typography>
          <Users selected={user} users={users} selectUser={handleUserSelected} />

        </Grid>
        <Grid item xs={12} md={6} style={{ maxWidth: 400, margin: 50 }}>

          <Typography align='left' style={{ marginBottom: 10 }}>Todos</Typography>
          <NewTodo user={user} onTodoCreated={onTodoCreated} />
          <Todos todos={todos} />

        </Grid>
      </Grid>
    </div>
  );
}

export default App;