
export enum Department {
  ADMIN = 'administration',
  ACADEMIC = 'academic',
  STUDENT_AFFAIRS = 'student_affairs',
  IT = 'it',
  DASHBOARD = 'dashboard'
}

export interface ToolMetadata {
  id: string;
  name: string;
  description: string;
  icon: string;
  department: Department;
  tags: string[];
  inputs: ToolInput[];
  promptTemplate: string;
  isBatchSupported: boolean;
}

export interface ToolInput {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'select';
  options?: string[];
  placeholder?: string;
}

export interface UsageLog {
  id: string;
  timestamp: string;
  toolId: string;
  toolName: string;
  inputData: any;
  outputResult: string;
  status: 'success' | 'failed';
}

export interface MenuItem {
  id: string;
  label: string;
  icon: string;
  department?: Department;
  children?: MenuItem[];
}
