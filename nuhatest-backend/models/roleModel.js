const pool = require('./db');

const createRole = async (role_name) => {
    const { rows } = await pool.query('INSERT INTO ROLE (role_name) VALUES ($1) RETURNING *', [role_name]);
    return rows[0];
};

const getAllRoles = async () => {
    const { rows } = await pool.query('SELECT * FROM ROLE');
    return rows;
};

const assignRoleToEmployee = async (uid, role_id) => {
    await pool.query('INSERT INTO EMPLOYEE_ROLES (uid, role_id) VALUES ($1, $2)', [uid, role_id]);
};

const getPermissionsForRole = async (roleName) => {
    const query = `
        SELECT p.permission_name FROM PERMISSION p
        JOIN ROLE_PERMISSIONS rp ON p.permission_id = rp.permission_id
        JOIN ROLE r ON r.role_id = rp.role_id
        WHERE r.role_name = $1
    `;
    const { rows } = await pool.query(query, [roleName]);
    return rows.map(row => row.permission_name);
};

const revokeRoleFromEmployee = async (uid, role_id) => {
    const { rowCount } = await pool.query(
        'DELETE FROM EMPLOYEE_ROLES WHERE uid = $1 AND role_id = $2',
        [uid, role_id]
    );
    return rowCount > 0; // Returns true if a row was actually deleted
};

module.exports = { createRole, getAllRoles, assignRoleToEmployee, getPermissionsForRole, revokeRoleFromEmployee };