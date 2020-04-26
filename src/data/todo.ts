import client from './client';
import { gql } from 'apollo-boost';

import { Todo, TodoProperties, Result } from '../types';

export const getUserTodos = async (userId: number): Promise<Result> => {
  const result: Result = {
    data: null
  }

  const todos: Todo[] = await client.query({
    query: gql`
      query getUserTodos($id: Int) {
        readBlocks(block: { id: $id }) {
          id
          label
          properties

          blocks(connectionType: "USER_HAS_TODO", direction: OUTGOING, targetLabel: "TODO") {
            id
            label
            properties
          }
        }
      }
    `,
    variables: {
      id: userId
    },
    fetchPolicy: 'network-only'
  }).then(response => {
    return response.data.readBlocks[0].blocks;
  }).catch(() => {});

  if (!todos) {
    console.error(`Did not read todos for user:${userId}.`);
  }
  
  result.data = todos;
  return result;
}

export const createTodo = async (userId: number, properties: TodoProperties): Promise<Result> => {

  const result: Result = {
    data: null
  }

  const todo: Todo = await client.mutate({
    mutation: gql`
      mutation createTodo($properties: Object) {
        writeBlock(block: { label: "TODO", properties: $properties }) {
          id
          label
          properties
        }
      }
    `,
    variables: {
      properties
    }
  })
  .then(response => response.data.writeBlock)
  .catch(() => {});

  if (todo.id) {
    console.log(`Created todo:${todo.id} for user:${userId} successfuly.`);
  } else {
    console.error(`Did not create todo for user:${userId}.`);
  }

  const createUserHasTodoConnection = await client.mutate({
    mutation: gql`
      mutation createUserHasTodoConnection($source_id: Int, $target_id: Int) {
        writeConnection(connection: { type: "USER_HAS_TODO", source_id: $source_id, target_id: $target_id }) {
          type
          source_id
          target_id
        }
      }
    `,
    variables: {
      source_id: userId,
      target_id: todo.id,
    }
  })
  .then(async response => {
    return response.data.writeConnection;
  })
  .catch(() => {});

  if (createUserHasTodoConnection.type) {
    console.log(`Created connection:USER_HAS_TODO for user:${userId} and todo:${todo.id} successfuly.`);
  } else {
    console.error(`Did not create connection:USER_HAS_TODO for user:${userId} and todo:${todo.id}.`);
  }

  return result;
};
