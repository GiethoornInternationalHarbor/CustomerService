import { Document } from 'mongoose';
import { Model } from 'objectmodel';
import { INewable } from './inewable.interface';

export function mapModelToEntity<TModel extends Document, TEntity>(
  model: TModel,
  resultingType: INewable<TEntity>
) {
  return new resultingType(
    model.toJSON({
      virtuals: true
    })
  );
}
