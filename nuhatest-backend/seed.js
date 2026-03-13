const pool = require('./models/db');
const bcrypt = require('bcryptjs');

const seedDatabase = async () => {
    try {
        console.log('Starting database seed...');

        // 1. Clear existing data
        await pool.query('TRUNCATE TABLE ROLE_PERMISSIONS, EMPLOYEE_ROLES, PERMISSION, ROLE, EMPLOYEE CASCADE');
        
        // 2. Insert Roles
        await pool.query(`INSERT INTO ROLE (role_name) VALUES ('admin'), ('manager'), ('employee')`);
        
        // 3. Insert Permissions
        const permissionsSQL = `
            INSERT INTO PERMISSION (permission_name, category) VALUES 
            ('read_employee', 'manage_employees'), ('create_employee', 'manage_employees'),
            ('update_employee', 'manage_employees'), ('delete_employee', 'manage_employees'),
            ('manage_roles', 'manage_roles'), ('create_role', 'manage_roles'), ('assign_role', 'manage_roles'),
            ('grant_permission', 'manage_permissions'), ('revoke_permission', 'manage_permissions'),
            ('view_employee_menu', 'ui_access'), ('view_role_menu', 'ui_access')
        `;
        await pool.query(permissionsSQL);

        // 4. Map Permissions to Roles
        await pool.query(`
            INSERT INTO ROLE_PERMISSIONS (role_id, permission_id)
            SELECT r.role_id, p.permission_id FROM ROLE r CROSS JOIN PERMISSION p WHERE r.role_name = 'admin'
        `);
        await pool.query(`
            INSERT INTO ROLE_PERMISSIONS (role_id, permission_id)
            SELECT r.role_id, p.permission_id FROM ROLE r CROSS JOIN PERMISSION p 
            WHERE r.role_name = 'manager' AND p.permission_name IN ('read_employee', 'create_employee', 'update_employee', 'view_employee_menu')
        `);
        await pool.query(`
            INSERT INTO ROLE_PERMISSIONS (role_id, permission_id)
            SELECT r.role_id, p.permission_id FROM ROLE r CROSS JOIN PERMISSION p 
            WHERE r.role_name = 'employee' AND p.permission_name IN ('read_employee', 'view_employee_menu')
        `);

        // 5. Create the Super Admin User
        const hashedPassword = await bcrypt.hash('admin123', 10);
        const { rows } = await pool.query(
            'INSERT INTO EMPLOYEE (username, password) VALUES ($1, $2) RETURNING uid',
            ['superadmin', hashedPassword]
        );
        const adminUid = rows[0].uid;

        // 6. Assign the 'admin' role to the Super Admin
        await pool.query(`
            INSERT INTO EMPLOYEE_ROLES (uid, role_id)
            SELECT $1, role_id FROM ROLE WHERE role_name = 'admin'
        `, [adminUid]);

        console.log('Database seeded successfully!');
        console.log('You can now login with:');
        console.log('Username: superadmin');
        console.log('Password: admin123');

    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        pool.end(); // Close the connection
    }
};

seedDatabase();