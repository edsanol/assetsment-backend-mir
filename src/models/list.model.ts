import { model, Schema, Document } from 'mongoose'
import { favsModel } from './favs.model'

export interface listModel extends Document {
  id: string
  userId: string
  name: string
  favs: favsModel[]
  createdAt: Date | string
  updatedAt: Date | string
}

const listSchema = new Schema({
  userId: {
    type: Schema.Types.String,
    ref: 'User',
    required: true
  },
  name: String,
  favs: [{ type: Schema.Types.ObjectId, ref: 'Favs' }]
},
{
  timestamps: true
})

listSchema.set('toJSON', {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

export default model<listModel>('List', listSchema)
