export interface Install {
  id: number;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  street: string;
  number: string;
  postalCode: string;
  city: string;
  active: number;
}

export interface InstallWithContacts {
  id: number;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  street: string;
  number: string;
  postalCode: string;
  city: string;
  active: number;
  contacts: Contacts[];
}

interface Contacts {
  name: string;
  phone: string;
  email: string;
}
