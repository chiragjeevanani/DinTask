import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
    {
        adminId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Admin",
            required: true,
        },

        eventName: {
            type: String,
            required: true,
            trim: true,
        },
        eventDate: {
            type: Date,
            required: true
        },


        startTime: {
            type: Date,
            required: true,
        },

        endTime: {
            type: Date,
            required: true,
        },

        location: {
            type: String,
            required: true,
            trim: true,
        },

        participants: [
            {
                type: String
            },
        ],
    },
    { timestamps: true }
);

const Event = mongoose.model("Event", eventSchema);

export default Event;
