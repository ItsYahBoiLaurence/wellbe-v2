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
import { AuthenticationContext } from '../../contexts/Authentication';
import { useContext } from 'react';
import CryptoJS from 'crypto-js'
import { useSearchParams } from 'react-router-dom';


const SignUpPage = () => {

  const decryptData = (ciphertext: string) => {
    try {
      const dataParam = decodeURIComponent(ciphertext)
      const bytes = CryptoJS.AES.decrypt(dataParam, import.meta.env.VITE_JWT_SECRET!);
      const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
      const decryptedData = JSON.parse(decryptedText);
      console.log(decryptedData);

      if (!decryptedText) {
        throw new Error("Decryption failed: resulting text is empty.");
      }

      return JSON.parse(decryptedText);
    } catch (error) {
      console.error("Decryption error:", error);
      return null;
    }
  };

  const authContext = useContext(AuthenticationContext);
  const { userRegister } = authContext;
  const location = useLocation()
  const navigate = useNavigate()
  const params = new URLSearchParams(window.location.search)

  // const data = "U2FsdGVkX1+6gWTjLuj+VIp7/DkQHC1JOrYA37eMF6nviBzvIvgbRWXPB/U52+ZlMeUv8MzpY83wkcQTu36NcukvR246hCZ1Vel/xvAZ3g0nRxc9ZChmNZtaKfC612IEgCrxXg4yJnLa5oT1C+/NA8wDOuEbl2THBsxd29PyGTg9cleoyU4VyrOVATGYJm+GYd3FvPfpgPRBwVDAIDmsDnAE3KMa3VYxeZ6myeRKYbOTSVOO/oHK8SuuuDf3XEN9"
  // const dcrypt = decryptData(data)



  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({
    defaultValues: {
      email: params.get('email'),
      first_name: params.get('firstname'),
      last_name: params.get('lastname'),
      department_name: params.get('department'),
      company: params.get('company'),
      password: '',
    },
  });

  const handleSignup = async (data: any) => {
    console.log(data)
    try {
      await userRegister(data)
      navigate('/')
    } catch (error: any) {
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
            label={<Text>Email</Text>}
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
            label={<Text>First Name</Text>}
            placeholder="First Name"
            style={{ marginBottom: 16 }}
            {...register('first_name', {
              required: 'First name is required',
            })}
            error={errors.first_name?.message}
            disabled
          />

          <TextInput
            label={<Text>Last Name</Text>}
            placeholder="Last Name"
            style={{ marginBottom: 16 }}
            {...register('last_name', {
              required: 'Last name is required',
            })}
            error={errors.last_name?.message}
            disabled
          />

          <PasswordInput
            label={<Text>Password</Text>}
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
