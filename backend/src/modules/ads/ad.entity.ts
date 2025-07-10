import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
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

  @Column('decimal')
  price: number;

  @Column({
  type: 'enum',
  enum: AdCategory,
  })
  category: AdCategory;

  @ManyToOne(() => User, user => user.ads, { eager: true }) // auto loading users
  user: User;

  @Column()
  city: string;

  @CreateDateColumn()
  createdAt: Date;
}


