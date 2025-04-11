import { FilterQuery, Model, UpdateQuery } from 'mongoose';

import { FilterDto } from '../dto';

interface Id {
  id?: any;
}

export class Service<T extends Id, CreateDto, UpdateDto> {
  constructor(private readonly model: Model<T>) {}

  async findOneById(id: T['id']): Promise<T | null> {
    return await this.model.findById(id);
  }

  async findOneByQuery(query: FilterQuery<T>): Promise<T | null> {
    return await this.model.findOne(query);
  }

  async findPaginate(filterDto: FilterDto<T>): Promise<T[]> {
    const { data, page = 1, limit = 10 } = filterDto;
    const skip = (page - 1) * limit;

    const result = await this.model.find(data).skip(skip).limit(limit);

    return result as T[];
  }

  async findByQuery(query: FilterQuery<T>): Promise<T[]> {
    return await this.model.find(query);
  }

  async create(createDto: CreateDto): Promise<T> {
    return await this.model.create(createDto);
  }

  async update(id: T['id'], updateDto: UpdateDto): Promise<T | null> {
    const result = await this.model.findByIdAndUpdate(
      id,
      updateDto as UpdateQuery<T>,
      {
        new: true,
      },
    );

    return result as T | null;
  }

  async remove(id: T['id']): Promise<T | null> {
    return await this.model.findByIdAndDelete(id, { new: true });
  }
}
