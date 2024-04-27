const { Schema, model } = require("mongoose");

const noteSchema = new Schema({
    heading:{
        type : String,
        require: true,
    },
    description:{
        type: String,
    },
    createdBy:{
        type: Schema.Types.ObjectId,
        ref:'user'
    }
},{
    timestamps:true
})

const Notes = model('note',noteSchema);

module.exports= {Notes}
