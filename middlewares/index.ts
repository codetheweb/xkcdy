import {NextApiRequest, NextApiResponse} from 'next';
import mongoose from 'mongoose';
import nextConnect from 'next-connect';
import database from './database';

const middleware = nextConnect();

export default middleware.use(database);

export interface Request extends NextApiRequest {
	db: mongoose.Connection;
}

export interface Response extends NextApiResponse {}
