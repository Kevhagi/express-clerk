export interface IBrand {
    id?: string;
    name: string;
    created_at?: Date;
    updated_at?: Date;
}

export interface CreateBrandDTO {
    name: string;
}
  
export interface UpdateBrandDTO {
    name?: string;
}