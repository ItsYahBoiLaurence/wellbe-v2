import { Container, Avatar, Text, Box, Stack, Paper, Flex, Modal, Button, Center } from '@mantine/core';
import { useContext, useEffect, useState } from 'react';
import { AuthenticationContext } from '../../contexts/Authentication';
import api from '../../api/api';
import { IconChevronRight } from '@tabler/icons-react';
import { modals } from "@mantine/modals"
import { UserDetials } from '../../types';
import { useQuery } from '@tanstack/react-query';


const ProfileComponent = () => {
  const { logout } = useContext(AuthenticationContext)
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

  const { data, isLoading, isError } = useQuery({
    queryKey: ['UserProfile'],
    queryFn: async () => {
      const res = await api.get('user')
      return res.data
    }
  })

  if (isLoading) return <Center h={'100%'}>Loading data...</Center>
  if (isError) return <Center h={'100%'}>Error Loading...</Center>


  console.log("************************")
  console.log(data)
  console.log("************************")
  return (
    <Stack justify='center' h={'100%'}>
      <Box>
        <Avatar
          size={80}
          radius={120}
          mx="auto"
        >
          {data.first_name[0]}
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
            <Text>{data.first_name}</Text>
          </Flex>
        </Paper>
        <Paper shadow="xs" withBorder p="md">
          <Flex justify={'space-between'}>
            <Text>Last name</Text>
            <Text>{data.last_name}</Text>
          </Flex>
        </Paper>
        <Paper shadow="xs" withBorder p="md">
          <Flex justify={'space-between'}>
            <Text>Email</Text>
            <Text>{data.email}</Text>
          </Flex>
        </Paper>
        <Paper shadow="xs" withBorder p="md">
          <Flex justify={'space-between'}>
            <Text>Company</Text>
            <Text>{data.department.company.name}</Text>
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
  )
}



const ProfilePage = () => {
  return (
    <Box
      maw={{ base: '100%', md: '768px' }}
      w={'768px'}
      p={'md'}
      mx={'auto'}
    >
      <ProfileComponent />
    </Box>
  );
};

export default ProfilePage;


