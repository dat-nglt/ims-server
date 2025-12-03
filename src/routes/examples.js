// routes/examples.js - Ví dụ sử dụng các authentication middleware

import express from 'express';
import {
  checkAuth,
  checkAdmin,
  checkRole,
  checkPermission,
  checkOwnership,
  checkAccess
} from '../middlewares/auth.middleware.js';

const router = express.Router();

// ============================================
// BASIC AUTHENTICATION EXAMPLES
// ============================================

// Public route - không cần auth
router.get('/public', (req, res) => {
  res.json({
    status: 'success',
    message: 'This is a public endpoint',
    timestamp: new Date().toISOString()
  });
});

// Protected route - cần đăng nhập
router.get('/protected', checkAuth, (req, res) => {
  res.json({
    status: 'success',
    message: `Hello ${req.user.name}!`,
    user: req.user
  });
});

// ============================================
// ROLE-BASED ACCESS CONTROL
// ============================================

// Chỉ Admin
router.get('/admin/dashboard', checkAuth, checkAdmin, (req, res) => {
  res.json({
    status: 'success',
    message: 'Admin dashboard accessed',
    adminData: { totalUsers: 1000, systemHealth: 'Good' }
  });
});

// Manager hoặc Admin
router.get('/management/reports', checkAuth, checkRole(['manager', 'admin']), (req, res) => {
  res.json({
    status: 'success',
    message: 'Management reports accessed',
    reports: ['Sales Report', 'Performance Report']
  });
});

// Chỉ Sales role
router.get('/sales/leads', checkAuth, checkRole('sales'), (req, res) => {
  res.json({
    status: 'success',
    message: 'Sales leads accessed',
    leads: ['Lead 1', 'Lead 2', 'Lead 3']
  });
});

// ============================================
// PERMISSION-BASED ACCESS CONTROL
// ============================================

// Cần permission users.read
router.get('/users', checkAuth, checkPermission('users.read'), (req, res) => {
  res.json({
    status: 'success',
    message: 'Users list accessed',
    users: ['User 1', 'User 2'] // Mock data
  });
});

// Cần cả users.read và users.write
router.post('/users', checkAuth, checkPermission(['users.read', 'users.write']), (req, res) => {
  res.json({
    status: 'success',
    message: 'User created successfully',
    newUser: req.body
  });
});

// ============================================
// OWNERSHIP CHECKS
// ============================================

// User chỉ có thể xem profile của mình
router.get('/users/:userId/profile', checkAuth, checkOwnership('userId'), (req, res) => {
  res.json({
    status: 'success',
    message: `Profile of user ${req.params.userId}`,
    profile: { name: 'User Name', email: 'user@example.com' }
  });
});

// User có thể update profile của mình
router.put('/users/:userId/profile', checkAuth, checkOwnership('userId'), (req, res) => {
  res.json({
    status: 'success',
    message: 'Profile updated successfully',
    updatedData: req.body
  });
});

// ============================================
// ADVANCED ACCESS CONTROL
// ============================================

// Project management - complex rules
router.get('/projects/:projectId',
  checkAuth,
  checkAccess({
    roles: ['manager', 'admin'],
    permissions: ['projects.read']
  }),
  (req, res) => {
    res.json({
      status: 'success',
      message: `Project ${req.params.projectId} details`,
      project: { id: req.params.projectId, name: 'Sample Project' }
    });
  }
);

// Chỉ owner hoặc admin mới có thể update project
router.put('/projects/:projectId',
  checkAuth,
  checkAccess({
    roles: ['admin'],
    permissions: ['projects.write'],
    requireOwnership: true,
    ownerField: 'projectManagerId'
  }),
  (req, res) => {
    res.json({
      status: 'success',
      message: `Project ${req.params.projectId} updated`,
      updatedData: req.body
    });
  }
);

// Work assignment - technician permissions
router.post('/works/:workId/assign',
  checkAuth,
  checkAccess({
    roles: ['manager', 'supervisor'],
    permissions: ['works.assign']
  }),
  (req, res) => {
    res.json({
      status: 'success',
      message: `Work ${req.params.workId} assigned to technician`,
      assignment: req.body
    });
  }
);

// ============================================
// UTILITY ENDPOINTS
// ============================================

// Get current user info
router.get('/me', checkAuth, (req, res) => {
  res.json({
    status: 'success',
    user: req.user
  });
});

// Check permissions for current user
router.get('/permissions', checkAuth, (req, res) => {
  res.json({
    status: 'success',
    permissions: req.user.permissions.map(p => p.name),
    roles: req.user.roles.map(r => r.name)
  });
});

export default router;