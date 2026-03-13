const employeeController = require('../controllers/employeeController');
const { requirePermission } = require('../middleware/permissionMiddleware');

const employeeRouter = async (req, res) => {
    const { url, method } = req;
    
    const uuidRegex = /^\/api\/employee\/([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/;
    const match = url.match(uuidRegex);

    if (url === '/api/employee' && method === 'POST') {
        await requirePermission(req, res, 'create_employee');
        await employeeController.createEmployee(req, res); return true;
    }
    if (url === '/api/employee' && method === 'GET') {
        await requirePermission(req, res, 'read_employee');
        await employeeController.getEmployees(req, res); return true;
    }
    if (match && method === 'PUT') {
        await requirePermission(req, res, 'update_employee');
        await employeeController.updateEmployee(req, res, match[1]); return true;
    }
    if (match && method === 'DELETE') {
        await requirePermission(req, res, 'delete_employee');
        await employeeController.deleteEmployee(req, res, match[1]); return true;
    }
    return false;
};
module.exports = employeeRouter;