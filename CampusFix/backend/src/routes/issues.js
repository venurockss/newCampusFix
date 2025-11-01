const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const issueCtrl = require('../controllers/issueController');

router.post('/', authenticate, issueCtrl.createIssue);
router.get('/', authenticate, issueCtrl.listIssues);
router.get('/:id', authenticate, issueCtrl.getIssue);
router.put('/:id', authenticate, issueCtrl.updateIssue);
router.delete('/:id', authenticate, issueCtrl.deleteIssue);

module.exports = router;
