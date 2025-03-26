import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

/**
 * Middleware to authenticate JWT token
 * Extracts user information and adds it to req.user
 */
export const authenticateToken = (req, res, next) => {
    // Get token from Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN format
    
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
    
    try {
        // Verify token
        const decoded = jwt.verify(token, env.jwtSecret);
        
        // Add user info to request object
        req.user = {
            id: decoded.id,
            role: decoded.role // 'admin', 'volunteer', or 'provider'
        };
        
        next();
    } catch (error) {
        console.error('Token verification error:', error);
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
};

/**
 * Middleware to check if user is an opportunity provider
 * Must be used after authenticateToken
 */
export const requireProvider = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Authentication required' });
    }
    
    if (req.user.role !== 'provider') {
        return res.status(403).json({ message: 'Access denied. Only opportunity providers can perform this action.' });
    }
    
    next();
};

/**
 * Middleware to check if user is a volunteer
 * Must be used after authenticateToken
 */
export const requireVolunteer = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Authentication required' });
    }
    
    if (req.user.role !== 'volunteer') {
        return res.status(403).json({ message: 'Access denied. Only volunteers can perform this action.' });
    }
    
    next();
};

/**
 * Middleware to check if user is an admin
 * Must be used after authenticateToken
 */
export const requireAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Authentication required' });
    }
    
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Only administrators can perform this action.' });
    }
    
    next();
};