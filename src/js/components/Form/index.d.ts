import * as React from 'react';

export interface FormExtendedEvent<R = Record<string, unknown>, T = Element>
  extends React.FormEvent<T> {
  value: R;
  touched: Record<string, boolean>;
}

export interface FormProps<T> {
  errors?: {};
  infos?: {};
  kind?: string;
  messages?: { invalid?: string; required?: string };
  onChange?: (value: T, options: { touched?: Record<string, boolean> }) => void;
  onSubmit?: (event: FormExtendedEvent<T>) => void;
  onReset?: (event: React.SyntheticEvent) => any;
  onValidate?: (validationResults: {
    errors: Record<string, any>;
    infos: Record<string, any>;
    valid: boolean;
  }) => void;
  validate?: 'blur' | 'submit' | 'change';
  value?: T;
}

type TypedFormProps<T> = FormProps<T> &
  Omit<
    React.DetailedHTMLProps<
      React.FormHTMLAttributes<HTMLFormElement>,
      HTMLFormElement
    >,
    'onChange' | 'onSubmit'
  >;

declare const Form: <T = {}>(
  p: TypedFormProps<T>,
) => React.ReactElement<TypedFormProps<T>>;

export { Form };
