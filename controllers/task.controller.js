import Task from '../models/task.model.js';

export const createTask = async (req, res, next) => {
	try {
		const { title, description, dueDate } = req.body;

		const task = await Task.create({
			title,
			description,
			dueDate,
			user: req.user._id,
		});

		res.status(201).json({
			success: true,
			message: 'Task Created Successfully',
			data: task,
		});
	} catch (error) {
		next(error);
	}
};

export const getTasks = async (req, res, next) => {
	try {
		const { completed, page = 1, limit = 10, sort = "-createdAt", search } = req.query;

		const query = { user: req.user._id };

		if (completed === 'true') {
			query.completed = true;
		} else if (completed === 'false') {
			query.completed = false;
        }
        
        if (search) {
            query.$or = [
              { title: { $regex: search, $options: "i" } },
              { description: { $regex: search, $options: "i" } },
            ];
          }

		const tasks = await Task.find(query)
			.skip((page - 1) * limit)
			.limit(parseInt(limit))
			.sort(sort);

		const total = await Task.countDocuments(query);

		res.status(200).json({
			success: true,
			total,
			page: parseInt(page),
			pages: Math.ceil(total / limit),
			data: tasks,
		});
	} catch (error) {
		next(error);
	}
};

export const updateTask = async (req, res, next) => {
	const { title, description, dueDate, completed } = req.body;
	try {
		const task = await Task.findByIdAndUpdate(
			{ _id: req.params.id, user: req.user._id },
			{ title, description, dueDate, completed },
			{ new: true, runValidators: true }
		);

		if (!task) {
			const error = new Error('Task not found');
			error.statusCode = 404;
			throw error;
		}

		res.status(200).json({
			success: true,
			message: 'Task updated successfully',
			data: task,
		});
	} catch (error) {
		next(error);
	}
};

export const deleteTask = async (req, res, next) => {
	try {
		const task = await Task.findByIdAndDelete({
			_id: req.params.id,
			user: req.user._id,
		});

		if (!task) {
			const error = new Error('Task not found');
			error.statusCode = 404;
			throw error;
		}

		res.status(200).json({
			success: true,
			message: 'Task deleted successfully',
		});
	} catch (error) {
		next(error);
	}
};
