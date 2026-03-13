const authRouter = require('./authRouter');
const employeeRouter = require('./employeeRouter');
const roleRouter = require('./roleRouter');
const permissionRouter = require('./permissionRouter');
const { authenticate } = require('../middleware/authMiddleware');
const { sendJSON } = require('../middleware/parser');

const router = async (req, res) => {
    const { url } = req;
    
    // --- PUBLIC ROUTES ---
    if (url === '/api/login') {
        if (await authRouter(req, res)) return; 
    }

    // --- PROTECTED ROUTES ---
    try {
        await authenticate(req, res); 
        
        let matched = false;
        
        if (url.startsWith('/api/employee')) matched = await employeeRouter(req, res);
        else if (url.startsWith('/api/role')) matched = await roleRouter(req, res);
        else if (url.startsWith('/api/permission')) matched = await permissionRouter(req, res);
        else if (url === '/api/switch-role' || url === '/api/auth/me') matched = await authRouter(req, res);

        if (matched) return;
        
        sendJSON(res, 404, { error: 'Endpoint not found' });

    } catch (error) {
        if (!res.headersSent) {
            console.error(error);
            sendJSON(res, 500, { error: 'Internal Server Error' });
        }
    }
};

module.exports = router;