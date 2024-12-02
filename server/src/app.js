import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import productRouter from './routes/product.routes.js';
import cartRouter from './routes/cart.routes.js';

const app = express();

// Middlewares
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

// Routes
app.use("/api/products", productRouter);
app.use('/api/cart', cartRouter);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: "Something went wrong!"
    });
});

export default app; 