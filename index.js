import express from 'express';
import cors from "cors";
import { PORT } from './config/env.js';
import authRouter from './routes/auth.routes.js';
import connectToDatabase from './database/mongodb.js';
import userRouter from './routes/user.route.js';
import taskRouter from './routes/task.route.js';
import errorMiddleware from './middlewares/error.middleware.js';
import arcjetMiddleware from './middlewares/arcjet.middleware.js';
const app = express();


app.use(cors({
	origin: "http://localhost:3000", 
	credentials: true, 
}));
  

app.use(express.json());

app.use(errorMiddleware);
app.use(arcjetMiddleware);


app.get('/', (req, res) => { 
    res.send('Welcome to Task mangement API!');
}
);

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/tasks', taskRouter);



app.listen(PORT, async() => {
    console.log(`Server is running on port http://localhost:${PORT}`);

    try {
		await connectToDatabase(); 
		console.log('Connected to MongoDB.');

		
	} catch (error) {
		console.error(
			'Failed to connect to databases or initialize workflow:',
			error
		);
		
		process.exit(1);
	}
});
