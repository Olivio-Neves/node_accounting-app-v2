const users = [];
let userIdCounter = 1;

function getNextUserId() {
  return userIdCounter++;
}

function getUsers(req, res) {
  res.json(users);
}

function getUsersById(req, res) {
  const id = parseInt(req.params.id);
  const user = users.find((u) => u.id === id);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.json(user);
}

function postUsers(req, res) {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Missing parameter' });
  }

  const user = { id: getNextUserId(), name };

  users.push(user);
  res.status(201).json(user);
}

function putUsersById(req, res) {
  const id = parseInt(req.params.id);
  const { name } = req.body;
  const index = users.findIndex((u) => u.id === id);

  if (index === -1) {
    return res.status(404).json({ message: 'User not found' });
  }

  if (!name) {
    return res.status(400).json({ message: 'Missing parameter' });
  }

  users[index] = { ...users[index], name };
  res.json(users[index]);
}

function patchUsersById(req, res) {
  const id = parseInt(req.params.id);
  const index = users.findIndex((u) => u.id === id);

  if (index === -1) {
    return res.status(404).json({ message: 'User not found' });
  }

  users[index] = { ...users[index], ...req.body };
  res.json(users[index]);
}

function deleteUsersById(req, res) {
  const id = parseInt(req.params.id);
  const index = users.findIndex((u) => u.id === id);

  if (index === -1) {
    return res.status(404).json({ message: 'User not found' });
  }

  users.splice(index, 1);
  res.status(204).send();
}

module.exports = {
  getUsers,
  getUsersById,
  postUsers,
  putUsersById,
  patchUsersById,
  deleteUsersById,
};
