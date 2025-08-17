export interface IContact {
    id?: string;
    name: string;
    phone: string;
    created_by: string;
    updated_by: string;
    created_at?: Date;
    updated_at?: Date;
}

export interface CreateContactDTO {
    name: string;
    phone: string;
    created_by: string;
}
  
  export interface UpdateContactDTO {
    name?: string;
    phone?: string;
    updated_by: string;
}