import mongoose, { Schema, Model, HydratedDocument } from 'mongoose'

export interface FrameworkTopic {
    letter: string;
    topic: string;
}

export interface IFramework {
    // _id?: string;
    title: string;
    acronym: string;
    topics: FrameworkTopic[];
    color: string;
    userId?: mongoose.Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}

export type FrameworkDocument = HydratedDocument<IFramework>;

const topicSchema = new Schema<FrameworkTopic>({
    letter: { type: String, required: true, maxLength: 5 },
    topic: { type: String, required: true, maxlength: 200 }

}, { _id: false });


const frameworkSchema = new Schema<IFramework>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: { 
        type: String, 
        required: true, 
        maxLength: 100, 
        trim: true 
    },
    acronym: { 
        type: String, 
        required: true,
        maxLength: 20,
        trim: true,
        uppercase: true 
    },
    topics: {
        type: [topicSchema],
        required: true,
        validate: {
            validator: function(topics: FrameworkTopic[]) {
                return topics.length > 0 && topics.length <= 10;
            },
            message: "Must have between 1 and 10 topics"
        },
        
    },
    color: {
            type: String,
            required: true,
            trim: true,
            validate: {
                validator: function (color: string) {
                    return /^from-\w+-\d{2,3}\s+to-\w+-\d{2,3}$/.test(color);
                },
                message: "Color must be in Tailwind gradient format (e.g., 'from-blue-500 to-purple-500') "
            }
        }
    // topics: { type: FrameworkTopic[] }
}, {
    timestamps: true
});


frameworkSchema.index({ userID: 1 });
frameworkSchema.index({ userId: 1, title: 1 });

const Framework: Model<IFramework> = mongoose.model<IFramework>('Framework', frameworkSchema);

export default Framework;