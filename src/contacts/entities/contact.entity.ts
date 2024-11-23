import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('contacts')
export class Contact {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.Contact, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  name: string;

  @Column()
  phone: string;

  @Column()
  email: string;

  @Column({ type: 'json' })
  address: {
    latitude: string;
    longitude: string;
    latitudeDelta: string;
    longitudeDelta: string;
  };

  @Column()
  role: string;

  @Column()
  image: string;
}
