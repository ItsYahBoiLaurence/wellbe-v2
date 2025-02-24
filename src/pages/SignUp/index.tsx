import { Box, Container, PasswordInput, Text, TextInput, Title } from '@mantine/core';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { PrimaryButton, TextButton } from '../../components/Buttons/Buttons';
import { PageHeader } from '../../components/PageHeader';
import { EMAIL_REGEX } from '../../utils/validators';
import api from '../../api/api';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../api/firebaseServices/firebaseConfig';
import { useLocation } from 'react-router-dom';

type SignUpReq = {
  firstname: string,
  lastname: string,
  email: string,
  password: string,
  company: string,
  department: string,
}

const SignUpPage = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },

  } = useForm<SignUpReq>({
    defaultValues: {
      firstname: new URLSearchParams(location.search).get('firstName') || "",
      lastname: new URLSearchParams(location.search).get('lastName') || "",
      email: new URLSearchParams(location.search).get('email') || "",
      password: '',
      company: new URLSearchParams(location.search).get('company') || "",
      department: new URLSearchParams(location.search).get('department') || ""
    },
  });

  const handleSignup = async (data) => {
    const payload = {
      email: data.email,
      firstName: data.firstname,
      lastName: data.lastname,
      company: data.company,
      department: data.department,
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password)
      if (userCredential) {
        await api.post('/api/employee/register/', payload)
        navigate('/sign-in')
      }
    }
    catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        setError('email', {
          type: 'manual',
          message: 'Email already in use!'
        })
      } else if (error.code === 'auth/weak-password') {
        setError('password', {
          type: 'manual',
          message: 'Password too weak!'
        })
      }
    }
  }

  return (
    <Container
      style={{
        display: 'flex',
        flexDirection: 'column',
        paddingTop: 16,
        paddingBottom: 16,
        height: '100vh',
        width: '90vw'
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
            disabled
          />

          <TextInput
            placeholder="First Name"
            style={{ marginBottom: 16 }}
            {...register('firstname', {
              required: 'First name is required',
            })}
            error={errors.firstname?.message}
            disabled
          />

          <TextInput
            placeholder="Last Name"
            style={{ marginBottom: 16 }}
            {...register('lastname', {
              required: 'Last name is required',
            })}
            error={errors.lastname?.message}
            disabled
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
            disabled={isSubmitting}
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
