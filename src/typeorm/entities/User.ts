import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from './Role';
import { Task } from './Task';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: false })
  username: string;

  @Column({ nullable: false })
  password: string;

  @ManyToOne(() => Role)
  userRole: Role;

  @OneToMany(() => Task, (task) => task.userId)
  tasks: Task[];
}
