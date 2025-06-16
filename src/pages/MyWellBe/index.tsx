import {
  Box,
  BoxProps,
  Container,
  ElementProps,
  Image,
  Text,
  Title,
  RingProgress,
  Flex,
  Button,
  Stack,
  LoadingOverlay,
  SimpleGrid,
  Avatar,
  Center,
  Group,
  List,
} from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';
import api from '../../api/api';
import MyWellBeIllustration from '../../assets/vector.jpg';
import Decreased from '../../assets/low.svg'
import Increased from '../../assets/high.svg'
import Maintained from '../../assets/mid.svg'
import { IconHeartHandshake, IconCheck } from '@tabler/icons-react';
import { Link, useNavigate } from 'react-router-dom';

type CardProps = BoxProps & ElementProps<'div', keyof BoxProps>;

export const Card = (props: CardProps) => (
  <Box
    {...props}
    style={[
      {
        width: '100%',
        backgroundColor: '#f2f7fe',
        padding: '38px 24px',
        borderRadius: 14,
      },
      props.style,
    ]}
  />
);

const CheckInStatus = ({ onClick, disabled }: { onClick: () => {}, disabled: boolean }) => {
  const navigate = useNavigate()
  const { data, isLoading, isError } = useQuery({
    queryKey: ['CHECKIN_STATUS'],
    queryFn: async () => {
      const res = await api.get('check-in')
      return res.data
    }
  })

  if (isError) return <>Error...</>
  if (isLoading) return <>Loading...</>

  console.log(data)

  return (
    <Stack>
      {data.has_pending_questions
        ? <Link to={`/survey`}>
          <Button color='#6B4EFF' px={'lg'}>Proceed to next Quick Check</Button>
        </Link>
        : (
          <Flex direction={'row'} align={'center'} gap={'md'} p={'md'} bg={'#E6F4EA'} style={{ borderRadius: '8px' }}>
            <Avatar flex={.1} bg='green' color='white'><IconCheck /></Avatar>
            <Text flex={.9}>You're all caught up. Great job on prioritizing your well-being!</Text>
          </Flex>
        )
      }

      {data.user_finished_the_batch
        ? <Button px={'56px'} color='violet' onClick={onClick}>View My Wellbeing</Button>
        : (
          <Button variant='white' fullWidth c={'violet'} onClick={() => navigate('/survey')}>Check Your Progress</Button>
        )
      }
    </Stack>
  )
}

const Format = ({ children }: { children: ReactNode }) => {
  return (
    <Container
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: 16,
        paddingBottom: 80,
        overflowY: 'auto',
      }}
    >
      <Image src={MyWellBeIllustration} height={254} mt={24} />
      {children}
    </Container>
  )
}

