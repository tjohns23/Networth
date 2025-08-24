import mongoose, { Schema, HydratedDocument, Model } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser {
  email: string;
  password: string;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export type UserDocument = HydratedDocument<IUser, IUserMethods>;

// 👇 Key: define a custom Model type that knows about methods
export interface UserModel extends Model<IUser, {}, IUserMethods> {}

const userSchema = new Schema<IUser, UserModel, IUserMethods>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
}, { timestamps: true });

// Pre-save middleware
userSchema.pre('save', async function (this: UserDocument, next) {
  if (!this.isModified('password')) return next();
  try {
    this.password = await bcrypt.hash(this.password, 12);
    next();
  } catch (err) {
    next(err as Error);
  }
});

// Instance method
userSchema.methods.comparePassword = async function (this: UserDocument, candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password);
};

// 👇 Properly typed Model
const User = mongoose.model<IUser, UserModel>('User', userSchema);

export default User;
