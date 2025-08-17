export interface IExpenseType {
    id?: string;
    name: string;
    created_at?: Date;
    updated_at?: Date;
}

export interface CreateExpenseTypeDTO {
    name: string;
}
  
export interface UpdateExpenseTypeDTO {
    name?: string;
}