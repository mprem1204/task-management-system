
import * as yup from 'yup';

export const createTaskSchema = yup.object({
  title: yup.string().required(),
  description: yup.string().required(),
  priority: yup.string().required(),
  dueDate: yup.date().required(),
  userId: yup.number().required(),
});

export const editTaskSchema = yup.object({
  title: yup.string(),
  description: yup.string(),
  priority: yup.string(),
  dueDate: yup.date(),
});
