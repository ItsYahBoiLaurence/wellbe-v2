import { Box, Button, Container, Image, Text, Title } from '@mantine/core';
import SurverCompletedImage from '../../assets/survey-completed-illustration.png';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';

const Description =
  "Keep pushing forward, learning from every stumble, and you'll continually enhance your skills and resilience.";

const Completed = () => {
  const thankYouMessage = `That’s great`;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return (
    <Container
      style={{
        paddingTop: 60,
        display: 'flex',
        flexDirection: 'column',
        paddingBottom: 80,
        height: '100vh',
      }}
    >
      <Box flex={1}>
        <Image src={SurverCompletedImage} height={229} />
        <Title order={2} style={{ marginTop: 14, textAlign: 'center' }}>
          {thankYouMessage}
        </Title>
        <Text style={{ marginTop: 27, maxWidth: 255, textAlign: 'center' }}>
          {Description}
        </Text>
      </Box>
      <Button
        loaderProps={{ type: 'dots' }}
        onClick={() => {
          queryClient.invalidateQueries({ queryKey: ['CHECKIN_STATUS'] });
          queryClient.invalidateQueries({ queryKey: ['check-in-status'] });
          queryClient.invalidateQueries({
            queryKey: ['user-checkin-progress'],
          });
          queryClient.invalidateQueries({ queryKey: ['DATA_CHECK_IN'] });
          navigate('/my-wellbe');
        }}
      >
        Okay!
      </Button>
    </Container>
  );
};

export default Completed;
