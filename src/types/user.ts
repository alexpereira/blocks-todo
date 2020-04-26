export interface User {
  id: number;
  label: 'USER';
  properties?: UserProperties;  
}

interface UserProperties {
  first_name: string;
  last_name: string;
}
