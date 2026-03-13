const bcrypt = require('bcryptjs');
const employeeModel = require('../models/employeeModel');
const { parseJSONBody, sendJSON } = require('../middleware/parser');

const createEmployee = async (req, res) => {
    try {
        const { username, password } = await parseJSONBody(req);
        if (!username || !password) return sendJSON(res, 400, { error: 'Username and password required' });

        const hashedPassword = await bcrypt.hash(password, await bcrypt.genSalt(10));
        const newEmployee = await employeeModel.createEmployee(username, hashedPassword);
        sendJSON(res, 201, { message: 'Employee created', data: newEmployee });
    } catch (error) {
        if (error.code === '23505') return sendJSON(res, 400, { error: 'Username exists' });
        throw error; 
    }
};

const getEmployees = async (req, res) => {
    const employees = await employeeModel.getAllEmployees();
    sendJSON(res, 200, { data: employees });
};

const updateEmployee = async (req, res, uid) => {
    try {
        const { username } = await parseJSONBody(req);
        if (!username) return sendJSON(res, 400, { error: 'New username required' });

        const success = await employeeModel.updateUsername(uid, username);
        if (!success) return sendJSON(res, 404, { error: 'Employee not found' });
        
        sendJSON(res, 200, { message: 'Employee username updated' });
    } catch (error) {
        if (error.code === '23505') return sendJSON(res, 400, { error: 'Username already taken' });
        throw error; 
    }
};

const deleteEmployee = async (req, res, uid) => {
    const success = await employeeModel.deleteEmployee(uid);
    if (!success) return sendJSON(res, 404, { error: 'Employee not found' });
    sendJSON(res, 200, { message: 'Employee deleted' });
};

module.exports = { createEmployee, getEmployees, updateEmployee, deleteEmployee };