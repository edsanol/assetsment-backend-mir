import { model, Schema, Document } from 'mongoose'

export interface favsModel extends Document {
  id: string
  listId: string
  userId: string
  title: string
  description: string
  url: string
  createdAt: Date | string
  updatedAt: Date | string
}

const favsSchema = new Schema({
  listId: {
    type: Schema.Types.String,
    ref: 'List',
    required: true
  },
  title: String,
  description: String,
  url: String
},
{
  timestamps: true
})

favsSchema.set('toJSON', {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

export default model<favsModel>('Favs', favsSchema)
