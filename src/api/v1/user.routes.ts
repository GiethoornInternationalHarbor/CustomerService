import express = require('express');
import { CastError } from 'mongoose';
import { ApiError } from '../../errors/index';
import { IUserDocument } from '../../model/schemas/user.schema';
import { IUserModel, User } from '../../model/user.model';
import { UserService } from '../../service/user.service';
import { expressAsync } from '../../utils/express.async';
import { ValidationHelper } from '../../utils/validationhelper';

const routes = express.Router();

routes.get('/', expressAsync(async (req, res, next) => {

    let users;

    users = await UserService.getusers();

    res.json(users);
}));

routes.get('/:id', expressAsync(async (req, res, next) => {

    if (!ValidationHelper.isValidMongoId(req.params.id)) {
        throw new ApiError(400, 'Invalid ID!');
    }

    const user = await UserService.getUser(req.params.id);

    if (!user) {
        throw new ApiError(404, 'Accommodation not found');
    }

    res.json(user);
}));

routes.post('/', expressAsync(async (req, res, next) => {
    // Get the user id
    const userId = req.body.id;

    const reqBody = req.body;

    const newUser = {
        name: reqBody.name,
        email: reqBody.email,
        password: reqBody.password
    } as IUserDocument;

    const user = await UserService.addUser(newUser);

    res.status(201).send(user);
}));

routes.put('/:id', expressAsync(async (req, res, next) => {
    if (!ValidationHelper.isValidMongoId(req.params.id)) {
        throw new ApiError(400, 'Invalid ID!');
    }

    let user;

    try {
        user = await UserService.updateUser(req.params.id, req.body);
    } catch (err) {
        if (err instanceof CastError as any) {
            throw new ApiError(400, err.path + ' must be of type ' + err.kind);
        } else {
            throw err;
        }
    }

    res.json(user);
}));

routes.delete('/:id', expressAsync(async (req, res, next) => {
    if (!ValidationHelper.isValidMongoId(req.params.id)) {
        throw new ApiError(400, 'Invalid id supplied!');
    }

    const response = await UserService.deleteUser(req.params.id);
    if (!response) {
        throw new ApiError(400, 'Invalid id supplied!');
    } else {
        res.sendStatus(204);
    }
}));

export default routes;
