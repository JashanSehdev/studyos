import jwt from 'jsonwebtoken'

const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, kindly login'})
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.userId = decoded.userId
        next()
    } catch (err) {
        res.status(500).json({ message: 'Invalid Token, please LogIn'})
        
    }
}

export default authMiddleware