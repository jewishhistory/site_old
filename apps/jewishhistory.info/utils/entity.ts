import { IBaseEntity } from 'types/entities';

export const getEntityUrl = ({ code }: IBaseEntity) => `/content/${code}/`;
