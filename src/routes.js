import { Router } from 'express';
import multer from 'multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';

import authMiddleware from './app/middleware/auth';
import FileController from './app/controllers/FileController';
import MeetupController from './app/controllers/MeetupController';
import AvailableMeetupController from './app/controllers/AvailableMeetupController';
import SubscriptionController from './app/controllers/SubscriptionController';
import UserMeetupController from './app/controllers/UserMeetupController';

import multerConfig from './config/multer';

const routes = new Router();
const upload = multer(multerConfig);
routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.post('/subscriptions', SubscriptionController.store);

routes.get('/meetups', AvailableMeetupController.index);
routes.post('/meetups', MeetupController.store);

routes.get('/meetups/organizing', UserMeetupController.organizing);
routes.get('/meetups/subscribed', UserMeetupController.subscribed);

routes.delete('/meetups/:id', MeetupController.delete);
routes.put('/meetups/:id', MeetupController.update);

routes.put('/users', UserController.update);

routes.post('/files', upload.single('file'), FileController.store);
module.exports = routes;
