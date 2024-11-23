import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { UpdateContactDto } from './dto/update-contact.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Contact } from './entities/contact.entity';
import { Like, Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { CreateManyContactDto } from './dto/create-many-contact.dto';

@Injectable()
export class ContactsService {
  constructor(
    @InjectRepository(Contact)
    private readonly contactRepository: Repository<Contact>,
    private userService: UsersService
  ) {}

  async create(
    createContactDto: Partial<Contact>,
    user_id: number,
    imageUrl: string
  ) {
    const user = await this.userService.findOne(user_id);
    if (!user) {
      throw new HttpException(
        {
          success: false,
          error: 'Usuario no encontrado',
        },
        HttpStatus.NOT_FOUND
      );
    }
    const contactbyPhones = await this.contactRepository.findOne({
      where: { phone: createContactDto.phone, user },
    });

    if (contactbyPhones) {
      throw new HttpException(
        {
          success: false,
          error: 'ya tines un contacto agregado con ese numero',
        },
        HttpStatus.CONFLICT
      );
    }

    if (imageUrl) {
      createContactDto.image = imageUrl;
    }
    return await this.contactRepository.save({
      ...createContactDto,
      user,
    });
  }

  async createMany(createContactDto: CreateManyContactDto[], user_id: number) {
    const user = await this.userService.findOne(user_id);
    if (!user) {
      throw new HttpException(
        {
          success: false,
          error: 'Usuario no encontrado',
        },
        HttpStatus.NOT_FOUND
      );
    }

    const contactsNotFound: CreateManyContactDto[] = await Promise.all(
      createContactDto.map(async (contactDto) => {
        const contactFound = await this.contactRepository.findOne({
          where: { phone: contactDto.phone, user },
        });
        if (!contactFound) {
          return contactDto;
        }
        return null;
      })
    );

    const validContacts = contactsNotFound.filter(
      (contact) => contact !== null
    ) as CreateManyContactDto[];

    return await this.contactRepository.save(
      validContacts.map((contact) => ({
        ...contact,
        address: JSON.parse(contact.address),
        user,
        email: `${contact.name}@example.com`,
      }))
    );
  }

  async findByUser(user_id: number, name?: string) {
    const user = await this.userService.findOne(user_id);
    const contacts = await this.contactRepository.find({
      where: { user, name: name ? Like(`${name}%`) : undefined },
    });
    const groupedContacts = contacts.reduce(
      (acc, contact) => {
        const firstLetter = contact.name[0].toUpperCase();
        const section = acc.find((sec) => sec.title === firstLetter);
        if (section) {
          section.data.push(contact);
        } else {
          acc.push({ title: firstLetter, data: [contact] });
        }
        return acc;
      },
      [] as { title: string; data: typeof contacts }[]
    );
    return groupedContacts.sort((a, b) => a.title.localeCompare(b.title));
  }

  async findOne(id: number, user_id: number) {
    const contact = await this.contactRepository.findOne({ where: { id } });
    if (!contact) {
      throw new HttpException(
        {
          success: false,
          error: 'Contacto no encontrado',
        },
        HttpStatus.NOT_FOUND
      );
    }
    if (contact.user.id !== user_id) {
      throw new HttpException(
        {
          success: false,
          error: 'El id de tu contacto no pertenece a tus contactos',
        },
        HttpStatus.NOT_FOUND
      );
    }
    return contact;
  }

  async update(
    id: number,
    updateContactDto: UpdateContactDto,
    user_id: number,
    imageUrl: string
  ) {
    const user = await this.userService.findOne(user_id);
    const contact = await this.contactRepository.findOne({ where: { user } });
    if (!contact) {
      throw new HttpException(
        {
          success: false,
          error: 'Contacto no encontrado',
        },
        HttpStatus.NOT_FOUND
      );
    }
    const formatupdateContactDto: Partial<Contact> = {
      ...updateContactDto,
      address: JSON.parse(updateContactDto.address),
    };
    if (imageUrl) {
      formatupdateContactDto.image = imageUrl;
    }
    const result = await this.contactRepository.update(
      id,
      formatupdateContactDto
    );
    if (result.affected === 0) {
      throw new HttpException(
        {
          success: false,
          error: 'Contacto no encontrado',
        },
        HttpStatus.NOT_FOUND
      );
    }
    return {
      success: true,
      message: 'Contacto actualizado exitosamente',
    };
  }

  async remove(id: number, user_id: number) {
    console.log(id, user_id);
    const user = await this.userService.findOne(user_id);
    const contact = await this.contactRepository.findOne({ where: { user } });
    console.log(contact);
    if (!contact) {
      throw new HttpException(
        {
          success: false,
          error: 'Contacto no encontrado',
        },
        HttpStatus.NOT_FOUND
      );
    }
    const result = await this.contactRepository.delete(id);
    if (result.affected === 0) {
      throw new HttpException(
        {
          success: false,
          error: 'Contacto no encontrado',
        },
        HttpStatus.NOT_FOUND
      );
    }
    return {
      success: true,
      message: 'Contacto eliminado exitosamente',
    };
  }
}
