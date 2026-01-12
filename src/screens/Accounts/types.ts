export interface AccountItem {
  id: string;
  name: string;
  phone_number1?: string;
  address: Address[];
  contact?: Contact;
  email1?: string;
  status: { value: string; label: string };
  selected?: boolean;
  icon?: string;
}

interface Address {
  city?: string;
}

interface Contact {
  mobile_phone_number?: string;
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
};
export type SchemaTab = {
  id: string;
  label: string;
  hidden?: boolean;
  sections: SchemaSection[];
};

export type NewAccountScreenProps = {
  navigation: any;
  route: any;
};
