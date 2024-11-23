import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class CreateContactDto {
  @IsNotEmpty({ message: 'El nombre es obligatorio.' })
  @IsString({ message: 'El nombre debe ser una cadena de texto.' })
  name: string;

  @IsNotEmpty({ message: 'El teléfono es obligatorio.' })
  phone: string;

  @IsNotEmpty({ message: 'El correo electrónico es obligatorio.' })
  @IsEmail({}, { message: 'El correo electrónico debe ser un email válido.' })
  email: string;

  @IsNotEmpty({ message: 'El role es obligatorio.' })
  @IsString({ message: 'El role debe ser una cadena de texto' })
  role: string;

  @IsNotEmpty({ message: 'La dirección es obligatoria.' })
  address: string;
}