const Progress = ({ refetch }) => {
  const [loading, setLoading] = useState(false)
  const { data: userProgress, isLoading: isFetchingProgress, isError: noProgressData } = useQuery({
    queryKey: ['batch-status'],
    queryFn: async () => {
      const res = await api.get('/tip/progress')
      return res.data
    },
    staleTime: 0,
    refetchOnMount: true
  })


  if (isFetchingProgress) return <>Loading...</>

  if (noProgressData) return <Text ta={'center'}>No Data Progress</Text>

  console.log(userProgress)

  const { set_participation, is_completed }: { set_participation: [], is_completed: boolean } = userProgress
  console.log(set_participation)
  console.log(is_completed)

  const user_progress = set_participation.reduce((sum, v) => sum + (v ? 1 : 0), 0);

  console.log(user_progress)

  const label = user_progress !== 5 ? `Complete ${5 - user_progress} more sets to reveal your comprehensive insights! ` : "You’re all set! Tap View Results to see your comprehensive insights! "


  const generateWellbeing = async () => {
    try {
      setLoading(true)
      await api.get('wellbeing/generate')
      await api.get('tip/holistic/generate')
      refetch()
      setLoading(false)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Flex direction={'column'} gap={'lg'} align={'center'} >
      <LoadingOverlay
        visible={loading}
        zIndex={1000}
        overlayProps={{ radius: 'sm', blur: 20 }}
        loaderProps={{ color: '#6E51FF', type: 'bars' }}
      />
      <RingProgress
        style={{
          alignSelf: 'center'
        }}
        size={130}
        thickness={10}
        label={
          <Text size="xl" ta="center" px="xs" style={{ pointerEvents: 'none' }}>
            {user_progress}/5
          </Text>
        }
        roundCaps
        sections={[
          { value: user_progress * 20, color: '#6B4EFF' },
        ]}
      />
      <Text ta={'center'}>{label}</Text>

      <Stack align='center'>
        <CheckInStatus disabled={!is_completed} onClick={generateWellbeing} />
      </Stack>
    </Flex>
  )

}
const Tip = () => {
  const { data: tipSet, isLoading: isfetchingTip, isError: noTip } = useQuery({
    queryKey: ['tip'],
    queryFn: async () => {
      const res = await api.get('/tip/latest')
      console.log(res.data)
      const user = await api.get('user')
      console.log(user.data)
      return {
        ...res.data,
        ...user.data
      }
    },
    refetchOnMount: 'always'
  })

  if (isfetchingTip) {
    return <>fetching tip...</>
  }

  if (noTip) {
    return <Card p={'md'} ><Text ta={'center'}>Start answering questions to get daily Tips!</Text></Card>
  }
  console.log("=======")
  console.log(tipSet.first_name)
  console.log("=======")

  return (
    <>
      <Stack align='center'>
        <Text size='24px' fw={700} >Great job {tipSet.first_name}!</Text>
        <Text>Here’s your Wellbe result for today</Text>
      </Stack>
      <Box style={{ borderRadius: 14, background: "linear-gradient(to right, rgba(0, 0, 200, 0.1), rgba(200, 0, 0, 0.1))" }} p='lg'>
        <Stack>
          <Group>
            <IconHeartHandshake />
            <Text size='24px' fw={700}>WellbeTips</Text>
          </Group>

          <Text>{tipSet.tip}</Text>
        </Stack>
      </Box>
    </>

  )
}


const Domain = ({ label, score }) => {
  const Image = score >= 1 && score <= 22 ? Decreased : score >= 23 && score <= 76 ? Increased : score >= 77 && score <= 100 ? Maintained : "NA"
  return (
    <Center>
      <Box w={'100%'}>
        <Stack justify='start' gap={'sm'} >
          <Avatar src={Image} size={'lg'} radius={'none'}>
            {Image}
          </Avatar>
          <Text>{label}</Text>
          <Text size={'xl'} fw={700}>{score}%</Text>
        </Stack>
      </Box>
    </Center >
  )
}

const Wellbeing = () => {
  const { data: wellbeing, isError: noWellbeingData, isLoading: fetchingWellbeing } = useQuery({
    queryKey: ['user_wellbeing'],
    queryFn: async () => {
      const res = await api.get('wellbeing')
      return res.data
    }
  })

  if (fetchingWellbeing) return <>fetching...</>

  if (noWellbeingData) return <Text ta={'center'}>No data!</Text>

  return (
    <SimpleGrid cols={2} spacing={'lg'}>
      <Domain label={'Character'} score={wellbeing.character} />
      <Domain label={'Career'} score={wellbeing.career} />
      <Domain label={'Contentment'} score={wellbeing.contentment} />
      <Domain label={'Connectedness'} score={wellbeing.connectedness} />
    </SimpleGrid>
  )
}


const MyWellBePage = () => {
  const { data: holisticTip, isLoading: isFetchingHolistic, isError: noHolisticTip, refetch: refetchHolistic } = useQuery({
    queryKey: ['holistic-tip'],
    queryFn: async () => {
      const res = await api.get('/tip/holistic')
      return res.data
    }
  })

  if (isFetchingHolistic) {
    console.log('Fetching...')
    return <>Fetching...</>
  }

  if (noHolisticTip) {
    return (
      <Format>
        <Stack my="md">
          <Tip />
          <Card>
            <Progress refetch={refetchHolistic} />
          </Card>
        </Stack>
      </Format >
    )
  }
  return (
    <Format>
      <Stack gap="md" my={'md'}>
        <Box style={{ borderRadius: 14, background: "linear-gradient(to right, rgba(0, 0, 200, 0.1), rgba(200, 0, 0, 0.1))" }} p='md'>
          <Stack>
            <Text ta={'center'} size='20px' fw={700}>🌱 Your Holistic Tip for the Week:</Text>
            <Text>{holisticTip.advice}</Text>
          </Stack>
        </Box>
        <Box px={'38px'} py="24px" w='100%'>
          <Wellbeing />
        </Box>
      </Stack>
    </Format>
  );
};

export default MyWellBePage;
