const { Schema, model } = require("mongoose");

const HistorySchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  noteId: { type: Schema.Types.ObjectId, ref: 'Note' },
  action: String,
  timestamp: { type: Date, default: Date.now }
});

const Historyschema = model('HistorySchema', HistorySchema);

module.exports = Historyschema;
