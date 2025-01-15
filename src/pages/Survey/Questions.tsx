import { useState, useEffect, useRef } from 'react';
import { Box, Container, Progress, Button, Text, Card, Group } from '@mantine/core';
import { Carousel } from '@mantine/carousel';
import api from '../../api/api';

const choices = [
    { label: 'Strongly Disagree', value: 1 },
    { label: 'Disagree', value: 2 },
    { label: 'Agree', value: 3 },
    { label: 'Strongly Agree', value: 4 },
];

enum SurveyStatus {
    START = 'survey-start',
    IN_PROGRESS = 'survey-in-progress',
    COMPLETED = 'survey-complete',
}

type SurveyComponentProps = {
    changeStateFunction: (status: SurveyStatus) => void;
    status: SurveyStatus;
};

type SurveyResponses = {
    [questionId: string]: number;
};

type SurveyQuestion = {
    id: string;
    text: string;
};

const SurveyComponent = ({ changeStateFunction }: SurveyComponentProps) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [progressValue, setProgressValue] = useState(0);
    const [responses, setResponses] = useState<SurveyResponses>({});
    const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
    const [dummySurvey, setDummySurvey] = useState<{ [key: string]: string }>({});

    const carouselRef = useRef<any>(null); // Create a reference for the Carousel component

    const surveyQuestions: SurveyQuestion[] = Object.entries(dummySurvey).map(([id, text]) => ({
        id,
        text,
    }));

    useEffect(() => {
        if (surveyQuestions.length > 0) {
            const progress = ((currentSlide + 1) / surveyQuestions.length) * 100;
            setProgressValue(progress);
            setSelectedChoice(responses[surveyQuestions[currentSlide]?.id] || null);
        }
    }, [currentSlide, responses]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const params = { email: 'andrew@gmail.com' };
                const response = await api.get('/engine/generateQuestions', { params });
                console.log('Fetched Data:', response.data);
                setDummySurvey(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    const handleChoiceClicked = (value: number) => {
        setResponses((prev) => ({
            ...prev,
            [surveyQuestions[currentSlide].id]: value,
        }));
        setSelectedChoice(value);
        if (carouselRef.current) carouselRef.current.scrollNext(); // Access Embla API to scroll
    };

    const handleSubmit = () => {
        console.log('Survey Completed:', responses);
        const data = {
            email: 'andrew@gmail.com',
            ...responses,
        };
        try {
            api.post('engine/recordAnswer', data).then((res) => console.log(res));
        } catch (error) {
            console.log(error);
        }
        changeStateFunction(SurveyStatus.COMPLETED);
    };

    return (
        <Box style={{ height: '100%', paddingTop: 24, paddingBottom: 24 }}>
            <Container
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    zIndex: 50,
                    height: '100%',
                }}
            >
                <Text style={{ fontSize: '32px', marginBottom: '32px' }}>Questions</Text>
                <Box style={{ marginBottom: 32 }}>
                    <Progress value={progressValue} />
                </Box>

                {surveyQuestions.length > 0 ? (
                    <Carousel
                        ref={carouselRef} // Attach the ref here
                        withControls={false}
                        onSlideChange={(index) => setCurrentSlide(index)}
                        slideGap={32}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            flexGrow: 1,
                            '& .mantineCarouselViewport': { height: '100%' },
                            '& .mantineCarouselContainer': { height: '100%' },
                        }}
                    >
                        {surveyQuestions.map((question, index) => (
                            <Carousel.Slide key={question.id}>
                                <Card
                                    shadow="md"
                                    radius="lg"
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        height: '100%',
                                        padding: 32,
                                    }}
                                >
                                    <Text size="xl" mb="md">
                                        {question.text}
                                    </Text>
                                    <Group style={{ marginTop: 24 }}>
                                        {choices.map((choice) => (
                                            <Button
                                                key={choice.value}
                                                variant={selectedChoice === choice.value ? 'filled' : 'outline'}
                                                color={selectedChoice === choice.value ? 'blue' : 'gray'}
                                                onClick={() => handleChoiceClicked(choice.value)}
                                            >
                                                {choice.label}
                                            </Button>
                                        ))}
                                    </Group>
                                    {index === surveyQuestions.length - 1 && (
                                        <Button
                                            style={{ marginTop: 32 }}
                                            onClick={handleSubmit}
                                            disabled={!selectedChoice}
                                        >
                                            Submit
                                        </Button>
                                    )}
                                </Card>
                            </Carousel.Slide>
                        ))}
                    </Carousel>
                ) : (
                    <Text color="red">No questions available to display.</Text>
                )}
            </Container>

            <Box
                style={{
                    position: 'absolute',
                    bottom: 0,
                    width: '100%',
                    height: '50%',
                    background: 'rgba(0, 0, 0, 0.1)',
                    opacity: 0.5,
                }}
            />
        </Box>
    );
};

export default SurveyComponent;
