import { IsString, IsNotEmpty, IsPhoneNumber, ValidateNested, IsObject } from 'class-validator';
import { AddressDto } from './create-contact.dto';
import { Type } from 'class-transformer';
import { AddressInterface } from 'src/common/interfaces/address.interface';

export class CreateManyContactDto {
  @IsNotEmpty({ message: 'El nombre es obligatorio.' })
  @IsString({ message: 'El nombre debe ser una cadena de texto.' })
  name: string;

  @IsNotEmpty({ message: 'El teléfono es obligatorio.' })
  @IsPhoneNumber(null, { message: 'El teléfono debe ser un número válido.' })
  phone: string;

  @IsObject()
  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressInterface;

  @IsNotEmpty({ message: 'El nombre es obligatorio.' })
  @IsString({ message: 'El nombre debe ser una cadena de texto.' })
  role: string;
}

