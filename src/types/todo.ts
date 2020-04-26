export interface Todo {
  id: number;
  label: 'TODO';
  properties?: TodoProperties;
}

export interface TodoProperties {
  text: string;
}
