export interface IUser {
  id?: string;
  firstName: string;
  lastName: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IContact {
  id?: string;
  name: string;
  phone: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface IBrand {
  id?: string;
  name: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface IItem {
  id?: string;
  brand_id: string;
  model_name: string;
  ram_gb: number;
  storage_gb: number;
  display_name: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface IExpenseType {
  id?: string;
  name: string;
  created_at?: Date;
  updated_at?: Date;
}

export type TransactionType = 'Penjualan' | 'Pembelian';

export interface ITransaction {
  id?: string;
  user_id: string;
  supplier_id?: string;
  customer_id?: string;
  type: TransactionType;
  total: number;
  transaction_date: Date;
  notes?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface ITransactionItem {
  id?: string;
  transaction_id: string;
  item_id: string;
  unit_price: number;
  qty: number;
  subtotal: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface ITransactionExpense {
  id?: string;
  transaction_id: string;
  expense_type_id: string;
  amount: number;
  notes?: string;
  subtotal: number;
  created_at?: Date;
  updated_at?: Date;
}

// DTOs for API requests (without auto-generated fields)
export interface CreateUserDTO {
  firstName: string;
  lastName: string;
}

export interface UpdateUserDTO {
  firstName?: string;
  lastName?: string;
}

export interface CreateContactDTO {
  name: string;
  phone: string;
}

export interface UpdateContactDTO {
  name?: string;
  phone?: string;
}

export interface CreateBrandDTO {
  name: string;
}

export interface UpdateBrandDTO {
  name?: string;
}

export interface CreateItemDTO {
  brand_id: string;
  model_name: string;
  ram_gb: number;
  storage_gb: number;
}

export interface UpdateItemDTO {
  brand_id?: string;
  model_name?: string;
  ram_gb?: number;
  storage_gb?: number;
}

export interface CreateExpenseTypeDTO {
  name: string;
}

export interface UpdateExpenseTypeDTO {
  name?: string;
}

export interface CreateTransactionDTO {
  user_id: string;
  supplier_id?: string;
  customer_id?: string;
  type: TransactionType;
  total: number;
  transaction_date: Date;
  notes?: string;
}

export interface UpdateTransactionDTO {
  user_id?: string;
  supplier_id?: string;
  customer_id?: string;
  type?: TransactionType;
  total?: number;
  transaction_date?: Date;
  notes?: string;
}

export interface CreateTransactionItemDTO {
  transaction_id: string;
  item_id: string;
  unit_price: number;
  qty: number;
  subtotal: number;
}

export interface UpdateTransactionItemDTO {
  transaction_id?: string;
  item_id?: string;
  unit_price?: number;
  qty?: number;
  subtotal?: number;
}

export interface CreateTransactionExpenseDTO {
  transaction_id: string;
  expense_type_id: string;
  amount: number;
  notes?: string;
  subtotal: number;
}

export interface UpdateTransactionExpenseDTO {
  transaction_id?: string;
  expense_type_id?: string;
  amount?: number;
  notes?: string;
  subtotal?: number;
}
