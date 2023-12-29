// import { Table, Column, Model, DataType } from 'sequelize-typescript';

// @Table
// export class Task extends Model<Task> {
//   @Column({
//     type: DataType.STRING,
//     allowNull: false,
//   })
//   title: string;

//   @Column({
//     type: DataType.STRING,
//     allowNull: false,
//   })
//   description: string;

//   @Column({
//     type: DataType.NUMBER,
//     allowNull: false,
//   })
//   priority: number;

//   @Column({
//     type: DataType.DATE,
//     allowNull: false,
//   })
//   dueDate: Date;

//   @Column({
//     type: DataType.BOOLEAN,
//     allowNull: false,
//   })
//   completed: boolean;

//   @Column({
//     type: DataType.INTEGER,
//     allowNull: false,
//     defaultValue: false
//   })
//   userId: number;

// }


import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table
export class Task extends Model<Task> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  description: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  priority: number;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  dueDate: Date;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  completed: boolean;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: false
  })
  userId: number;
}
