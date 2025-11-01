const prisma = require('../../prisma/client');

async function createIssue(req, res) {
  const { title, description } = req.body;
  if (!title) return res.status(400).json({ message: 'title required' });
  try {
    const issue = await prisma.issue.create({ data: { title, description, reporterId: req.user.id } });
    res.status(201).json({ issue });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

async function listIssues(req, res) {
  try {
    const issues = await prisma.issue.findMany({ include: { reporter: { select: { id: true, email: true, name: true } } }, orderBy: { createdAt: 'desc' } });
    res.json({ issues });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

async function getIssue(req, res) {
  const id = Number(req.params.id);
  try {
    const issue = await prisma.issue.findUnique({ where: { id }, include: { reporter: { select: { id: true, email: true, name: true } } } });
    if (!issue) return res.status(404).json({ message: 'Issue not found' });
    res.json({ issue });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

async function updateIssue(req, res) {
  const id = Number(req.params.id);
  const { title, description, status } = req.body;
  try {
    const issue = await prisma.issue.update({ where: { id }, data: { title, description, status } });
    res.json({ issue });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

async function deleteIssue(req, res) {
  const id = Number(req.params.id);
  try {
    await prisma.issue.delete({ where: { id } });
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { createIssue, listIssues, getIssue, updateIssue, deleteIssue };
