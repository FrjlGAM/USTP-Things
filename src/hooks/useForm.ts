import { useState, useCallback, useEffect } from 'react';

type ValidationRule<T> = {
  validator: (value: T, values?: Record<string, any>) => boolean | string;
  message: string;
};

type ValidationRules<T> = {
  [K in keyof T]?: ValidationRule<T[K]>[];
};

type FormErrors<T> = {
  [K in keyof T]?: string;
};

interface UseFormOptions<T> {
  initialValues: T;
  onSubmit: (values: T) => void | Promise<void>;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  validationRules?: ValidationRules<T>;
}

export function useForm<T extends Record<string, any>>({
  initialValues,
  onSubmit,
  validateOnChange = true,
  validateOnBlur = true,
  validationRules = {},
}: UseFormOptions<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FormErrors<T>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState<{ [K in keyof T]?: boolean }>({});

  // Validate a single field
  const validateField = useCallback(
    (name: keyof T, value: T[keyof T]): string | undefined => {
      if (!validationRules || !validationRules[name]) return undefined;

      const rules = validationRules[name] || [];
      
      for (const rule of rules) {
        const isValid = rule.validator(value, values);
        if (isValid !== true) {
          return typeof isValid === 'string' ? isValid : rule.message;
        }
      }
      
      return undefined;
    },
    [validationRules, values]
  );

  // Validate all fields
  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors<T> = {};
    let isValid = true;

    (Object.keys(values) as Array<keyof T>).forEach((key) => {
      const error = validateField(key, values[key]);
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [values, validateField]);

  // Handle form submission
  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();
      
      // Mark all fields as touched
      const allTouched = Object.keys(values).reduce(
        (acc, key) => ({ ...acc, [key]: true }),
        {}
      ) as { [K in keyof T]: boolean };
      
      setTouched(allTouched);
      
      // Validate form
      const isValid = validateForm();
      
      if (isValid) {
        setIsSubmitting(true);
        try {
          await onSubmit(values);
        } finally {
          setIsSubmitting(false);
        }
      }
    },
    [onSubmit, validateForm, values]
  );

  // Handle input change
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value, type } = e.target;
      
      // Handle different input types
      let finalValue: any = value;
      
      if (type === 'number') {
        finalValue = value === '' ? '' : Number(value);
      } else if (type === 'checkbox') {
        const target = e.target as HTMLInputElement;
        finalValue = target.checked;
      }
      
      const newValues = {
        ...values,
        [name]: finalValue,
      };
      
      setValues(newValues);
      
      // Validate on change if enabled
      if (validateOnChange && touched[name]) {
        const error = validateField(name as keyof T, finalValue);
        setErrors((prev) => ({
          ...prev,
          [name]: error,
        }));
      }
    },
    [touched, validateField, validateOnChange, values]
  );

  // Handle blur event
  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      
      setTouched((prev) => ({
        ...prev,
        [name]: true,
      }));
      
      // Validate on blur if enabled
      if (validateOnBlur) {
        const error = validateField(name as keyof T, value as any);
        setErrors((prev) => ({
          ...prev,
          [name]: error,
        }));
      }
    },
    [validateField, validateOnBlur]
  );

  // Set a field value programmatically
  const setFieldValue = useCallback(
    <K extends keyof T>(name: K, value: T[K]) => {
      setValues((prev) => ({
        ...prev,
        [name]: value,
      }));
      
      // Validate the field if it's been touched
      if (touched[name] && validateOnChange) {
        const error = validateField(name, value);
        setErrors((prev) => ({
          ...prev,
          [name]: error,
        }));
      }
    },
    [touched, validateField, validateOnChange]
  );

  // Set multiple field values at once
  const setValuesFromObject = useCallback((newValues: Partial<T>) => {
    setValues((prev) => ({
      ...prev,
      ...newValues,
    }));
  }, []);

  // Reset form to initial values
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  // Effect to validate form when values change and validateOnChange is true
  useEffect(() => {
    if (validateOnChange) {
      validateForm();
    }
  }, [validateOnChange, validateForm]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setValues: setValuesFromObject,
    setErrors,
    setTouched,
    resetForm,
    validate: validateForm,
  };
}

// Common validation rules
export const required = (message = 'This field is required'): ValidationRule<any> => ({
  validator: (value) => {
    if (value === undefined || value === null) return false;
    if (typeof value === 'string' && value.trim() === '') return false;
    if (Array.isArray(value) && value.length === 0) return false;
    return true;
  },
  message,
});

export const minLength = (
  min: number,
  message = `Must be at least ${min} characters`
): ValidationRule<string> => ({
  validator: (value) => value.length >= min,
  message,
});

export const maxLength = (
  max: number,
  message = `Must be at most ${max} characters`
): ValidationRule<string> => ({
  validator: (value) => value.length <= max,
  message,
});

export const email = (message = 'Please enter a valid email address'): ValidationRule<string> => ({
  validator: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
  message,
});

export const matchField = (
  fieldName: string,
  message = 'Fields do not match'
): ValidationRule<any> => ({
  validator: (value, values) => value === values?.[fieldName],
  message,
});

export const pattern = (
  regex: RegExp,
  message = 'Invalid format'
): ValidationRule<string> => ({
  validator: (value) => regex.test(value),
  message,
});

export const min = (
  minValue: number,
  message = `Must be at least ${minValue}`
): ValidationRule<number> => ({
  validator: (value) => value >= minValue,
  message,
});

export const max = (
  maxValue: number,
  message = `Must be at most ${maxValue}`
): ValidationRule<number> => ({
  validator: (value) => value <= maxValue,
  message,
});
