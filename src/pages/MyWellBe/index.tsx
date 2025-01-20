import {
  Box,
  BoxProps,
  Container,
  ElementProps,
  Image,
  Skeleton,
  Text,
  Title,
  RingProgress,
  Flex,
  Paper,
  Overlay,
  Button,
  Center
} from '@mantine/core';
import { BarChart } from '@mantine/charts';
import { DomainResult, OverlayResult } from '../../components/DataVisualization/DataVisualization';
import MyWellBeIllustration from '../../assets/my-wellbe-illustration.png';
import { OutlineButton, PrimaryButton } from '../../components/Buttons/Buttons';
import CalendarTodayIcon from '../../components/icons/CalendarTodayIcon';
import ThumbDownIcon from '../../components/icons/ThumbDownIcon';
import ThumbUpIcon from '../../components/icons/ThumbUpIcon';

import { useContext, useEffect, useState } from 'react';
import api from '../../api/api';
import { AuthenticationContext } from '../../contexts/Authentication'

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

interface AdviceMessage {
  dateGenerate: string;
  advise: string;
  feedback: string;
}

interface ResponseMessage {
  adviceMessage: AdviceMessage;
}

const MyWellBePage = () => {
  const authContext = useContext(AuthenticationContext);

  if (!authContext) {
    throw new Error("AuthenticationContext must be used within its provider.");
  }

  const { user } = authContext;
  const [tip, setTip] = useState<string>("");

  const company: string = "Sample Company";

  const [visible, setVisible] = useState(true);
  const [completed, setCompleted] = useState(false)
  const [sessionNumber, setSessionNumber] = useState(0)

  const getSession = async () => {
    try {
      const params = {
        email: user?.email,
        company: company
      }
      const response = await api.get('/api/engine/latestSession', { params })
      if (response.status === 200) {
        setSessionNumber(response.data.statusCurrentSession)
        return response.data.statusCurrentSession
      }
    } catch (error) {
      console.log(error)
    }
  }

  const isSessionCompleted = async () => {
    const sessionNumber = await getSession()
    const session = sessionNumber === 5 ? false : true
    setCompleted(session)
  }


  useEffect(() => {
    const getLatestAdvice = async (email: string, company: string): Promise<void> => {
      try {
        // Prepare the email and company values to be passed as query parameters
        const response = await api.get<ResponseMessage>("/api/engine/latestAdvise", {
          params: { email, company },  // Send email and company as query params
        });

        // Extract the advice text from the response and set it in the state
        const adviceText = response.data.message.advise || "No advice available.";
        setTip(adviceText);  // Update the state with the advice
      } catch (error) {
        console.error("Error fetching advice:", error);
        setTip("Error fetching advice.");  // Optionally set a fallback message
      }
    };
    // Check if user email is available before making the request
    if (user?.email) {
      getLatestAdvice(user.email, company);
    }
    isSessionCompleted();
  }, [user?.email, company]); // Re-run the effect when user email or company changes



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
      <Box
        style={(t) => ({
          display: 'flex',
          gap: 8,
          backgroundColor: t.colors.primary[4],
          color: t.white,
          borderRadius: 48,
          padding: '12px 24px',
          width: 'fit-content',
        })}
      >
        <CalendarTodayIcon />
        <Text>Today</Text>
      </Box>
      <Image src={MyWellBeIllustration} height={254} mt={24} />
      <Title order={2} mt={32} style={{ textAlign: 'center' }}>
        {/* {greetingMessage} */}
        Hello there!
      </Title>
      <Text mt={16}>Here’s your Wellbe result for today</Text>
      <Card mt={24}>
        <Text>
          {tip ? tip : (
            <>
              <Skeleton height={8} mt={6} radius="xl" width={'20%'} />
              <Skeleton height={8} mt={6} radius="xl" />
              <Skeleton height={8} mt={6} radius="xl" />
              <Skeleton height={8} mt={6} width={'60%'} radius="xl" />
              <Skeleton height={8} mt={6} width={'80%'} radius="xl" />
              <Skeleton height={8} mt={6} radius="xl" />
              <Skeleton height={8} mt={6} radius="xl" />
              <Skeleton height={8} mt={6} width={'70%'} radius="xl" />
              <Skeleton height={8} mt={6} radius="xl" />
              <Skeleton height={8} mt={6} radius="xl" />
              <Skeleton height={8} mt={6} radius="xl" />

            </>
          )}
        </Text>
      </Card>

      <Card
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: 20,
        }}
      >
        <Text style={{ maxWidth: 115 }}>How do you like your results?</Text>
        <Box style={{ display: 'flex', gap: 13 }}>
          <PrimaryButton
            style={{ borderRadius: '50%', width: 48, height: 48, padding: 0 }}
          >
            <ThumbUpIcon />
          </PrimaryButton>
          <OutlineButton
            style={{ borderRadius: '50%', width: 48, height: 48, padding: 0 }}
          >
            <ThumbDownIcon />
          </OutlineButton>
        </Box>
      </Card>

      <Card mt={20}>
        <Title order={3}>Wellbe Consultants</Title>
        <Text mt={22}>
          For well-being planning and advice, our friends at Positive Workplace
          are more than willing to share their expertise.
        </Text>
        <PrimaryButton mt={43}>
          <Text>Schedule a Call</Text>
        </PrimaryButton>
      </Card>
      <Flex pos={'relative'} w={'100%'} h={"100%"} direction={'column'} p={'xl'} mt={32} style={{ backgroundColor: '#f2f7fe' }}>
        {completed && (
          <OverlayResult>
            <RingProgress
              style={{
                alignSelf: 'center'
              }}
              size={130}
              thickness={10}
              label={
                <Text size="xl" ta="center" px="xs" style={{ pointerEvents: 'none' }}>
                  {sessionNumber}/5
                </Text>
              }
              roundCaps
              sections={[
                { value: sessionNumber * 20, color: '#6B4EFF' },
              ]}
            />
            <Text ta={'center'}>Complete {5 - sessionNumber} more surveys to reveal your insights!</Text>
            <PrimaryButton onClick={() => setVisible((v) => !v)} mt={43} ta={'center'} disabled={completed}>
              <Text>View Result</Text>
            </PrimaryButton>
          </OverlayResult>
        )}

        <DomainResult sessionCount={5} />
      </Flex>
    </Container >
  );
};

export default MyWellBePage;
