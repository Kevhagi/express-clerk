export interface IBrand {
    id?: string;
    name: string;
    created_by: string;
    updated_by: string;
    created_at?: Date;
    updated_at?: Date;
}

export interface CreateBrandDTO {
    name: string;
    created_by: string;
}
  
export interface UpdateBrandDTO {
    name?: string;
    updated_by: string;
}