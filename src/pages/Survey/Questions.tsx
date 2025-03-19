import { useState, useEffect, useRef, useContext } from 'react';
import { Box, Container, Progress, Button, Text, Card, LoadingOverlay, Flex, Paper, Title, Grid, SimpleGrid } from '@mantine/core';
import { Carousel } from '@mantine/carousel';
import api from '../../api/api';
import { AuthenticationContext } from '../../contexts/Authentication';
import { PageHeader } from '../../components/PageHeader';
import { Link } from 'react-router-dom';
import { PrimaryIconButton } from '../../components/IconButton';
import { IconChevronLeft } from '@tabler/icons-react';
import { NoQuestions } from '../../components/QuestionStatus';
import { Controller, useForm, useFieldArray } from 'react-hook-form'
import { PrimaryButton } from '../../components/Buttons/Buttons';

const choices = [
    { label: 'Strongly Disagree', value: 1 },
    { label: 'Disagree', value: 2 },
    { label: 'Strongly Agree', value: 4 },
    { label: 'Agree', value: 3 },
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


type SurveyQuestion = {
    indexQuestion: string; // Added indexQuestion to the type
    question: string; // Renamed question to match your data structure
};


type ApiResponse = {
    response: {
        questions: SurveyQuestion[];
    };
    status: number;
    message: string;
    name: string;
};



interface Answer {
    indexQuestion: string;
    answer: number;
}

interface Answers {
    answers: Answer[];
}

interface ResponseMessage {
    message: string;
}



const SurveyComponent = ({ changeStateFunction, status }: SurveyComponentProps) => {

    const authContext = useContext(AuthenticationContext);
    const { user } = authContext;
    const currentUser = user?.email as string

    const [surveyQuestions, setSurveyQuestions] = useState<SurveyQuestion[]>([]);
    const [isLoading, setIsLoading] = useState(false)

    const [remote, setRemote] = useState(null)

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

    const generateQuestions = async (email: string) => {
        try {
            const params = { email };
            const response = await api.get<ApiResponse>('/api/engine/generateQuestions', { params });
            return response.data
        } catch (error) {
            console.error('Error generating questions:', error);
            throw error;
        }
    };

    const submitAnswers = async (email: string, payload: Answers): Promise<ResponseMessage | undefined> => {
        try {
            const response = await api.post('/api/engine/submitAnswers', payload, {
                params: {
                    email: email
                }
            });
            if (response.status === 201) {
                return response.data as ResponseMessage;
            } else {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true)
                const questions = await generateQuestions(currentUser);
                setIsLoading(false)
                if (questions?.response?.questions) {
                    console.log(questions?.response.questions)
                    setSurveyQuestions(questions?.response?.questions)
                }

            } catch (error) {
                console.error('Error fetching questions:', error);
            }
        };
        fetchData();
    }, []);

    const { control, handleSubmit, setValue, formState: { isSubmitting }, watch } = useForm({
        defaultValues: {
            answers: [],
        },
    });

    const { fields, append } = useFieldArray({
        control,
        name: "answers",
    });

    const answers = watch("answers")

    const isDissabled = isSubmitting || answers.length < surveyQuestions.length
    const getButtonVariant = (indexQuestion, value) => {
        // Check if this button's value matches the selected answer
        const selectedAnswer = answers.find((item) => item.indexQuestion === indexQuestion)?.answer;
        return selectedAnswer === value ? "filled" : "outline";
    };

    const handleAnswer = (indexQuestion, answer) => {
        const existingIndex = fields.findIndex((item) => item.indexQuestion === indexQuestion);
        if (existingIndex !== -1) {
            setValue(`answers.${existingIndex}.answer`, answer);
        } else {
            append({ indexQuestion, answer });
        }
        scrollNext();
    };
    const [currentSlide, setCurrentSlide] = useState(0);
    const progressValue = ((currentSlide + 1) / surveyQuestions.length) * 100;

    const onSubmit = async (data) => {
        try {
            setIsLoading(true)
            await submitAnswers(currentUser, data)
            setIsLoading(false)
        } catch (error) {
            throw error
        }
        changeStateFunction(SurveyStatus.COMPLETED);
    }

    return (
        <Box pos="relative" style={{ height: '100%', paddingTop: 24, paddingBottom: 24 }}>
            <LoadingOverlay
                visible={isLoading}
                zIndex={1000}
                overlayProps={{ radius: 'sm', blur: 2 }}
                loaderProps={{ color: '#6E51FF', type: 'bars' }}
            />
            <Container
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    zIndex: 50,
                    height: '100%',
                    backgroundColor: 'white'
                }}
            >
                <PageHeader
                    style={{ paddingTop: 24, paddingBottom: 32 }}
                    actionButton={
                        <Link to="/">
                            <PrimaryIconButton>
                                <IconChevronLeft />
                            </PrimaryIconButton>
                        </Link>
                    }
                />
                <Text style={{ fontSize: '32px', marginBottom: '32px' }}>Questions</Text>
                <Box style={{ marginBottom: 32 }}>
                    <Progress color="violet" value={progressValue} />
                </Box>
                {surveyQuestions.length > 0 ? (
                    <Box p={24} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }} h={'100%'} >
                        <form onSubmit={handleSubmit(onSubmit)} style={{ height: '100%', flexDirection: 'column', display: 'flex', justifyContent: 'space-between' }}>
                            < Carousel slideGap="xl" getEmblaApi={setRemote} withControls={false} onSlideChange={setCurrentSlide}>
                                {
                                    surveyQuestions.map((q) => (
                                        <Carousel.Slide style={{ height: '100%' }} >
                                            <Box key={q.indexQuestion} h={250} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                                <Title ta={'center'} order={2} mb={32}>{q.question}</Title>
                                                <SimpleGrid cols={2}>
                                                    {choices.map((choice) => (
                                                        <Button
                                                            key={choice.label}
                                                            color={'#6E51FF'}
                                                            variant={getButtonVariant(q.indexQuestion, choice.value)}
                                                            onClick={() => handleAnswer(q.indexQuestion, choice.value)} ><Text size={'xs'}>{choice.label}</Text></Button>
                                                    ))}
                                                </SimpleGrid>
                                            </Box>
                                        </Carousel.Slide>
                                    ))
                                }
                            </Carousel>
                            <Flex direction={'row'} justify={'space-between'} >
                                <PrimaryButton px={32} onClick={handlePrevClick}>Back</PrimaryButton>
                                <Button color='#6E51FF' px={32} disabled={isDissabled} type="submit">Submit</Button>
                            </Flex>
                        </form>
                    </Box>
                ) : (
                    <NoQuestions />
                )
                }
            </Container >
        </Box >
    );
};

export default SurveyComponent;