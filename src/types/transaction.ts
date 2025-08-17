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
    created_by: string;
    updated_by: string;
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
    created_by: string;
    updated_by: string;
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
    created_by: string;
    updated_by: string;
    created_at?: Date;
    updated_at?: Date;
}

export interface CreateTransactionDTO {
    user_id: string;
    supplier_id?: string;
    customer_id?: string;
    type: TransactionType;
    total: number;
    transaction_date: Date;
    notes?: string;
    created_by: string;
  }
  
export interface UpdateTransactionDTO {
    user_id?: string;
    supplier_id?: string;
    customer_id?: string;
    type?: TransactionType;
    total?: number;
    transaction_date?: Date;
    notes?: string;
    updated_by: string;
}
  
export interface CreateTransactionItemDTO {
    transaction_id: string;
    item_id: string;
    unit_price: number;
    qty: number;
    subtotal: number;
    created_by: string;
}
  
export interface UpdateTransactionItemDTO {
    transaction_id?: string;
    item_id?: string;
    unit_price?: number;
    qty?: number;
    subtotal?: number;
    updated_by: string;
}
  
export interface CreateTransactionExpenseDTO {
    transaction_id: string;
    expense_type_id: string;
    amount: number;
    notes?: string;
    subtotal: number;
    created_by: string;
}
  
export interface UpdateTransactionExpenseDTO {
    transaction_id?: string;
    expense_type_id?: string;
    amount?: number;
    notes?: string;
    subtotal?: number;
    updated_by: string;
}