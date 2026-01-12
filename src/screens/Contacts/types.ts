export interface ContactItem {
  id: string;
  full_name: string;
  email1: string;
  account: Account;
  mobile_phone_number: string;
  status: { value: string; label: string };
  selected?: boolean;
  icon?: string;
}

interface Account {
  id: string;
  name: string;
  email1: string | null;
  email2: string | null;
  phone_number1: string | null;
  phone_number2: string | null;
}

export const USE_STATIC_SCHEMA = true;

export type SchemaOption = { id: string | number; label: string };
export type SchemaField = {
  id: string;
  name: string;
  type: string;
  label?: string;
  hidden?: boolean;
  readOnly?: boolean;
  placeholder?: string;
  validation?: { required?: boolean };
  metadataKey?: string;
  optionsConfig?: {
    type: 'api' | 'static';
    endpoint?: string;
    labelKey?: string;
    valueKey?: string;
    options?: Array<any>;
    searchable?: boolean;
    isMulti?: boolean;
  };
};
export type SchemaSection = {
  id: string;
  label?: string;
  type?: string;
  fields: SchemaField[];
  componentType?: string;
  component?: string;
};
export type SchemaTab = {
  id: string;
  label: string;
  hidden?: boolean;
  sections: SchemaSection[];
};

export type NewContactScreenProps = {
  navigation: any;
  route: any;
};
