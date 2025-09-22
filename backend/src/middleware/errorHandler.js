import AppError from "../utils/appError.js";

// Global error handling middleware
const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    // Log error
    console.error(err);

    // AppError - operational errors
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            success: false,
            error: err.message,
        });
    }

    // Database errors
    if (err.code === '23505') { // PostgreSQL unique violation
        const message = 'Duplicate field value entered';
        error = new AppError(message, 400);
        return res.status(error.statusCode).json({
            success: false,
            error: error.message,
        });
    }

    if (err.code === '23503') { // PostgreSQL foreign key violation
        const message = 'Resource not found';
        error = new AppError(message, 404);
        return res.status(error.statusCode).json({
            success: false,
            error: error.message,
        });
    }

    // Default to 500 server error
    return res.status(500).json({
        success: false,
        error: 'Internal Server Error',
    });
};

export default errorHandler;