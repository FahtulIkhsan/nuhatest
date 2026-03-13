const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const employeeModel = require('../models/employeeModel');
const roleModel = require('../models/roleModel');
const { parseJSONBody, sendJSON } = require('../middleware/parser');
require('dotenv').config();

const login = async (req, res) => {
    const { username, password } = await parseJSONBody(req);
    const employee = await employeeModel.findByUsername(username);
    
    if (!employee || !(await bcrypt.compare(password, employee.password))) {
        return sendJSON(res, 401, { error: 'Invalid credentials' });
    }

    const roles = await employeeModel.getEmployeeRoles(employee.uid);
    const activeRole = roles.length > 0 ? roles[0] : null;

    let permissions = [];
    if (activeRole) permissions = await roleModel.getPermissionsForRole(activeRole);

    const token = jwt.sign(
        { uid: employee.uid, username: employee.username, roles, activeRole },
        process.env.JWT_SECRET, { expiresIn: '2h' }
    );
    sendJSON(res, 200, { message: 'Login successful', activeRole, permissions, token });
};

const switchRole = async (req, res) => {
    const { targetRole } = await parseJSONBody(req);
    if (!req.user.roles.includes(targetRole)) {
        return sendJSON(res, 403, { error: `Cannot assume role: ${targetRole}` });
    }

    const permissions = await roleModel.getPermissionsForRole(targetRole);
    const newToken = jwt.sign(
        { ...req.user, activeRole: targetRole },
        process.env.JWT_SECRET, { expiresIn: '2h' }
    );
    sendJSON(res, 200, { message: `Role switched to ${targetRole}`, activeRole: targetRole, permissions, token: newToken });
};

const getMe = async (req, res) => {
    const { uid, username, roles, activeRole } = req.user;
    
    let permissions = [];
    if (activeRole) permissions = await roleModel.getPermissionsForRole(activeRole);

    sendJSON(res, 200, { data: { uid, username, roles, activeRole, permissions } });
};

module.exports = { login, switchRole, getMe };