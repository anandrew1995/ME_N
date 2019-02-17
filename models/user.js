import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const UserSchema = new Schema({
	id: ObjectId,
	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
	    required: true,
	    index: {
			unique: true
	    }
	},
	password: {
		type: String,
		required: true
	},
	date: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);

export default User;
