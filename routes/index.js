const express = require('express');
const router = express.Router();

const authRoute = require('./auth.route');
const usersRoute = require('./users.route');
const herbsRoute = require('./herbs.route');
const plansRoute = require('./plans.route');
const batchesRoute = require('./batches.route');
const tasksRoute = require('./tasks.route');
const measurementsRoute = require('./measurements.route');
const alertsRoute = require('./alerts.route');
const automationRoute = require('./automation.route');
const reportsRoute = require('./reports.route');
const auditRoute = require('./audit.route');

router.use('/auth', authRoute);
router.use('/users', usersRoute);
router.use('/herbs', herbsRoute);
router.use('/plans', plansRoute);
router.use('/batches', batchesRoute);
router.use('/tasks', tasksRoute);
router.use('/measurements', measurementsRoute);
router.use('/alerts', alertsRoute);
router.use('/automation', automationRoute);
router.use('/reports', reportsRoute);
router.use('/audit', auditRoute);

module.exports = router;