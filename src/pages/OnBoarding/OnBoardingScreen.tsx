import { Box, Button, Center, Flex, Group, Stack, Text } from "@mantine/core";
import Set from '../../assets/set.svg'
import Phone from '../../assets/phone.svg'
import Phone2 from '../../assets/2Phone.svg'
import Inbox from '../../assets/InboxPhone.svg'
import GridPic from '../../assets/4Pic.svg'


import { Carousel } from "@mantine/carousel";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import classes from './OnBoardingScreen.module.css'

interface Remote {
    scrollNext: () => {}
    scrollPrev: () => {}
}

export default function OnBoardingScreen() {
    const [remote, setRemote] = useState<Remote | null>(null)
    const [currentSlide, setCurrentSlide] = useState(0);
    const navigate = useNavigate()

    const scrollNext = () => {
        if (remote) {
            remote.scrollNext();
        }
    }

    return (
        <Flex
            direction={'column'}
            align={'center'}
            gap={'12px'}
            bg={'radial-gradient(circle,rgba(219, 219, 245, 1) 0%, rgba(232, 232, 249, 1) 40%, rgba(236, 240, 243, 1) 80%)'}

        >
            <Box
                maw={{ base: '100%', md: '768px' }}
                w={'768px'}
                p={'md'}
                mx={'auto'}
                h={'100vh'}>
                <Box w={'100%'} flex={.90}>
                    <Carousel
                        w={"100%"}
                        getEmblaApi={setRemote}
                        withControls={false}
                        withIndicators
                        onSlideChange={setCurrentSlide}
                        classNames={{ indicator: classes.indicator }}

                    >
                        <Carousel.Slide w={'100%'} style={{ height: '100%' }} p={12}>
                            <Center>
                                <Stack gap={'lg'} p={'lg'} w={'100%'}>
                                    <Stack align="center">
                                        <img src={Set} ></img>
                                        <Text size="lg" fw={700}>QUICK CHECK</Text>
                                        <Text>1 Quick Check = 5 questions</Text>
                                    </Stack>
                                    <Stack align="center" ta={'center'}>
                                        <Text size="xl" fw={700} c={'#6B4EFF'}>Quick Check</Text>
                                        <Text>You'll receive short survets called <span style={{ fontWeight: 700 }}>Quick Checks</span> each one takes just a few moments to answer. They help us understand how you're doing so we can support your wellbeing.</Text>
                                    </Stack>
                                </Stack>
                            </Center>
                        </Carousel.Slide>

                        <Carousel.Slide style={{ height: '100%' }} p={12}>
                            <Center>
                                <Stack gap={'lg'} p={'lg'} w={'100%'}>
                                    <Stack align="center">
                                        <img src={Phone} ></img>

                                    </Stack>
                                    <Stack align="center" ta={'center'}>
                                        <Text size="xl" fw={700} c={'#6B4EFF'}>QUICK CHECK TIPS</Text>
                                        <Text>After each Quick Checks (5 questions), you'll get a personalized tip, a small, helpful insight to support your wellbeing journey based on your answers. </Text>
                                    </Stack>
                                </Stack>
                            </Center>
                        </Carousel.Slide>

                        <Carousel.Slide style={{ height: '100%' }} p={12}>
                            <Center h={'100%'}>
                                <Stack gap={'lg'} p={'lg'} w={'100%'} >
                                    <Stack align="center">
                                        <img src={GridPic} ></img>
                                    </Stack>
                                    <Stack align="center" ta={'center'} >
                                        <Text size="xl" fw={700} c={'#6B4EFF'}>Snapshot</Text>
                                        <Text style={{ lineHeight: 1.2 }}>Complete 5 Quick Checks to finish a Snapshot — unlocking deeper insights into your well-being and a fresh set of personalized tips to help you thrive.</Text>
                                        <Text >It includes your scores across the 4 domains: <span style={{ fontWeight: 700 }}>Character, Connectedness, Career, Contentment</span></Text>
                                    </Stack>
                                </Stack>
                            </Center>
                        </Carousel.Slide>

                        <Carousel.Slide style={{ height: '100%' }} p={12}>
                            <Center>
                                <Stack gap={'lg'} p={'lg'} w={'100%'}>
                                    <Stack align="center">
                                        <img src={Inbox} ></img>
                                    </Stack>
                                    <Stack align="center" ta={'center'}>
                                        <Text size="xl" fw={700} c={'#6B4EFF'}>Scheduled Notifications</Text>
                                        <Text>Your <span style={{ fontWeight: 700 }}>HR team will set the schedule</span> for when you'll receive each Quick Checks.</Text>
                                        <Text>You'll be notified via <span style={{ fontWeight: 700 }}>email </span> whenever a New Quick Check is available to answer.</Text>
                                    </Stack>
                                </Stack>
                            </Center>
                        </Carousel.Slide>

                        <Carousel.Slide style={{ height: '100%' }} p={12}>
                            <Center>
                                <Stack gap={'lg'} p={'lg'} w={'100%'}>
                                    <Stack align="center">
                                        <img src={Phone2} ></img>
                                        <Text fw={700}>Your Tips and Check-Ins, All in One Place</Text>
                                    </Stack>
                                    <Stack align="center" ta={'center'}>
                                        <Text size="xl" fw={700} c={'#6B4EFF'}>Your Wellbe Inbox</Text>
                                        <Text>All the tips you receive, from both Quick Checks and Snapshots, are saved in your Wellbe Inbox.</Text>
                                        <Text>Come back anytime to reflect, review, or get a little boost when you need it.</Text>

                                    </Stack>
                                </Stack>
                            </Center>
                        </Carousel.Slide>
                    </Carousel>
                </Box>
                <Group w={'90%'} grow flex={.05} align="center" mx={'auto'}>
                    {currentSlide > 0 && currentSlide != 4 && <Button bg={'linear-gradient(90deg,rgba(255,0,123,0.25) 15%, rgba(0, 161, 255, 0.25) 100%)'} c={'black'} onClick={() => navigate('/')}>Skip</Button>}
                    {currentSlide != 4 && <Button variant="default" onClick={() => scrollNext()} bg="#6B4EFF" c={'white'}>Next</Button>}
                    {currentSlide == 4 && <Button bg="#6B4EFF" c={'white'} onClick={() => navigate('/')}>Got it!</Button>}
                </Group>
            </Box>

        </Flex >
    )
}

// 