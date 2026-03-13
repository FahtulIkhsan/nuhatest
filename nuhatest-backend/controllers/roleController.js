const roleModel = require('../models/roleModel');
const permissionModel = require('../models/permissionModel');
const { parseJSONBody, sendJSON } = require('../middleware/parser');

const createRole = async (req, res) => {
    try {
        const { role_name } = await parseJSONBody(req);
        if (!role_name) return sendJSON(res, 400, { error: 'Role name required' });
        
        const newRole = await roleModel.createRole(role_name);
        sendJSON(res, 201, { message: 'Role created', data: newRole });
    } catch (error) {
        if (error.code === '23505') return sendJSON(res, 400, { error: 'Role exists' });
        throw error;
    }
};

const getRoles = async (req, res) => {
    const roles = await roleModel.getAllRoles();
    sendJSON(res, 200, { data: roles });
};

const assignRole = async (req, res) => {
    try {
        const { uid, role_id } = await parseJSONBody(req);
        if (!uid || !role_id) return sendJSON(res, 400, { error: 'uid and role_id required' });

        await roleModel.assignRoleToEmployee(uid, role_id);
        sendJSON(res, 201, { message: 'Role assigned successfully' });
    } catch (error) {
        if (error.code === '23505') return sendJSON(res, 400, { error: 'Role already assigned to this employee' });
        throw error;
    }
};

const getRolePermissions = async (req, res, role_id) => {
    const permissions = await permissionModel.getPermissionsByRoleId(role_id);
    sendJSON(res, 200, { data: permissions });
};

const revokeRole = async (req, res) => {
    const { uid, role_id } = await parseJSONBody(req);
    if (!uid || !role_id) return sendJSON(res, 400, { error: 'uid and role_id required' });

    const success = await roleModel.revokeRoleFromEmployee(uid, role_id);
    if (!success) return sendJSON(res, 404, { error: 'Role assignment not found for this employee' });
    
    sendJSON(res, 200, { message: 'Role revoked successfully' });
};

module.exports = { createRole, getRoles, assignRole, getRolePermissions, revokeRole };