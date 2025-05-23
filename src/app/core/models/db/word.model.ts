import mongoose from "mongoose";

export const WordSchema = new mongoose.Schema( {
    word: String,
    translation: String,
    pinned: Boolean,
    marked: Boolean,
    level: String,
    lang: String,
    topicId: mongoose.Types.ObjectId,
    userId: mongoose.Types.ObjectId,
}, { timestamps: true } );


export default mongoose.models.Word || mongoose.model( 'Word', WordSchema )

