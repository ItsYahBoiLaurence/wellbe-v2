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
  Paper
} from '@mantine/core';
import { OutlineButton, PrimaryButton } from '../../components/Buttons/Buttons';
import { useQuery } from '@tanstack/react-query';
import { ReactNode, useEffect, useState } from 'react';
import api from '../../api/api';
import ThumbDownIcon from '../../components/icons/ThumbDownIcon';
import ThumbUpIcon from '../../components/icons/ThumbUpIcon';
import MyWellBeIllustration from '../../assets/my-wellbe-illustration.png';
import queryClient from '../../queryClient';
import { useNavigate } from 'react-router-dom';
import Decreased from '../../assets/decrease.png'
import Increased from '../../assets/increase.png'
import Maintained from '../../assets/maintained.png'


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
      <Title order={2} mt={32} style={{ textAlign: 'center' }}>
        Hello there!
      </Title>
      {children}
    </Container>
  )
}

const Progress = ({ refetch }) => {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
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

  if (noProgressData) return <>No Data Progress</>

  console.log(userProgress)

  const { set_participation, is_completed }: { set_participation: [], is_completed: boolean } = userProgress
  console.log(set_participation)
  console.log(is_completed)

  const user_progress = set_participation.reduce((sum, v) => sum + (v ? 1 : 0), 0);

  console.log(user_progress)

  const label = user_progress !== 5 ? `Complete ${5 - user_progress} more surveys to reveal your comprehensive insights! ` : "You’re all set! Tap View Results to see your comprehensive insights! "


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
    <Flex direction={'column'} gap={'lg'} >
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
      <Button color='violet' disabled={!is_completed} onClick={generateWellbeing}>View Result</Button>
    </Flex>
  )

}

const Tip = () => {
  const { data: tipSet, isLoading: isfetchingTip, isError: noTip } = useQuery({
    queryKey: ['tip'],
    queryFn: async () => {
      const res = await api.get('/tip/latest')
      console.log(res.data)
      return res.data
    },
    refetchOnMount: 'always'
  })

  if (isfetchingTip) {
    return <>fetching tip...</>
  }

  if (noTip) {
    return <Card p={'md'} ><Text ta={'center'}>Start answering questions to get daily Tips!</Text></Card>
  }

  return (
    <Card p='md'>
      <Text ta={'center'} fw={700}> </Text>
      <Text>{tipSet.tip}</Text>
    </Card>
  )
}


const Domain = ({ label, score }) => {


  const Image = score >= 1 && score <= 22 ? Decreased : score >= 23 && score <= 76 ? Maintained : score >= 77 && score <= 100 ? Increased : "NA"

  return (
    <Center>
      <Stack>
        <Avatar src={Image} size={'lg'} radius={'none'}>
          {Image}
        </Avatar>
        <Text>{label}</Text>
        <Text>{score}%</Text>
      </Stack>
    </Center>
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
    console.log("No Holistic Tip")
    return (
      <Format>
        <Text mt={16}>Here’s your Wellbe result for today</Text>
        <Stack my="md">
          <Tip />
          <Card>
            <Title order={3}>Wellbe Consultants</Title>
            <Text mt={22}>
              For well-being planning and advice, our friends at Positive Workplace
              are more than willing to share their expertise.
            </Text>
            <PrimaryButton mt={43}>
              <Text>Schedule a Call</Text>
            </PrimaryButton>
          </Card>
          <Card>
            <Progress refetch={refetchHolistic} />
          </Card>
        </Stack>
      </Format >
    )
  }
  return (
    <Format>
      <Stack gap="md">
        <Card>
          <Stack>
            <Text ta={'center'} fw={700}>🌱 Your Holistic Tip for the Week:</Text>

            <Text>{holisticTip.advice}</Text>
          </Stack>
        </Card>
        <Card>
          <Wellbeing />
        </Card>
      </Stack>
    </Format>
  );
};

export default MyWellBePage;
