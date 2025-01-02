import mongoose from "mongoose";

const TopicSchema = new mongoose.Schema( {
    name: String,
    description: String,
    // words: [
    //     {
    //         type: mongoose.Schema.Types.ObjectId,
    //         ref: 'Word'
    //     }
    // ],
} );

export default mongoose.models.Topic || mongoose.model( 'Topic', TopicSchema );

