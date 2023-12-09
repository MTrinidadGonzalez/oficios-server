import mongoose from "mongoose";

const collection= 'Chats'

const schema= new mongoose.Schema({
    owners: [
        {
            type: mongoose.SchemaTypes.ObjectId,
              ref: 'Users'
        }
      ],
      messages: [
        {
          owner: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'Users'
          },
          content: String,
          fecha: Date,
        }
      ]

}, {timestamps:{createdAt: 'created_at', updatedAt: 'updated_at'}}
)

//schema.index({ owners: 1 }, { unique: true })
const chatsModel= mongoose.model(collection,schema)
export default chatsModel

