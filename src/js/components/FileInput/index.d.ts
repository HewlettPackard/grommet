import * as React from 'react';

export interface FileInputProps {
  confirmRemove?: ({
    onConfirm,
    onCancel,
  }: {
    onConfirm: any;
    onCancel: any;
  }) => React.ReactElement<any>;
  disabled?: boolean;
  id?: string;
  maxSize?: number;
  messages?: {
    browse?: string;
    dropPrompt?: string;
    dropPromptMultiple?: string;
    files?: string;
    remove?: string;
    removeAll?: string;
    maxFile?: string;
  };
  multiple?: boolean | { aggregateThreshold?: number; max?: number };
  name?: string;
  onChange?: (
    event: React.ChangeEvent<HTMLInputElement>,
    { files }: { files: File[] },
  ) => void;
  renderFile?: (...args: any[]) => void;
}

type inputProps = Omit<
  React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >,
  'multiple' | 'onChange'
>;

export interface FileInputExtendedProps extends FileInputProps, inputProps {}

declare const FileInput: React.FC<FileInputExtendedProps>;

export { FileInput };
