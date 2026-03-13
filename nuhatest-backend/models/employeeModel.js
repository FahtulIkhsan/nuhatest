const pool = require('./db');

const findByUsername = async (username) => {
    const { rows } = await pool.query('SELECT * FROM EMPLOYEE WHERE username = $1', [username]);
    return rows[0];
};

const createEmployee = async (username, hashedPassword) => {
    const { rows } = await pool.query(
        'INSERT INTO EMPLOYEE (username, password) VALUES ($1, $2) RETURNING uid, username',
        [username, hashedPassword]
    );
    return rows[0];
};

const getAllEmployees = async () => {
    const { rows } = await pool.query('SELECT uid, username FROM EMPLOYEE');
    return rows;
};

const updateUsername = async (uid, newUsername) => {
    const { rowCount } = await pool.query(
        'UPDATE EMPLOYEE SET username = $1 WHERE uid = $2', 
        [newUsername, uid]
    );
    return rowCount > 0;
};

const deleteEmployee = async (uid) => {
    const { rowCount } = await pool.query('DELETE FROM EMPLOYEE WHERE uid = $1', [uid]);
    return rowCount > 0;
};

const getEmployeeRoles = async (uid) => {
    const query = `
        SELECT r.role_name FROM ROLE r
        JOIN EMPLOYEE_ROLES er ON r.role_id = er.role_id
        WHERE er.uid = $1
    `;
    const { rows } = await pool.query(query, [uid]);
    return rows.map(row => row.role_name); 
};

module.exports = { findByUsername, createEmployee, getAllEmployees, updateUsername, deleteEmployee, getEmployeeRoles };