import express from 'express';
import { inject, injectable } from 'inversify';
import { controller, httpPost, httpDelete, httpPut, interfaces, next, request, response} from 'inversify-express-utils';
import { ICustomerService } from '../application/service/ICustomer.service';
import { TYPES } from '../di/types';

@controller('/api/v1/customers')
export class CustomerController implements interfaces.Controller {
  constructor(
    @inject(TYPES.ICustomerService) private customerService: ICustomerService
  ) {}

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
    const customer = await this.customerService.update(req.body);
    res.status(200).json(customer);
  }

  @httpDelete('/:id')
  private async deleteCustomer(
    @request() req: express.Request,
    @response() res: express.Response
  ) {
    const customer = await this.customerService.delete(req.params.id);
    res.status(200).json(customer);
  }
}