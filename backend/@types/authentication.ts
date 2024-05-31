export interface IUser {
  id: string;
  name: string;
  email: string;
  password?: string | null;
  public_id?: string | null;
  token?: string | null;
}

export interface IRegister {
  email: string;
  password: string;
}

export interface IDecode {
  id: string;
  email: string;
}
