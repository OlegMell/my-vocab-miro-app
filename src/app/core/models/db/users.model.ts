import mongoose from "mongoose";

export const UserSchema = new mongoose.Schema( {
    email: String,
    purchesed: Boolean,
    userId: String,
    name: String,
    level: {
        type: String,
        enum: [ 'beginner', 'intermediate', 'advanced' ]
    },
    type: {
        type: String,
        enum: [ 'student', 'teacher' ]
    },
    topics: [ {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Topic'
    } ],
    students: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
} );

export default mongoose.models.User || mongoose.model( 'User', UserSchema )

