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
import axios from 'axios';

type SignUpReq = {
  firstname: string,
  lastname: string,
  email: string,
  password: string,
  company: string,
  department: string,
  role: string
}

const SignUpPage = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<SignUpReq>({
    defaultValues: {
      firstname: new URLSearchParams(location.search).get('firstName') || "",
      lastname: new URLSearchParams(location.search).get('lastName') || "",
      email: new URLSearchParams(location.search).get('email') || "",
      password: '',
      company: new URLSearchParams(location.search).get('company') || "",
      department: new URLSearchParams(location.search).get('department') || "",
      role: new URLSearchParams(location.search).get("role") || ""
    },
  });



  const handleSignup = async (data: any) => {
    let userCredential; // Will hold our created user so we can delete if needed
    try {
      // 1. Create the Firebase user
      userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const token = await userCredential.user.getIdToken();
      localStorage.setItem('CLIENT_TOKEN', token);
      const userId = userCredential.user.uid;

      // 2. Prepare payloads for extra data and custom claims
      const payload = {
        email: data.email,
        firstName: data.firstname,
        lastName: data.lastname,
        company: data.company,
        department: data.department,
        role: data.role,
      };
      const customClaimPayload = {
        company: data.company,
        role: data.role,
        uid: userId,
      };

      // 3. Set custom claims via your API
      const claimsResponse = await axios.post('https://admin-api-zeta-eight.vercel.app/api/registerUser', customClaimPayload);
      if (claimsResponse.status !== 200) {
        throw new Error('Failed to set custom claims');
      }

      // 4. Register the employee details via your API
      const registerResponse = await api.post('/api/employee/register', payload);
      if (registerResponse.status !== 200) {
        throw new Error('Employee registration failed');
      }

      // All steps succeeded: you could now navigate to sign in or show success.
      // navigate('/sign-in');
    } catch (error: any) {
      // If we have already created a Firebase user, remove it to rollback
      if (userCredential) {
        try {
          await userCredential.user.delete();
          console.log('Rolled back user creation due to an error.');
        } catch (deleteError) {
          console.error('Failed to rollback user creation:', deleteError);
        }
      }

      // Handle known Firebase Auth errors to show user-friendly messages
      if (error?.code === 'auth/email-already-in-use') {
        setError('email', {
          type: 'manual',
          message: 'Email already in use!',
        });
      } else if (error?.code === 'auth/weak-password') {
        setError('password', {
          type: 'manual',
          message: 'Password too weak!',
        });
      } else {
        console.error('Signup error:', error);
      }
    }
  };






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
