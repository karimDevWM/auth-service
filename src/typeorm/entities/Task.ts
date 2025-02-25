import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User';
// import { Item } from './Item';

@Entity({ name: 'tasks' })
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  creationDate: Date;

  @Column({ default: false })
  isCompleted: boolean;

  @Column({ type: 'timestamp', nullable: true })
  completionDate: Date | null;

  @ManyToOne(() => User, (user) => user.tasks)
  userId: User;

  // @OneToMany(() => Item, (item) => item.taskId)
  // items: Item[];
}
