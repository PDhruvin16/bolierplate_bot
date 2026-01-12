import log from '../utils/logger';
import { useState, useCallback } from 'react';
import type { ValidationError } from 'yup';
interface FormState<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
}

export const useForm = <T extends Record<string, any>>(
  initialValues: T = {} as T,
  validationSchema: any = null,
): FormState<T> & {
  handleChange: (name: keyof T, value: any) => void;
  handleBlur: (name: keyof T) => void;
  handleSubmit: (
    onSubmit: (values: T) => Promise<void> | void,
  ) => Promise<void>;
  resetForm: () => void;
  setFieldValue: (name: keyof T, value: any) => void;
  setFieldError: (name: keyof T, error: string) => void;
  getFieldProps: (name: keyof T) => {
    value: any;
    onChangeText: (value: any) => void;
    onBlur: () => void;
    error: string;
  };
  validateForm: () => boolean;
  validateField: (name: keyof T, value: any) => void;
} => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback(
    (name: keyof T, value: any) => {
      setValues(prev => ({
        ...prev,
        [name]: value,
      }));

      // Clear error when user starts typing
      if (errors[name]) {
        setErrors(prev => ({
          ...prev,
          [name]: '',
        }));
      }
    },
    [errors],
  );

  const handleBlur = useCallback(
    (name: keyof T) => {
      setTouched(prev => ({
        ...prev,
        [name]: true,
      }));

      // Validate field on blur if validation schema exists
      if (validationSchema) {
        validateField(name, values[name]);
      }
    },
    [validationSchema, values],
  );

  const validateField = useCallback(
    (name: keyof T, value: any) => {
      if (!validationSchema) return;

      try {
        validationSchema.validateSyncAt(name, { [name]: value });
        setErrors(prev => ({
          ...prev,
          [name]: '',
        }));
      } catch (error: unknown) {
        setErrors(prev => ({
          ...prev,
          [name]: (error as ValidationError).message,
        }));
      }
    },
    [validationSchema],
  );
  const validateForm = useCallback((): boolean => {
    if (!validationSchema) return true;

    try {
      validationSchema.validateSync(values, { abortEarly: false });
      setErrors({});
      return true;
    } catch (validationErrors) {
      // Type assertion for Yup.ValidationError
      const err = validationErrors as ValidationError;
      const newErrors: Partial<Record<keyof T, string>> = {};
      if (err.inner && Array.isArray(err.inner)) {
        err.inner.forEach(error => {
          if (error.path) {
            newErrors[error.path as keyof T] = error.message;
          }
        });
      }
      setErrors(newErrors);
      return false;
    }
  }, [validationSchema, values]);
  const handleSubmit = useCallback(
    async (onSubmit: any) => {
      setIsSubmitting(true);

      try {
        const isValid = validateForm();
        if (isValid) {
          await onSubmit(values);
        }
      } catch (error) {
        log.error('Form submission error:', error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [validateForm, values],
  );

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  const setFieldValue = useCallback(
    (name: keyof T, value: any) => {
      handleChange(name, value);
    },
    [handleChange],
  );

  const setFieldError = useCallback((name: keyof T, error: string) => {
    setErrors(prev => ({
      ...prev,
      [name]: error,
    }));
  }, []);

  const getFieldProps = useCallback(
    (name: keyof T) => ({
      value: values[name] || '',
      onChangeText: (value: any) => handleChange(name, value),
      onBlur: () => handleBlur(name),
      error: touched[name] ? errors[name] ?? '' : '',
    }),
    [values, handleChange, handleBlur, touched, errors],
  );

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFieldValue,
    setFieldError,
    getFieldProps,
    validateForm,
    validateField,
  };
};

export default useForm;
