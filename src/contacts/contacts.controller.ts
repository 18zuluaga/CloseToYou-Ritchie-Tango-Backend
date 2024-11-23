import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('contacts')
export class ContactsController {
  constructor(
    private readonly contactsService: ContactsService,
    private readonly cloudinaryService: CloudinaryService
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Body() createContactDto: CreateContactDto,
    @UploadedFile() file: Express.Multer.File | undefined,
    @Request() req
  ) {
    const user = req.user;
    let imageUrl = '';
    if (file) {
      const uploadResult = await this.cloudinaryService.uploadImage(file);
      imageUrl = uploadResult.secure_url;
    }
    const formatcreateContactDto = {
      ...createContactDto,
      address: JSON.parse(createContactDto.address),
    };
    return this.contactsService.create(
      formatcreateContactDto,
      +user.id,
      imageUrl
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findByUser(@Request() req, @Query('name') name?: string) {
    const user = req.user;
    return this.contactsService.findByUser(+user.id, name);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    const user = req.user;
    return this.contactsService.findOne(+id, +user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @Param('id') id: string,
    @Body() updateContactDto: UpdateContactDto,
    @Request() req,
    @UploadedFile() file: Express.Multer.File | undefined
  ) {
    let imageUrl = '';
    if (file) {
      const uploadResult = await this.cloudinaryService.uploadImage(file);
      imageUrl = uploadResult.secure_url;
    }
    const user = req.user;
    return this.contactsService.update(
      +id,
      updateContactDto,
      +user.id,
      imageUrl
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    const user = req.user;
    return this.contactsService.remove(+id, +user.id);
  }
}
