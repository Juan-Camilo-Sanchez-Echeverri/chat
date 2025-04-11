import { InjectConnection } from '@nestjs/mongoose';
import { Connection, Types, Collection, Document, FilterQuery } from 'mongoose';
import { FilterDto } from '../dto';

export class ConnectionService<T extends Document> {
  private collection: Collection<T>;

  constructor(
    @InjectConnection() private readonly connection: Connection,
    private readonly collectionName: string,
  ) {
    this.collection = this.connection.collection<T>(this.collectionName);
  }

  async findOneById(id: string | Types.ObjectId): Promise<T | null> {
    const objectId = new Types.ObjectId(id);
    const filter: FilterQuery<T> = { _id: objectId };
    const result = await this.collection.findOne(filter);

    return result as T | null;
  }

  async findOneByQuery(query: FilterQuery<T>): Promise<T | null> {
    const result = await this.collection.findOne(query);

    return result as T | null;
  }

  async findPaginate(filterDto: FilterDto<T>): Promise<T[]> {
    const { data = {}, page = 1, limit = 10 } = filterDto;
    const skip = (page - 1) * limit;

    const result = await this.collection
      .find(data)
      .skip(skip)
      .limit(limit)
      .toArray();

    return result as T[];
  }

  async findByQuery(query: FilterQuery<T>): Promise<T[]> {
    const result = await this.collection.find(query).toArray();

    return result as T[];
  }

  async update(id: Types.ObjectId, data: Partial<T>) {
    const filter: FilterQuery<T> = { _id: id };

    const result = await this.collection.updateOne(filter, {
      $set: data,
    });

    return result;
  }
}
