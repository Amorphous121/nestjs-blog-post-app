import { DataSource } from 'typeorm';

export const truncateTableFromTestDatabase = async (tableName: string) => {
  const dataSource = await new DataSource({
    type: 'sqlite',
    database: process.env.DATABASE,
  }).initialize();

  const manager = dataSource.manager;
  return manager.query(`DELETE FROM ${tableName};`);
};
