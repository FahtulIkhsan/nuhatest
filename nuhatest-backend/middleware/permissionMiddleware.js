const { sendJSON } = require('./parser');
const roleModel = require('../models/roleModel');

const requirePermission = async (req, res, requiredPermission) => {
    const activeRole = req.user?.activeRole; 
    if (!activeRole) {
        sendJSON(res, 403, { error: 'Forbidden: No active role selected' });
        throw new Error('Forbidden'); 
    }

    try {
        const permissions = await roleModel.getPermissionsForRole(activeRole);
        if (!permissions.includes(requiredPermission)) {
            sendJSON(res, 403, { error: `Forbidden: Requires '${requiredPermission}' permission` });
            throw new Error('Forbidden'); 
        }
        return true; 
    } catch (error) {
        if (!res.headersSent) sendJSON(res, 500, { error: 'Server error checking permissions' });
        throw new Error('ServerError');
    }
};

module.exports = { requirePermission };