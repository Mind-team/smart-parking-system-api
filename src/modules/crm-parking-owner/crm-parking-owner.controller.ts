import { Body, Controller, Post, UseGuards, Version } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CrmParkingOwnerService } from './crm-parking-owner.service';
import { Available, AvailableGuard, Role } from '../availability';

@ApiTags('CRM владелец паркинга')
@Controller('crm-parking-owner')
export class CrmParkingOwnerController {
  constructor(private service: CrmParkingOwnerService) {}

  @Version('1')
  @Post('')
  @UseGuards(AvailableGuard)
  @Available(Role.ModeratorCRM)
  async create(@Body() data: { login: string; password: string }) {
    await this.service.createParkingOwner(data.login, data.password);
  }
}
