'use server'

import mongoose from 'mongoose';
import TopicModel from './models/db/topic.model';
import UserModel from './models/db/users.model';

const getUsers = async () => {
  return await UserModel.find();
}

const getUserByMiroUserId = async ( userId: string ) => {
  return await UserModel.findOne( { userId } ).populate( 'topics', {
    model: TopicModel,
  } ).populate( 'students', { model: UserModel } ).exec();
}

const getUserById = async ( userId: string ) => {
  console.log( 'getUserById', userId )
  return await UserModel.findOne( { _id: new mongoose.Types.ObjectId( userId ) } ).populate( 'topics', {
    model: TopicModel,
  } ).exec();
}

export {
  getUsers,
  getUserByMiroUserId,
  getUserById,
};