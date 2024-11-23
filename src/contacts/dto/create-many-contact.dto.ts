import {
  IsString,
  IsNotEmpty,
  ValidateNested,
  IsObject,
} from 'class-validator';

export class CreateManyContactDto {
  @IsNotEmpty({ message: 'El nombre es obligatorio.' })
  @IsString({ message: 'El nombre debe ser una cadena de texto.' })
  name: string;

  @IsNotEmpty({ message: 'El teléfono es obligatorio.' })
  phone: string;

  @IsObject()
  @ValidateNested()
  address: string;

  @IsNotEmpty({ message: 'El nombre es obligatorio.' })
  @IsString({ message: 'El nombre debe ser una cadena de texto.' })
  role: string;
}
