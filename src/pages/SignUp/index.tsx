import { Box, Container, PasswordInput, Text, TextInput, Title } from '@mantine/core';
import { useMutation } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { signup as signupApi } from '../../api/services/auth';
import { PrimaryButton, TextButton } from '../../components/Buttons/Buttons';
import { PageHeader } from '../../components/PageHeader';
import PasswordField from '../../components/PasswordField';
import { APP_CONFIG } from '../../utils/constants';
import { EMAIL_REGEX, PASSWORD_REGEX } from '../../utils/validators';
import { useContext } from 'react';
import { AuthenticationContext } from '../../contexts/Authentication';


type SignUpReq = {
  firstname: string,
  lastname: string,
  email: string,
  password: string,
  company: string,
  department: string,
}

const SignUpPage = () => {
  const navigate = useNavigate();
  const { userRegister } = useContext(AuthenticationContext)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpReq>({
    defaultValues: {
      firstname: '',
      lastname: '',
      email: '',
      password: '',
      company: 'Sample Company',
      department: 'Sample Department'
    },
  });

  const handleSignup = async (data) => {
    await userRegister(data.email, data.password, data.firstname, data.lastname, data.company, data.department)
    navigate('/sign-up')
  }

  return (
    <Container
      style={{
        display: 'flex',
        flexDirection: 'column',
        paddingTop: 16,
        paddingBottom: 16,
        height: '100vh',
      }}
    >
      <PageHeader previousPage="/login" />
      <Box
        component="form"
        display="flex"
        onSubmit={handleSubmit(handleSignup)}
        style={{
          justifyContent: 'space-between',
          height: '100%',
          flexDirection: 'column',
        }}
      >
        <Box>
          <Box style={{ paddingTop: 12, paddingBottom: 12, marginBottom: 16 }}>
            <Title order={1}>Welcome!</Title>
            <Text>Create your account</Text>
          </Box>

          <TextInput
            placeholder="Email Address"
            style={{ marginBottom: 16 }}
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: EMAIL_REGEX,
                message: 'Invalid email address',
              },
            })}
            error={errors.email?.message}
          />

          <TextInput
            placeholder="First Name"
            style={{ marginBottom: 16 }}
            {...register('firstname', {
              required: 'First name is required',
            })}
            error={errors.firstname?.message}
          />

          <TextInput
            placeholder="Last Name"
            style={{ marginBottom: 16 }}
            {...register('lastname', {
              required: 'Last name is required',
            })}
            error={errors.lastname?.message}
          />

          <PasswordInput
            placeholder="Password"
            style={{ marginBottom: 24 }}
            {...register('password', {
              required: 'Password is required',
            })}
            error={errors.password?.message}
          />

        </Box>
        <Box>
          <PrimaryButton
            type="submit"
            style={{ width: '100%', marginBottom: 16 }}
          >
            Sign up
          </PrimaryButton>
          <Box component={Link} to="/sign-in" style={{ width: '100%' }}>
            <TextButton style={{ width: '100%' }}>
              Already have an account?
            </TextButton>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default SignUpPage;
