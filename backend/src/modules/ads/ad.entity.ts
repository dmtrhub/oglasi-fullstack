import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { AdCategory } from './enums/ad-category.enum';

@Entity('ads')
export class Ad {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  imageUrl: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({
    type: 'enum',
    enum: AdCategory,
    default: AdCategory.OTHER,
  })
  category: AdCategory;

  @ManyToOne(() => User, (user) => user.ads, { eager: true }) // auto loading users
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  city: string;

  @CreateDateColumn()
  createdAt: Date;
}
