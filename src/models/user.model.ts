import { model, Schema, Document } from 'mongoose'
import { listModel } from './list.model'

export interface UserEntry extends Document {
  id: string
  email: string
  password: string
  lists: listModel[]
  createdAt: Date | string
  updatedAt: Date | string
}

const userSchema = new Schema({
  email: String,
  password: String,
  lists: [{ type: Schema.Types.ObjectId, ref: 'List' }]
},
{
  timestamps: true
})

userSchema.set('toJSON', {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

export default model<UserEntry>('User', userSchema)
