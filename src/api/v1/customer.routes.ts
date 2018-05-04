import express = require('express');
import { CastError } from 'mongoose';
import { ApiError } from '../../errors/index';
import { Customer, ICustomerModel } from '../../model/customer.model';
import { ICustomerDocument } from '../../model/schemas/customer.schema';
import { CustomerService } from '../../service/customer.service';
import { expressAsync } from '../../utils/express.async';
import { ValidationHelper } from '../../utils/validationhelper';

const routes = express.Router();

routes.post('/', expressAsync(async (req, res, next) => {
    // Get the customer id
    const customerId = req.body.id;

    const reqBody = req.body;

    const newCustomer = {
        name: reqBody.name,
        email: reqBody.email,
        password: reqBody.password
    } as ICustomerDocument;

    const customer = await CustomerService.addCustomer(newCustomer);

    res.status(201).send(customer);
}));

routes.put('/:id', expressAsync(async (req, res, next) => {
    if (!ValidationHelper.isValidMongoId(req.params.id)) {
        throw new ApiError(400, 'Invalid ID!');
    }

    let customer;

    try {
        customer = await CustomerService.updateCustomer(req.params.id, req.body);
    } catch (err) {
        if (err instanceof CastError as any) {
            throw new ApiError(400, err.path + ' must be of type ' + err.kind);
        } else {
            throw err;
        }
    }

    res.json(customer);
}));

routes.delete('/:id', expressAsync(async (req, res, next) => {
    if (!ValidationHelper.isValidMongoId(req.params.id)) {
        throw new ApiError(400, 'Invalid id supplied!');
    }

    const response = await CustomerService.deleteCustomer(req.params.id);
    if (!response) {
        throw new ApiError(400, 'Invalid id supplied!');
    } else {
        res.sendStatus(204);
    }
}));

export default routes;
