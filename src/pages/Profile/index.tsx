import { Container, Avatar, Text, Box, Stack, Paper, Flex, Modal, Button, Center } from '@mantine/core';
import { useContext, useEffect, useState } from 'react';
import { AuthenticationContext } from '../../contexts/Authentication';
import api from '../../api/api';
import { IconChevronRight } from '@tabler/icons-react';
import { modals } from "@mantine/modals"
import { UserDetials } from '../../types';




const ProfilePage = () => {

  const { logout } = useContext(AuthenticationContext)

  const [userProfile, setUserProfile] = useState<UserDetials>()
  const getUser = async () => {
    try {
      const user_details = await api.get('user')
      console.log(user_details.data)
      setUserProfile(user_details.data)
    } catch (error) {
      console.log(error)
    }
  }

  const openModal = () =>
    modals.openConfirmModal({
      title: 'Logout Confirmation',
      centered: true,
      children: (
        <Text size="md">
          Are you sure you want to logout?
        </Text>
      ),
      labels: { confirm: 'Confirm', cancel: "Cancel" },
      confirmProps: { color: 'red' },
      onCancel: () => { },
      onConfirm: () => logout(),
    });

  useEffect(() => {
    getUser()
  }, [])

  return (
    <Box
      maw={{ base: '100%', md: '768px' }}
      w={'768px'}
      p={'md'}
      mx={'auto'}
    >
      <Stack justify='center' h={'100%'}>
        <Box>
          <Avatar
            size={80}
            radius={120}
            mx="auto"
          >
            {userProfile?.first_name[0]}
          </Avatar>
          <Text ta="center" fw={500} mt="md">
            User Profile
          </Text>
        </Box>
        <Stack
        >
          <Paper withBorder p="md">
            <Flex justify={'space-between'}>
              <Text>First name</Text>
              <Text>{userProfile?.first_name}</Text>
            </Flex>
          </Paper>
          <Paper shadow="xs" withBorder p="md">
            <Flex justify={'space-between'}>
              <Text>Last name</Text>
              <Text>{userProfile?.last_name}</Text>
            </Flex>
          </Paper>
          <Paper shadow="xs" withBorder p="md">
            <Flex justify={'space-between'}>
              <Text>Email</Text>
              <Text>{userProfile?.email}</Text>
            </Flex>
          </Paper>
          <Paper shadow="xs" withBorder p="md">
            <Flex justify={'space-between'}>
              <Text>Company</Text>
              <Text>{userProfile?.department.company.name}</Text>
            </Flex>
          </Paper>
          <Paper shadow="xs" withBorder p="md" onClick={openModal} style={{ cursor: 'pointer' }}>
            <Flex justify={'space-between'} align={'center'}>
              <Text>Logout</Text>
              <Text style={{ paddingTop: 5 }}><IconChevronRight /></Text>
            </Flex>
          </Paper>
        </Stack>
      </Stack>
    </Box>
  );
};

export default ProfilePage;


