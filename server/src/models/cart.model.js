import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
            default: 1
        }
    }],
    totalAmount: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

// Calculate total amount before saving
cartSchema.pre('save', async function(next) {
    let total = 0;
    for (const item of this.items) {
        const product = await mongoose.model('Product').findById(item.product);
        if (product) {
            total += product.ourPrice * item.quantity;
        }
    }
    this.totalAmount = total;
    next();
});

export const Cart = mongoose.model('Cart', cartSchema); 