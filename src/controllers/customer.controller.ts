import express from 'express';
import { inject, injectable } from 'inversify';
import { ApiError } from '../errors/index';
import {
  controller,
  httpGet,
  httpPost,
  httpDelete,
  httpPut,
  interfaces,
  next,
  request,
  response
} from 'inversify-express-utils';
import { ICustomerService } from '../application/service/ICustomer.service';
import { TYPES } from '../di/types';

@controller('/api/customer')
export class CustomerController implements interfaces.Controller {
  constructor(
    @inject(TYPES.ICustomerService) private customerService: ICustomerService
  ) {}

  @httpGet('/')
  private async getAll(@response() res: express.Response) {
    const customers = await this.customerService.getAll();
    res.json(customers);
  }

  @httpPost('/')
  private async addCustomer(
    @request() req: express.Request,
    @response() res: express.Response
  ) {
    const customer = await this.customerService.add(req.body);
    res.status(201).json(customer);
  }

  @httpPut('/:id')
  private async updateCustomer(
    @request() req: express.Request,
    @response() res: express.Response
  ) {
    let customer;
    customer = await this.customerService.update(req.params.id, req.body);
    res.status(200).json(customer);
  }

  @httpDelete('/:id')
  private async deleteCustomer(
    @request() req: express.Request,
    @response() res: express.Response
  ) {
    const response = await this.customerService.delete(req.params.id);
    if (!response) {
      throw new ApiError(400, 'Invalid id supplied!');
    } else {
      res.status(204);
    }
  }
}
