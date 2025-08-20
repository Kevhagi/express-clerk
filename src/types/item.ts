export interface IItem {
    id?: string;
    brand_id: string;
    model_name: string;
    ram_gb: number;
    storage_gb: number;
    display_name: string;
    created_by: string;
    updated_by: string;
    created_at?: Date;
    updated_at?: Date;
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