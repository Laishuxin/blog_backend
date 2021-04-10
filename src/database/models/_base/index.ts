// export type BaseFields = 'create_at' | 'update_at';
export enum BaseFields {
  createAt = 'create_at',
  updateAt = 'update_at',
}

export class BaseModel {
  create_at?: string;
  update_at?: string;
}
