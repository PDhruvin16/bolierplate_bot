import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../context/ThemeContext';
import { FONTS } from '../../constants/fonts';
import CustomInput from './CustomInput';
import SelectDropdown, { SelectOption } from './SelectDropdown';
import Checkbox from './Checkbox';
import RadioGroup, { RadioOption } from './RadioGroup';
import CustomButton from './CustomButton';
import useForm from '../../hooks/useForm';

export type FieldType =
  | 'text'
  | 'number'
  | 'password'
  | 'dropdown'
  | 'lookup'
  | 'multi-dropdown'
  | 'multi-lookup'
  | 'checkbox'
  | 'radio';

export interface FormFieldBase {
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  helpText?: string;
}

export interface TextField extends FormFieldBase {
  type: 'text' | 'number' | 'password';
}

export interface DropdownField extends FormFieldBase {
  type: 'dropdown' | 'lookup';
  options: SelectOption[];
  lookup?: boolean;
}

export interface MultiDropdownField extends FormFieldBase {
  type: 'multi-dropdown' | 'multi-lookup';
  options: SelectOption[];
  lookup?: boolean;
}

export interface CheckboxField extends FormFieldBase {
  type: 'checkbox';
}

export interface RadioField extends FormFieldBase {
  type: 'radio';
  options: RadioOption[];
  horizontal?: boolean;
}

export type AnyField =
  | TextField
  | DropdownField
  | MultiDropdownField
  | CheckboxField
  | RadioField;

export interface FormBuilderProps<T extends Record<string, any>> {
  fields: AnyField[];
  initialValues: T;
  validationSchema?: any; // Yup schema
  onSubmit: (values: T) => Promise<void> | void;
  submitText?: string;
}

const FormBuilder = <T extends Record<string, any>>({
  fields,
  initialValues,
  validationSchema,
  onSubmit,
  submitText = 'Submit',
}: FormBuilderProps<T>) => {
  const form = useForm<T>(initialValues, validationSchema);

  const renderField = (field: AnyField) => {
    const error = (form.errors as any)[field.name] as string | undefined;
    const value = (form.values as any)[field.name];

    switch (field.type) {
      case 'text':
      case 'number':
      case 'password': {
        return (
          <CustomInput
            key={field.name}
            label={field.label}
            placeholder={field.placeholder}
            value={value ?? ''}
            onChangeText={(v: string) =>
              form.setFieldValue(field.name as any, v)
            }
            error={error}
            required={field.required}
            secureTextEntry={field.type === 'password'}
            keyboardType={field.type === 'number' ? 'numeric' : 'default'}
            onBlur={() => form.handleBlur(field.name as any)}
            disabled={field.disabled}
          />
        );
      }
      case 'dropdown':
      case 'lookup': {
        const f = field as DropdownField;
        return (
          <View key={field.name} style={styles.fieldBlock}>
            <Text style={styles.label}>
              {f.label}
              {f.required ? ' *' : ''}
            </Text>
            <SelectDropdown
              placeholder={f.placeholder}
              options={f.options}
              mode="single"
              value={value ?? null}
              onChange={id => form.setFieldValue(field.name as any, id)}
              lookup={field.type === 'lookup' ? true : !!f.lookup}
              newFeild={field.type === 'lookup' ? true : !!f.lookup}
            />
            {!!error && <Text style={styles.error}>{error}</Text>}
          </View>
        );
      }
      case 'multi-dropdown':
      case 'multi-lookup': {
        const f = field as MultiDropdownField;
        return (
          <View key={field.name} style={styles.fieldBlock}>
            <Text style={styles.label}>
              {f.label}
              {f.required ? ' *' : ''}
            </Text>
            <SelectDropdown
              placeholder={f.placeholder}
              options={f.options}
              mode="multi"
              values={Array.isArray(value) ? value : []}
              onChangeMulti={ids => form.setFieldValue(field.name as any, ids)}
              lookup={field.type === 'multi-lookup' ? true : !!f.lookup}
            />
            {!!error && <Text style={styles.error}>{error}</Text>}
          </View>
        );
      }
      case 'checkbox': {
        const boolVal = !!value;
        return (
          <Checkbox
            key={field.name}
            label={field.label}
            checked={boolVal}
            onChange={next => form.setFieldValue(field.name as any, next)}
          />
        );
      }
      case 'radio': {
        const f = field as RadioField;
        return (
          <RadioGroup
            key={field.name}
            value={value ?? null}
            onChange={id => form.setFieldValue(field.name as any, id)}
            options={f.options}
            horizontal={!!f.horizontal}
            label={f.label}
          />
        );
      }
      default:
        return null;
    }
  };

  return (
    <View>
      {fields.map(renderField)}
      <CustomButton
        title={submitText}
        variant="primary"
        size="medium"
        onPress={() => form.handleSubmit(onSubmit)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  fieldBlock: {
    marginBottom: 16,
  },
  label: {
    fontSize: FONTS.sm,
    color: COLORS.dark,
    marginBottom: 8,
    fontWeight: '500',
  },
  error: {
    color: COLORS.error,
    fontSize: FONTS.xs,
    marginTop: 4,
  },
});

export default FormBuilder;
