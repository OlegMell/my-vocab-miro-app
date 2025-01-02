import mongoose from "mongoose";
import { UserSchema } from "./users.model";

const TeacherSchema = new mongoose.Schema( {
    ...UserSchema,
    students: [ { type: mongoose.Schema.Types.ObjectId, ref: 'User' } ],
} );

export default mongoose.models.Teacher || mongoose.model( 'Teacher', TeacherSchema )

