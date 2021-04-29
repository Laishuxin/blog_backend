import { Injectable } from '@nestjs/common';
import { query } from 'src/database';
import { IServiceResponse } from '..';
import { CategoryDaoFields } from './dao/category.dao';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  create(createCategoryDto: CreateCategoryDto) {
    return 'This action adds a new category';
  }

  findAll() {
    return `This action returns all category`;
  }

  public async findOneById(
    id: number,
    // ): Promise<IServiceResponse<string | null>> {
  ) {
    const name = CategoryDaoFields.name;
    const sql = `SELECT ${name} FROM t_category WHERE ${CategoryDaoFields.categoryId}=${id}`;
    const result = await query(sql);
    return result.length > 0 ? result[0][name] : null;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
