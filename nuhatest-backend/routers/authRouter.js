const authController = require('../controllers/authController');

const authRouter = async (req, res) => {
    const { url, method } = req;
    
    if (url === '/api/login' && method === 'POST') {
        await authController.login(req, res); return true;
    }
    if (url === '/api/switch-role' && method === 'POST') {
        await authController.switchRole(req, res); return true;
    }
    if (url === '/api/auth/me' && method === 'GET') {
        await authController.getMe(req, res); return true;
    }
    return false;
};
module.exports = authRouter;