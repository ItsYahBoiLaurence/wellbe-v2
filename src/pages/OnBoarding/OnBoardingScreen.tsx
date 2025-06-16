import { Box, Button, Center, Group, Stack, Text } from "@mantine/core";
import Set from '../../assets/set.svg'
import { Carousel } from "@mantine/carousel";
import { useState } from "react";
import { useNavigate } from "react-router-dom";





export default function OnBoardingScreen() {
    const [remote, setRemote] = useState(null)
    const [currentSlide, setCurrentSlide] = useState(0);

    const scrollNext = () => {
        if (remote) {
            remote.scrollNext();
        }
    }

    const handlePrevClick = () => {
        if (remote) {
            remote.scrollPrev();
        }
    }

    const hasSkip = currentSlide > 0

    return (
        <Stack bg={'blue'} h={'100vh'} align="center" justify="center">
            <Carousel
                py={72}
                getEmblaApi={setRemote}
                withControls={false}
                withIndicators
                onSlideChange={setCurrentSlide}
            >
                <Carousel.Slide style={{ height: '100%' }} bg={'pink'}>
                    <Center>
                        <Stack gap={'lg'} p={'lg'} w={'90vw'}>
                            <Stack align="center">
                                <img src={Set} ></img>
                                <Text size="lg">QUICK CHECK</Text>
                                <Text>1 Quick Check = 5 questions</Text>
                            </Stack>
                            <Stack align="center" ta={'center'}>
                                <Text size="lg" fw={700}>Quick Check</Text>
                                <Text>You'll receive short survets called <span style={{ fontWeight: 700 }}>Quick Checks</span> each one takes just a few moments to answer. They help us understand how you're doing so we can support your wellbeing.</Text>
                            </Stack>
                        </Stack>
                    </Center>
                </Carousel.Slide>


                <Carousel.Slide style={{ height: '100%' }} bg={'red'}>
                    <Center>
                        <Stack gap={'lg'} p={'lg'} w={'90vw'}>
                            <Stack align="center">
                                <img src={Set} ></img>
                                <Text size="lg">QUICK CHECK TIPS</Text>
                            </Stack>
                            <Stack align="center" ta={'center'}>
                                <Text size="lg" fw={700}>Quick Check</Text>
                                <Text>You'll receive short survets called <span style={{ fontWeight: 700 }}>Quick Checks</span> each one takes just a few moments to answer. They help us understand how you're doing so we can support your wellbeing.</Text>
                            </Stack>
                        </Stack>
                    </Center>
                </Carousel.Slide>
                <Carousel.Slide style={{ height: '100%' }} bg={'red'}>
                    <Center>
                        <Stack gap={'lg'} p={'lg'} w={'90vw'}>
                            <Stack align="center">
                                <img src={Set} ></img>
                                <Text size="lg">QUICK CHECK</Text>
                                <Text>1 Quick Check = 5 questions</Text>
                            </Stack>
                            <Stack align="center" ta={'center'}>
                                <Text size="lg" fw={700}>Quick Check</Text>
                                <Text>You'll receive short survets called <span style={{ fontWeight: 700 }}>Quick Checks</span> each one takes just a few moments to answer. They help us understand how you're doing so we can support your wellbeing.</Text>
                            </Stack>
                        </Stack>
                    </Center>
                </Carousel.Slide>
                <Carousel.Slide style={{ height: '100%' }} bg={'red'}>
                    <Center>
                        <Stack gap={'lg'} p={'lg'} w={'90vw'}>
                            <Stack align="center">
                                <img src={Set} ></img>
                                <Text size="lg">QUICK CHECK</Text>
                                <Text>1 Quick Check = 5 questions</Text>
                            </Stack>
                            <Stack align="center" ta={'center'}>
                                <Text size="lg" fw={700}>Quick Check</Text>
                                <Text>You'll receive short survets called <span style={{ fontWeight: 700 }}>Quick Checks</span> each one takes just a few moments to answer. They help us understand how you're doing so we can support your wellbeing.</Text>
                            </Stack>
                        </Stack>
                    </Center>
                </Carousel.Slide>
                <Carousel.Slide style={{ height: '100%' }} bg={'red'}>
                    <Center>
                        <Stack gap={'lg'} p={'lg'} w={'90vw'}>
                            <Stack align="center">
                                <img src={Set} ></img>
                                <Text size="lg">QUICK CHECK</Text>
                                <Text>1 Quick Check = 5 questions</Text>
                            </Stack>
                            <Stack align="center" ta={'center'}>
                                <Text size="lg" fw={700}>Quick Check</Text>
                                <Text>You'll receive short survets called <span style={{ fontWeight: 700 }}>Quick Checks</span> each one takes just a few moments to answer. They help us understand how you're doing so we can support your wellbeing.</Text>
                            </Stack>
                        </Stack>
                    </Center>
                </Carousel.Slide>
                <Carousel.Slide style={{ height: '100%' }} bg={'red'}>
                    <Center>
                        <Stack gap={'lg'} p={'lg'} w={'90vw'}>
                            <Stack align="center">
                                <img src={Set} ></img>
                                <Text size="lg">QUICK CHECK</Text>
                                <Text>1 Quick Check = 5 questions</Text>
                            </Stack>
                            <Stack align="center" ta={'center'}>
                                <Text size="lg" fw={700}>Quick Check</Text>
                                <Text>You'll receive short survets called <span style={{ fontWeight: 700 }}>Quick Checks</span> each one takes just a few moments to answer. They help us understand how you're doing so we can support your wellbeing.</Text>
                            </Stack>
                        </Stack>
                    </Center>
                </Carousel.Slide>
            </Carousel>
            <Group w={'90%'} grow>
                {hasSkip && <Button onClick={() => console.log('asd')}>Skip</Button>}
                <Button variant="default" onClick={() => scrollNext()}>Next</Button>
            </Group>
        </Stack>
    )
}