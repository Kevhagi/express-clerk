export interface IContact {
    id?: string;
    name: string;
    phone: string;
    created_at?: Date;
    updated_at?: Date;
}

export interface CreateContactDTO {
    name: string;
    phone: string;
}
  
  export interface UpdateContactDTO {
    name?: string;
    phone?: string;
}