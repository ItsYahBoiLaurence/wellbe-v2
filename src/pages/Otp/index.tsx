// import { Container, Input, Text } from "@mantine/core";

// export default function PasswordReset() {
//   return (
//     <Container
//       maw={{ base: '100%', md: '768px' }}
//       w={'768px'}
//       p={'md'}
//       mx={'auto'}
//       h={'90vh'}
//     >
//       <Text>Password Reset</Text>
//       <Input />
//     </Container>
//   )
// }


import { IconCheck, IconX } from '@tabler/icons-react';
import { Box, Button, Center, Container, Group, Modal, PasswordInput, Progress, Stack, Text, Title } from '@mantine/core';
import { PageHeader } from '../../components/PageHeader';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import api from '../../api/api';
import { useDisclosure } from '@mantine/hooks';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';

function PasswordRequirement({ meets, label }: { meets: boolean; label: string }) {
  return (
    <Text component="div" c={meets ? 'teal' : 'red'} mt={5} size="sm">
      <Center inline>
        {meets ? <IconCheck size={14} stroke={1.5} /> : <IconX size={14} stroke={1.5} />}
        <Box ml={7}>{label}</Box>
      </Center>
    </Text>
  );
}

const requirements = [
  { re: /[0-9]/, label: 'Includes number' },
  { re: /[a-z]/, label: 'Includes lowercase letter' },
  { re: /[A-Z]/, label: 'Includes uppercase letter' },
  { re: /[$&+,:;=?@#|'<>.^*()%!-]/, label: 'Includes special symbol' },
];

function getStrength(password: string) {
  let multiplier = password.length > 5 ? 0 : 1;

  requirements.forEach((requirement) => {
    if (!requirement.re.test(password)) {
      multiplier += 1;
    }
  });

  return Math.max(100 - (100 / (requirements.length + 1)) * multiplier, 0);
}

export default function PasswordStrength() {


  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const encodedEmail = searchParams.get('data')

  const email = encodedEmail ? atob(encodedEmail) : ""

  const { register, handleSubmit, watch, formState: { isSubmitting, isSubmitSuccessful }, reset } = useForm({

    defaultValues: {
      email: email,
      password: ""
    }
  })

  const [opened, { open, close }] = useDisclosure(isSubmitSuccessful);


  const value = watch('password')
  const strength = getStrength(value);
  const checks = requirements.map((requirement, index) => (
    <PasswordRequirement key={index} label={requirement.label} meets={requirement.re.test(value)} />
  ));

  const onsubmit = async (data) => {
    try {
      await api.post('/user/change-password', data)
      reset()
      open()
    } catch (error) {
      console.log(error)
      notifications.show({
        position: 'bottom-right',
        color: 'red',
        title: 'Error occured',
        message: 'Something went wrong!',
      })
    }
  }

  const bars = Array(4)
    .fill(0)
    .map((_, index) => (
      <Progress
        styles={{ section: { transitionDuration: '0ms' } }}
        value={
          value.length > 0 && index === 0 ? 100 : strength >= ((index + 1) / 4) * 100 ? 100 : 0
        }
        key={index}
        size={4}
      />
    ));

  return (
    <>
      <Modal opened={opened} onClose={close} centered>
        <Stack pb={'md'}>
          <Stack gap={0} align="center" c={'teal'}>
            <IconCheck size={'80px'} />
            <Text fw={700}>Success!</Text>
          </Stack>
          <Text ta={'center'}>Your password has been updated! You can now use your new password the next time you log in. For your security, make sure not to share it with anyone.</Text>
          <Button color='violet' onClick={() => navigate('/')}>Got it!</Button>
        </Stack>
      </Modal>
      <Container
        maw={{ base: '100%', md: '768px' }}
        w={'768px'}
        p={'md'}
        mx={'auto'}
        h={'100vh'}
      >
        <Stack gap={'lg'} >
          <PageHeader previousPage="/get-started" />
          <Stack gap="sm">
            <Title order={2}>Change your Password.</Title>
            <Text>For your account's security, please enter your current password and choose a new one. Make sure your new password is strong.</Text>
          </Stack>
          <form onSubmit={handleSubmit(onsubmit)}>
            <Stack align='end'>
              <PasswordInput
                {...register('password', {
                  required: true
                })}
                placeholder="Your password"
                label="Password"
                required
                w={'100%'}
              />
              <Box w={'100%'}>
                <Group gap={5} grow mt="xs" mb="md">
                  {bars}
                </Group>
                <PasswordRequirement label="Has at least 6 characters" meets={value.length > 5} />
                {checks}
              </Box>
              <Button color='violet' size='xl' style={{ borderRadius: '8px' }} loading={isSubmitting} type='submit' disabled={strength === 100 ? false : true}>Reset Password</Button>
            </Stack>
          </form>
        </Stack>
      </Container>
    </>
  );
}