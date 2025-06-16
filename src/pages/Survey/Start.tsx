import { Avatar, Box, Button, Center, Container, Flex, Grid, Group, Stack, Stepper, Text, Title } from '@mantine/core';
import { IconChevronLeft, IconCircleX } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import GetStartedOverlay from '../../assets/getstarted-gradient-overlay.png';
import { PrimaryIconButton } from '../../components/IconButton';
import { PageHeader } from '../../components/PageHeader';
import BG from '../../assets/start_journey.png'
import { IconPencil, IconCheck, IconLock } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import api from '../../api/api';


enum SurveyStatus {
    START = 'survey-start',
    IN_PROGRESS = 'survey-in-progress',
    COMPLETED = 'survey-complete',
}

type Props = {
    changeStateFunction: (status: SurveyStatus) => void;
    status: SurveyStatus;
};

const UserStatus = ({ onClick }) => {
    const { data, isError, isLoading } = useQuery({
        queryKey: ['DATA_CHECK_IN'],
        queryFn: async () => {
            const res = await api.get('/check-in')
            return res.data
        },
    })

    if (isError) return <Center>Error...</Center>
    if (isLoading) return <Center>Loading...</Center>
    console.log(data)
    return (
        <>
            {data.has_pending_questions ? <Button onClick={onClick} color='#6B4EFF' size='xl'><Text size='xs'>Ready? Let's Start Quick Check</Text></Button> : (
                <Flex maw={{ base: '100%', md: '768px' }}
                    w={'768px'} direction={'row'} align={'center'} gap={'md'} p={'md'} bg={'#E6F4EA'} style={{ borderRadius: '8px' }}>
                    <Avatar flex={.1} bg='green' color='white'><IconCheck /></Avatar>
                    <Text flex={.9}>You're all caught up. Great job on prioritizing your well-being!</Text>
                </Flex>
            )}
        </>
    )
}


const SurveyStartPage = ({ changeStateFunction }: Props) => {
    const handleSubmit = () => {
        changeStateFunction(SurveyStatus.IN_PROGRESS);
    };

    const getCheckInIcon = (current_set, item_id, status) => {
        if (item_id <= current_set) {
            if (status) {
                return <IconCheck style={{ color: 'white' }} />
            }
            return <IconPencil style={{ color: 'white' }} />
        } else {
            return <IconLock style={{ color: 'white' }} />
        }
    }


    const getIconColor = (current_set, item_id, status) => {
        if (item_id <= current_set) {
            if (status) {
                return "#A695FF"
            }
            return "#6B4EFF"
        } else {
            return "#A695FF"
        }
    }

    const getCheckInLabel = (current_set, item_id, status) => {
        if (item_id <= current_set) {
            if (status) {
                return "Done"
            }
            return "Todo"
        } else {
            return "Locked"
        }
    }

    const isCurrent = (current_check_in, id) => {
        if (current_check_in == id) return true
        return false
    }

    const { data, isError, isLoading } = useQuery({
        queryKey: ['user-checkin-progress'],
        queryFn: async () => {
            const res = await api.get('check-in/status')
            return res.data
        }
    })

    if (isError) return <Center>Error Loading...</Center>
    if (isLoading) return <Center>Loading...</Center>

    console.log(data)

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
                maw={{ base: '100%', md: '768px' }}
                w={'768px'}
                style={(t) => ({
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    paddingTop: 16,
                    paddingBottom: 16,
                    borderBottom: `1px solid ${t.colors.gray[2]}`,
                })}
            >
                <Stack
                    gap={'md'}
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '100%',
                        paddingBottom: 32,
                    }}
                >
                    <Box ta={'center'}>
                        <Text fw={700} size='lg'>Your Check-in Progress</Text>
                        <Text>Track your journey across this Snapshot</Text>
                    </Box>
                    <Text fw={700}>Quick Checks</Text>
                    <Group w={'100%'} grow justify='center' align='center'>
                        {data.check_ins.map(({ id, check_in_date, status }) => (
                            <Stack align='center' key={id} >
                                <Text
                                    c={'#6B4EFF'}
                                    size={isCurrent(data.current_quick_check, id) ? 'md' : 'xs'}
                                    fw={isCurrent(data.current_quick_check, id) ? 700 : undefined}
                                >
                                    {check_in_date}
                                </Text>
                                <Avatar
                                    bg={getIconColor(data.current_quick_check, id, status)}
                                    size={isCurrent(data.current_quick_check, id) ? 'lg' : undefined}
                                >
                                    {getCheckInIcon(data.current_quick_check, id, status)}
                                </Avatar>
                                <Text
                                    size={isCurrent(data.current_quick_check, id) ? 'md' : 'xs'}
                                    fw={isCurrent(data.current_quick_check, id) ? 700 : undefined}
                                >
                                    {getCheckInLabel(data.current_quick_check, id, status)}
                                </Text>
                            </Stack>
                        ))
                        }
                    </Group>
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
                <UserStatus onClick={handleSubmit} />

            </Box>
        </Box>
    );
};

export default SurveyStartPage;
