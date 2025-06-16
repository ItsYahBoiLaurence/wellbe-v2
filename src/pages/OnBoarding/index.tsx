import { Box, Button, List, Stack, Text } from "@mantine/core";
import AppLogo from '../../assets/logo.svg';
import { useContext } from "react";
import { AuthenticationContext } from "../../contexts/Authentication";
import { useNavigate } from "react-router-dom";

export default function Index() {
    const { userInfo } = useContext(AuthenticationContext)

    const navigate = useNavigate()

    return (
        <Box h={'100vh'} style={{ background: 'linear-gradient(90deg,rgba(255, 0, 123, 0.8) 0%, rgba(0, 161, 255, 0.8) 100%)' }}>
            <Box h={'100%'} w={'100%'} style={{ background: 'linear-gradient(180deg,rgba(255, 255, 255, 1) 45%, rgba(255, 255, 255, 0.5) 100%)' }}>
                <Stack
                    justify="space-between"
                    align="center"
                    maw={{ base: '100%', md: '425px' }}
                    w={'425px'}
                    px={'lg'}
                    py={42}
                    mx={'auto'}
                    h={'100%'}
                >
                    <Stack w={'90%'} ta={'center'} gap={56}>
                        <Box
                            pos="relative"
                            p="md"
                            bg={'transparent'}
                        >
                            <img src={AppLogo} alt="logo" height={64} />
                        </Box>
                        <Text size="lg" fw={700}>Hi {userInfo?.first_name} {userInfo?.last_name}!</Text>
                        <Stack gap={'lg'}>
                            <Text>
                                Because <span style={{ fontWeight: 700 }}>{userInfo?.department.company.name}</span> cares about your
                                wellbeing, they've partnered with <span style={{ fontWeight: 700 }}>Wellbe, your personal wellbeing buddy.</span>
                            </Text>
                            <Box>
                                <Text fw={700}>What we need from you:</Text>
                                <List size="sm">
                                    <List.Item style={{ padding: 0, margin: 0 }}>
                                        Just answer check-ins based on your schedule
                                    </List.Item>
                                </List>
                            </Box>

                            <Text>From there, we'll help you improve your wellbeing based on your scores. Let's take it one step at a time, together</Text>
                        </Stack>
                    </Stack>

                    <Box w={'90%'}>
                        <Button fullWidth variant="default" onClick={() => navigate('information')}>Get Started</Button>
                    </Box>
                </Stack>
            </Box>
        </Box >
    )
}