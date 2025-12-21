import jwt from 'jsonwebtoken'

// user authentication middleware
const authUser = async (req, res, next) => {
    const { token } = req.headers
    if (!token) {
        return res.json({ success: false, message: 'Not Authorized Login Again' })
    }
    
    // Check if JWT_SECRET is configured
    if (!process.env.JWT_SECRET) {
        console.error('JWT_SECRET is not defined in environment variables')
        return res.json({ success: false, message: 'Server configuration error' })
    }
    
    try {
        const token_decode = jwt.verify(token, process.env.JWT_SECRET)
        req.body.userId = token_decode.id
        next()
    } catch (error) {
        console.log('JWT verification error:', error.name, error.message)
        // Provide clear error message for invalid signature (expired or wrong secret)
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return res.json({ 
                success: false, 
                message: 'Invalid or expired token. Please login again.',
                code: 'INVALID_TOKEN'
            })
        }
        res.json({ success: false, message: error.message })
    }
}

export default authUser;