import { ActionIcon, Avatar, Badge, Box, Button, Center, Container, Flex, Group, List, Stack, Text } from '@mantine/core';
import GetStartedOverlay from '../../assets/getstarted-gradient-overlay.png';
import { PrimaryButton } from '../../components/Buttons/Buttons';
import { Link, useNavigate } from 'react-router-dom';
import ORANGEBG from '../../assets/forest.jpg'
import { useQuery } from '@tanstack/react-query';
import api from '../../api/api';
import TimeNote from '../../assets/timenote.svg'
import { IconAlertTriangle } from '@tabler/icons-react';
import { IconQuestionMark } from '@tabler/icons-react';
import AppLogo from '../../assets/logo.svg';

interface HomeData {
  check_in_count: number,
  has_pending_questions: boolean,
  is_batch_available: boolean,
  next_check_in_date: string,
  user_finished_the_batch: boolean
  deadline_date: string
}

const CheckInCard = (
  { data }: { data: HomeData }
) => {

  const {
    check_in_count,
    has_pending_questions,
    is_batch_available,
    next_check_in_date,
    user_finished_the_batch,
    deadline_date
  } = data

  const deadlineDate = new Date(deadline_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
  const nextQuickCheck = new Date(next_check_in_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })

  return (
    <>
      {is_batch_available
        ? (
          <>
            <Text>{has_pending_questions ? "Your Quick Check is Ready" : "You're All Caught Up!"}</Text>

            <Box w={'90%'} h={'100%'} style={{ background: 'rgba(255, 255, 255, 0.5)' }} p={'sm'}>
              <Center h={'100%'} style={{ background: 'rgba(255, 255, 255, 0.5)' }} w={'100%'} p={'xl'}>
                <Stack h={'100%'} w={'100%'} align='center' gap={'xl'}>
                  <Stack gap={0} align='center'>
                    <Group justify='center' gap={0}>
                      <Avatar src={TimeNote} radius={'none'} />
                      <Text size='xxl' fw={700}>{check_in_count} of 5</Text>
                    </Group>
                    {has_pending_questions && <Text fw={700}>quick checks are now available</Text>}
                  </Stack>
                  {has_pending_questions
                    ? (
                      <>
                        {check_in_count == 5
                          ? (
                            <Text ta={'center'}>One week left! Finish your 5 Quick Checks <span style={{ fontWeight: 700, textDecoration: 'underline' }}>before {deadlineDate}</span> to build your personal Well-being Snapshot!</Text>
                          )
                          : (
                            <Group grow w={'100%'}>
                              <Box style={{ borderRight: '1px solid black' }}>
                                <Stack gap={0} align='center'>
                                  <Text fw={700}>5 Questions</Text>
                                  <Text>Questions</Text>
                                </Stack>
                              </Box>
                              <Box>
                                <Stack gap={0} align='center'>
                                  <Text fw={700}> Less than 5 mins</Text>
                                  <Text>Duration</Text>
                                </Stack>
                              </Box>
                            </Group>
                          )
                        }
                      </>
                    )
                    : (
                      <>
                        {user_finished_the_batch
                          ? (
                            <>
                              <Text ta={'center'}>You have finished all your quick checks, view your latest <span style={{ fontWeight: 700 }}>Comprehensive Tip.</span></Text>
                            </>
                          )
                          : (
                            <>
                              <Text ta={'center'}>You have finished all your quick checks, your next Quick Check will be <span style={{ fontWeight: 700 }}>available on {nextQuickCheck}.</span></Text>
                            </>
                          )
                        }
                      </>
                    )
                  }
                </Stack>
              </Center>
            </Box>
          </>
        )
        : (
          <Box w={'100%'} h={'100%'}>
            <Center w={'90%'} mx={'auto'} style={{ background: 'rgba(255, 255, 255, 0.5)' }} px={'md'} py="xl">There's no active Snapshot!</Center>
          </Box>
        )
      }
    </>
  )

}

const HomePage = () => {

  const navigate = useNavigate()

  const { data, isError, isLoading } = useQuery<HomeData>({
    queryKey: ['check-in-status'],
    queryFn: async () => {
      const res = await api.get('/check-in')
      return res.data
    },
    refetchOnMount: true
  })

  if (isError) return <Center w={'100%'} h={'100%'}>Error Loading</Center>

  if (isLoading) return <Center w={'100%'} h={'100%'}>Loading...</Center>

  console.log(data)

  const userCheckInStatus = data.has_pending_questions

  console.log(userCheckInStatus)

  return (

    <Box
      style={(t) => ({
        height: '100%',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          width: '100%',
          height: '60%',
          background: `linear-gradient(to bottom, ${t.colors.gray[3]} 0%, ${t.colors.gray[3]} 50%, transparent 100%)`,
        },
      })}
    >

      <Box
        style={{
          width: '100%',
          height: '100%',
          backgroundImage: `url(${ORANGEBG})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >

        <Box w={'100%'} h={'100%'} bg={'linear-gradient(180deg,rgba(225, 230, 233, 1) 15%, rgba(255, 255, 255, 0.2) 100%)'}>
          <Container
            style={{
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              gap: '28px'
            }}
          >
            <Group flex={0.2} justify='center' pos={'relative'}>
              <img src={AppLogo} width={200} />
              <ActionIcon
                onClick={() => navigate('/on-boarding')}
                style={{ width: '12px', height: '12px', borderRadius: '100%', borderBottomLeftRadius: '0', position: 'absolute', top: "50%", right: 0, transform: 'translateY(-50%)' }}
                color={'violet'}
                c={"white"}
              >
                <IconQuestionMark size={12} />
              </ActionIcon>
            </Group>

            <Box flex={0.8} h={'100%'} style={{
              display: 'flex',
              justifyContent: 'space-between',
              flexDirection: 'column',
              paddingBottom: '20px'
            }}>
              <Stack align='center' gap={'xl'}>
                <Text size={'xl'} fw={700}> Your Wellbeing Check-In</Text>
                <CheckInCard data={data} />
              </Stack>

              <Box
                style={{ display: 'flex', justifyContent: 'center', zIndex: 50 }}
              >
                {data.has_pending_questions
                  ? (
                    <>
                      <Link to={`/survey`}>
                        <PrimaryButton px={'xxl'}>Start Wellbeing Check in</PrimaryButton>
                      </Link>
                    </>
                  )
                  : (
                    <>
                      <Link to={`/my-wellbe`}>
                        <Button
                          px={'xxl'}
                          variant={data.user_finished_the_batch ? "filled" : 'white'}
                          color={data.user_finished_the_batch ? "violet" : undefined}
                          c={data.user_finished_the_batch ? "white" : 'violet'}
                        >{data.user_finished_the_batch
                          ? "View your latest Comprehensive Tip"
                          : "Check Your Progress"}</Button>
                      </Link>
                    </>
                  )
                }
              </Box>
            </Box>
          </Container>
        </Box>

        <Box
          component="img"
          src={GetStartedOverlay}
          style={{
            position: 'absolute',
            bottom: 0,
            width: '100%',
            height: '50%',
          }}
        />
      </Box>
    </Box>
  );
};

export default HomePage;
