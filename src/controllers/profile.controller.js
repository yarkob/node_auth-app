const { User } = require('../models/User.model');
const changeName = async (req, res) => {
  const { name, email } = req.body;
  const user = await User.findOne({ where: { email } });

  user.name = name;
  await user.save();

  res.send({ message: 'OK' });
};

module.exports.profileController = {
  changeName,
};
