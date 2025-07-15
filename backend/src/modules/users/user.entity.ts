import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Ad } from '../ads/ad.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @CreateDateColumn()
  registeredAt: Date;

  @Column()
  phone: string;

  @OneToMany(() => Ad, (ad) => ad.user)
  ads: Ad[];
}
