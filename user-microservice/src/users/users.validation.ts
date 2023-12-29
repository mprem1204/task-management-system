import * as yup from 'yup';

export const createUserSchema = yup.object({
  username: yup.string().required(),
  email: yup.string().email().required(),
  type: yup.string().oneOf(['default', 'admin']).required(),
});

