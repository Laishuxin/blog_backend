import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  create(@Body() createMessageDto: CreateMessageDto) {
    return this.messageService.create(createMessageDto);
  }

  @Get('list')
  findMany(
    @Query('offset') offset: number = 0,
    @Query('limit') limit: number = 10,
    @Query('sortKey') sortKey = 'updateAt',
    @Query('isAsc') isAsc: number = 0,
  ) {
    return this.messageService.findMany();
  }

  @Get('item/:id')
  findOne(@Param('id') id: string) {
    return this.messageService.findOne(+id);
  }

  @Patch('item/:id')
  update(@Param('id') id: string, @Body() updateMessageDto: UpdateMessageDto) {
    return this.messageService.update(+id, updateMessageDto);
  }

  @Delete('item/:id')
  remove(@Param('id') id: string) {
    return this.messageService.remove(+id);
  }
}
