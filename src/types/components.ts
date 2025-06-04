
// Enhanced component prop types with strict validation
export interface BaseComponentProps {
  className?: string;
  testId?: string;
  'aria-label'?: string;
}

export interface LoadingState {
  isLoading: boolean;
  loadingText?: string;
  progress?: number; // 0-100
}

export interface ErrorState {
  hasError: boolean;
  errorMessage?: string;
  errorCode?: string;
  retry?: () => void;
}

export interface AsyncComponentState extends LoadingState, ErrorState {
  data?: unknown;
}

// Form component types
export interface FormInputProps extends BaseComponentProps {
  name: string;
  value: string | number;
  onChange: (value: string | number) => void;
  onBlur?: () => void;
  disabled?: boolean;
  required?: boolean;
  placeholder?: string;
  error?: string;
  helperText?: string;
}

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
  group?: string;
}

export interface SelectProps extends Omit<FormInputProps, 'value' | 'onChange'> {
  value: string | number | null;
  onChange: (value: string | number | null) => void;
  options: SelectOption[];
  multiple?: boolean;
  searchable?: boolean;
  clearable?: boolean;
}

// Table component types
export interface TableColumn<T = unknown> {
  key: keyof T | string;
  title: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: unknown, row: T, index: number) => React.ReactNode;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
}

export interface TableProps<T = unknown> extends BaseComponentProps {
  data: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    onPageChange: (page: number) => void;
    onLimitChange?: (limit: number) => void;
  };
  sorting?: {
    sortBy: string;
    sortOrder: 'asc' | 'desc';
    onSortChange: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
  };
  filtering?: {
    filters: Record<string, unknown>;
    onFilterChange: (filters: Record<string, unknown>) => void;
  };
  selection?: {
    selectedRows: Set<string | number>;
    onSelectionChange: (selectedRows: Set<string | number>) => void;
    selectableRowId: keyof T;
  };
}

// Modal and Dialog types
export interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closable?: boolean;
  keyboard?: boolean; // Close on ESC
  backdrop?: boolean | 'static';
  centered?: boolean;
  scrollable?: boolean;
}

// Navigation types
export interface NavigationItem {
  id: string;
  label: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  disabled?: boolean;
  children?: NavigationItem[];
  onClick?: () => void;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}
