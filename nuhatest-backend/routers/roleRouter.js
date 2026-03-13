const roleController = require('../controllers/roleController');
const { requirePermission } = require('../middleware/permissionMiddleware');

const roleRouter = async (req, res) => {
    const { url, method } = req;

    const rolePermRegex = /^\/api\/role\/([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})\/permission$/;
    const permMatch = url.match(rolePermRegex);

    if (permMatch && method === 'GET') {
        await requirePermission(req, res, 'manage_roles'); 
        await roleController.getRolePermissions(req, res, permMatch[1]); return true;
    }
    if (url === '/api/role' && method === 'POST') {
        await requirePermission(req, res, 'create_role');
        await roleController.createRole(req, res); return true;
    }
    if (url === '/api/role' && method === 'GET') {
        await requirePermission(req, res, 'manage_roles');
        await roleController.getRoles(req, res); return true;
    }
    if (url === '/api/role/assign' && method === 'POST') {
        await requirePermission(req, res, 'assign_role');
        await roleController.assignRole(req, res); return true;
    }
    if (url === '/api/role/revoke' && method === 'POST') {
        await requirePermission(req, res, 'assign_role');
        await roleController.revokeRole(req, res); 
        return true;
    }
    return false;
};
module.exports = roleRouter;