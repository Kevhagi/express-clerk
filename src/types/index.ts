export interface IUser {
  id?: number;
  firstName: string;
  lastName: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IContact {
  id?: number;
  name: string;
  phone: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IBrand {
  id?: number;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IItem {
  id?: number;
  brand_id: number;
  model_name: string;
  ram_gb: number;
  storage_gb: number;
  display_name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IExpenseType {
  id?: number;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type TransactionType = 'Penjualan' | 'Pembelian';

export interface ITransaction {
  id?: number;
  user_id: number;
  supplier_id?: number;
  customer_id?: number;
  type: TransactionType;
  total: number;
  transaction_date: Date;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ITransactionItem {
  id?: number;
  transaction_id: number;
  item_id: number;
  unit_price: number;
  qty: number;
  subtotal: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ITransactionExpense {
  id?: number;
  transaction_id: number;
  expense_type_id: number;
  amount: number;
  notes?: string;
  subtotal: number;
  createdAt?: Date;
  updatedAt?: Date;
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
  brand_id: number;
  model_name: string;
  ram_gb: number;
  storage_gb: number;
  display_name: string;
}

export interface UpdateItemDTO {
  brand_id?: number;
  model_name?: string;
  ram_gb?: number;
  storage_gb?: number;
  display_name?: string;
}

export interface CreateExpenseTypeDTO {
  name: string;
}

export interface UpdateExpenseTypeDTO {
  name?: string;
}

export interface CreateTransactionDTO {
  user_id: number;
  supplier_id?: number;
  customer_id?: number;
  type: TransactionType;
  total: number;
  transaction_date: Date;
  notes?: string;
}

export interface UpdateTransactionDTO {
  user_id?: number;
  supplier_id?: number;
  customer_id?: number;
  type?: TransactionType;
  total?: number;
  transaction_date?: Date;
  notes?: string;
}

export interface CreateTransactionItemDTO {
  transaction_id: number;
  item_id: number;
  unit_price: number;
  qty: number;
  subtotal: number;
}

export interface UpdateTransactionItemDTO {
  transaction_id?: number;
  item_id?: number;
  unit_price?: number;
  qty?: number;
  subtotal?: number;
}

export interface CreateTransactionExpenseDTO {
  transaction_id: number;
  expense_type_id: number;
  amount: number;
  notes?: string;
  subtotal: number;
}

export interface UpdateTransactionExpenseDTO {
  transaction_id?: number;
  expense_type_id?: number;
  amount?: number;
  notes?: string;
  subtotal?: number;
}
