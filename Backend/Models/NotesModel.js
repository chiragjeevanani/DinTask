import mongoose from "mongoose";

const notesSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    content: {
      type: String,
      required: true,
      trim: true,
    },

    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",   // ya "User" jo tumhara employee model ho
      required: true,
    },
  },
  { timestamps: true }
);

const Notes = mongoose.model("Notes", notesSchema);

export default Notes;
