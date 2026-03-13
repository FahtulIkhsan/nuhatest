const pool = require('./db');

const getAllPermissions = async () => {
    const { rows } = await pool.query('SELECT * FROM PERMISSION ORDER BY category, permission_name');
    return rows;
};

const grantPermission = async (role_id, permission_id) => {
    await pool.query('INSERT INTO ROLE_PERMISSIONS (role_id, permission_id) VALUES ($1, $2)', [role_id, permission_id]);
};

const revokePermission = async (role_id, permission_id) => {
    await pool.query('DELETE FROM ROLE_PERMISSIONS WHERE role_id = $1 AND permission_id = $2', [role_id, permission_id]);
};

const getPermissionsByRoleId = async (role_id) => {
    const query = `
        SELECT p.permission_id, p.permission_name, p.category 
        FROM PERMISSION p
        JOIN ROLE_PERMISSIONS rp ON p.permission_id = rp.permission_id
        WHERE rp.role_id = $1
        ORDER BY p.category, p.permission_name
    `;
    const { rows } = await pool.query(query, [role_id]);
    return rows;
};

module.exports = { getAllPermissions, grantPermission, revokePermission, getPermissionsByRoleId };