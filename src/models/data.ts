import mongoose, { model, Schema } from 'mongoose';

const dataSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, required: true },

  
  user:{
    type: Schema.Types.ObjectId,
     ref: 'User'
     },
  
  
  
  prompts: [{
    prompt: { type: String, required: true },
    answers: [{
      answer: { type: String, required: true },
    }],
  }],
});

const Data = model('data', dataSchema);

export { Data };