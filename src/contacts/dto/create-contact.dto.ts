import { IsString, IsEmail, IsNotEmpty, IsPhoneNumber, ValidateNested, IsObject } from 'class-validator';
import { Type } from 'class-transformer';

export class AddressDto {
  @IsNotEmpty({ message: 'La latitud es obligatoria.' })
  latitude: number;

  @IsNotEmpty({ message: 'La longitud es obligatoria.' })
  longitude: number;

  @IsNotEmpty({ message: 'Latitude Delta es obligatorio.' })
  latitudeDelta: number;

  @IsNotEmpty({ message: 'Longitude Delta es obligatorio.' })
  longitudeDelta: number;
}

export class CreateContactDto {
  @IsNotEmpty({ message: 'El nombre es obligatorio.' })
  @IsString({ message: 'El nombre debe ser una cadena de texto.' })
  name: string;

  @IsNotEmpty({ message: 'El teléfono es obligatorio.' })
  @IsPhoneNumber(null, { message: 'El teléfono debe ser un número válido.' })
  phone: string;

  @IsNotEmpty({ message: 'El correo electrónico es obligatorio.' })
  @IsEmail({}, { message: 'El correo electrónico debe ser un email válido.' })
  email: string;

  @IsObject()
  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;

  @IsNotEmpty({ message: 'El role es obligatorio.' })
  @IsString({ message: 'El role debe ser una cadena de texto.' })
  role: string;
}

