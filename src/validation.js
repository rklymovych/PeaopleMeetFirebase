import * as yup from 'yup';

export const validationSchema = yup.object().shape({
  name: yup.string().required('Name Is Required'),
  age: yup.string().required('Age Is Required'),
  sex: yup.string().required('Sex Is Required'),
  description: yup.string().required('Description Is Required'),
  // email: yup.string().trim().email('Email Address must be a valid email').required('Email Is Required'),
  // role: yup.string().required('Role Is Required'),
  // status: yup.string().required('Status Is Required'),
});