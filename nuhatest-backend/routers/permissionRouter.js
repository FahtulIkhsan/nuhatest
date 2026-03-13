const permissionController = require('../controllers/permissionController');
const { requirePermission } = require('../middleware/permissionMiddleware');

const permissionRouter = async (req, res) => {
    const { url, method } = req;

    if (url === '/api/permission' && method === 'GET') {
        await requirePermission(req, res, 'grant_permission');
        await permissionController.getPermissions(req, res); return true;
    }
    if (url === '/api/permission/grant' && method === 'POST') {
        await requirePermission(req, res, 'grant_permission');
        await permissionController.grantToRole(req, res); return true;
    }
    if (url === '/api/permission/revoke' && method === 'POST') {
        await requirePermission(req, res, 'revoke_permission');
        await permissionController.revokeFromRole(req, res); return true;
    }
    return false;
};
module.exports = permissionRouter;