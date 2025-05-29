import { Box, Button, Container, Grid, Stack, Text, Title } from '@mantine/core';
import { IconChevronLeft } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import GetStartedOverlay from '../../assets/getstarted-gradient-overlay.png';
import { PrimaryIconButton } from '../../components/IconButton';
import { PageHeader } from '../../components/PageHeader';
import BG from '../../assets/start_journey.png'


enum SurveyStatus {
    START = 'survey-start',
    IN_PROGRESS = 'survey-in-progress',
    COMPLETED = 'survey-complete',
}

type Props = {
    changeStateFunction: (status: SurveyStatus) => void;
    status: SurveyStatus;
};

const SurveyStartPage = ({ changeStateFunction }: Props) => {
    const handleSubmit = () => {
        changeStateFunction(SurveyStatus.IN_PROGRESS);
    };

    return (
        <Box style={{ height: '100%' }}>
            <Box
                style={{
                    width: '100%',
                    height: 350,
                    backgroundImage: `url(${BG})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    position: 'relative',
                }}
            >
                <Container>
                    <PageHeader
                        style={{ paddingTop: 24 }}
                        actionButton={
                            <Link to="/">
                                <PrimaryIconButton>
                                    <IconChevronLeft />
                                </PrimaryIconButton>
                            </Link>
                        }
                    />
                </Container>
                <Box
                    component="img"
                    src={GetStartedOverlay}
                    style={{
                        width: '100%',
                        height: '100%',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                    }}
                />
            </Box>
            <Container
                style={(t) => ({
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    paddingTop: 32,
                    paddingBottom: 32,
                    borderBottom: `1px solid ${t.colors.gray[2]}`,
                })}
            >
                <Stack
                    gap={0}
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '100%',
                        paddingBottom: 32,
                    }}
                >
                    <Title
                        order={2}
                        style={{
                            fontWeight: 500,
                            marginBottom: 32,
                            textAlign: 'center',
                        }}
                    >
                        Start Your Well-being Journey with us.
                    </Title>
                    <Text style={{ marginBottom: 32, textAlign: 'center' }}>
                        Make sure that you are in peace while answering some of our question.
                    </Text>
                    <Grid style={{ width: '100%' }}>
                        <Grid.Col span={6}>
                            <Text style={{ textAlign: 'center', fontWeight: 700 }}>
                                5 Questions
                            </Text>
                            <Text style={{ textAlign: 'center' }}>Questions</Text>
                        </Grid.Col>
                        <Grid.Col span={6}>
                            <Text style={{ textAlign: 'center', fontWeight: 700 }}>
                                Less than 5 mins
                            </Text>
                            <Text style={{ textAlign: 'center' }}>Duration</Text>
                        </Grid.Col>
                    </Grid>
                </Stack>
            </Container>
            <Box
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    zIndex: 50,
                    paddingTop: 32,
                    paddingBottom: 32,
                }}
            >
                <Button onClick={handleSubmit} size='xl'><Text size='xs'>Ready? Let's Start</Text></Button>
            </Box>
        </Box>
    );
};

export default SurveyStartPage;
