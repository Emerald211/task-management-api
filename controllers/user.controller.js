import User from '../models/user.model.js';

export const getUsers = async (req, res, next) => {
	try {
		const users = await User.find();

		res.status(200).json({ success: true, data: users });
	} catch (error) {
		next(error);
	}
};

export const getUser = async (req, res, next) => {
	try {
		const user = await User.findById(req.params.id).select('-password');

		if (!user) {
			const error = new Error('User not found');
			error.statusCode = 404;
			throw error;
		}

		res.status(200).json({
			success: true,
			data: user,
		});
	} catch (error) {
		next(error);
	}
};

export const updateUserProfile = async (req, res) => {
	try {
	  const userId = req.user.id; 
	  const { name, email } = req.body;
  
	  const updatedUser = await User.findByIdAndUpdate(
		userId,
		{ name, email },
		{ new: true }
	  );
  
	  res.json(updatedUser);
	} catch (error) {
	  res.status(500).json({ message: "Server error" });
	}
  };
  