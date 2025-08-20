export type TransactionType = 'buy' | 'sell';

export interface ITransaction {
    id?: string;
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
    supplier_id?: string;
    customer_id?: string;
    type: TransactionType;
    total: number;
    transaction_date: Date;
    notes?: string;
  }
  
export interface UpdateTransactionDTO {
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