export interface IUser {
    id?: string;
    firstName: string;
    lastName: string;
    created_at?: Date;
    updated_at?: Date;
}

export interface CreateUserDTO {
    firstName: string;
    lastName: string;
}

export interface UpdateUserDTO {
    firstName?: string;
    lastName?: string;
}