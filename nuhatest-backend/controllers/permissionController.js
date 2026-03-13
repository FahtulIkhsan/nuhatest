const permissionModel = require('../models/permissionModel');
const { parseJSONBody, sendJSON } = require('../middleware/parser');

const getPermissions = async (req, res) => {
    const permissions = await permissionModel.getAllPermissions();
    sendJSON(res, 200, { data: permissions });
};

const grantToRole = async (req, res) => {
    try {
        const { role_id, permission_id } = await parseJSONBody(req);
        if (!role_id || !permission_id) return sendJSON(res, 400, { error: 'role_id and permission_id required' });

        await permissionModel.grantPermission(role_id, permission_id);
        sendJSON(res, 201, { message: 'Permission granted successfully' });
    } catch (error) {
        if (error.code === '23505') return sendJSON(res, 400, { error: 'Permission already granted to this role' });
        throw error;
    }
};

const revokeFromRole = async (req, res) => {
    const { role_id, permission_id } = await parseJSONBody(req);
    if (!role_id || !permission_id) return sendJSON(res, 400, { error: 'role_id and permission_id required' });

    await permissionModel.revokePermission(role_id, permission_id);
    sendJSON(res, 200, { message: 'Permission revoked successfully' });
};

module.exports = { getPermissions, grantToRole, revokeFromRole };