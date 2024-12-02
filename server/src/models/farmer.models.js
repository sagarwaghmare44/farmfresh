import mongoose from 'mongoose';

const farmerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
});

const Farmer = mongoose.model('Farmer', farmerSchema);

export default Farmer;
