export enum TransactionType {
    BUY = 'buy',
    SELL = 'sell'
}

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

export interface CreateTransactionProductDTO {
    brand_id: string;
    product_id: string;
    quantity: number;
    amount_per_product: number;
    sub_total: number;
}

export interface CreateTransactionExpenseDTO {
    expense_type: string;
    notes?: string;
    amount: number;
}

export interface CreateTransactionWithDetailsDTO {
    transaction_date: string | Date;
    type: TransactionType;
    supplier_id?: string;
    customer_id?: string;
    notes?: string;
    transaction_products: CreateTransactionProductDTO[];
    transaction_expenses: CreateTransactionExpenseDetailDTO[];
    sub_total_products: number;
    sub_total_expenses: number;
    total: number;
    created_at?: string | Date;
    updated_at?: string | Date;
}

// DTO that exactly matches your payload structure
export interface CreateTransactionPayloadDTO {
    transaction_date: string;
    type: TransactionType;
    supplier_id?: string;
    customer_id?: string;
    notes?: string;
    transaction_products: {
        brand_id: string;
        product_id: string;
        quantity: number;
        amount_per_product: number;
        sub_total: number;
    }[];
    transaction_expenses?: {
        expense_type: string;
        notes?: string;
        amount: number;
    }[];
    sub_total_products: number;
    sub_total_expenses: number;
    total: number;
    created_at?: string;
    updated_at?: string;
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

// For creating transactions with expense details (without transaction_id)
export interface CreateTransactionExpenseDetailDTO {
    expense_type: string;
    notes?: string;
    amount: number;
}
  
export interface UpdateTransactionExpenseDTO {
    transaction_id?: string;
    expense_type_id?: string;
    amount?: number;
    notes?: string;
    subtotal?: number;
}

// Types for the complete transaction response with related data
export interface TransactionItemResponse {
    id: string;
    transaction_id: string;
    item_id: string;
    unit_price: string;
    qty: number;
    subtotal: string;
    created_by: string;
    updated_by: string;
    created_at: string;
    updated_at: string;
    item: {
        id: string;
        display_name: string;
    };
}

export interface TransactionExpenseResponse {
    id: string;
    transaction_id: string;
    expense_type_id: string;
    amount: string;
    notes?: string;
    subtotal: string;
    created_by: string;
    updated_by: string;
    created_at: string;
    updated_at: string;
    expenseType: {
        id: string;
        name: string;
    };
}

export interface ContactResponse {
    id: string;
    name: string;
    phone: string;
}

export interface TransactionResponse {
    id: string;
    supplier_id?: string;
    customer_id?: string;
    type: TransactionType;
    total: string;
    transaction_date: string;
    notes?: string;
    created_by: string;
    updated_by: string;
    created_at: string;
    updated_at: string;
    supplier?: ContactResponse;
    customer?: ContactResponse;
    transactionItems: TransactionItemResponse[];
    transactionExpenses: TransactionExpenseResponse[];
    sub_total_products: string;
    sub_total_expenses: string;
}

export interface PaginatedTransactionResponse {
    transactions: TransactionResponse[];
    total: number;
    page: number;
    limit: number;
}