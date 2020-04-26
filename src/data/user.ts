import { gql } from 'apollo-boost';

import { User, Result } from '../types';
import client from './client';

export const createUser = async (properties: Object): Promise<Result> => {
  const result: Result = {
    data: null
  }

  const user: User = await client.mutate({
    mutation: gql`
      mutation createUser($properties: Object) {
        writeBlock(block: { label: "USER", properties: $properties }) {
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
  .then(response => response.data.writeBlock);

  if (user.id) {
    console.log(`Created user:${user.id} successfuly.`);
  } else {
    console.error(`Did not create user.`);
  }

  result.data = user;
  return result;
}

export const getUsers = async (): Promise<Result> => {
  const result: Result = {
    data: null
  }
  
  const users: User[] = await client.query({
    query: gql`
      query getUsers {
        readBlocks(block: { label: "USER" }) {
          id
          label
          properties
        }
      }
    `,
    fetchPolicy: 'network-only'
  })
  .then(response => response.data.readBlocks);

  result.data = users;
  return result;
}
