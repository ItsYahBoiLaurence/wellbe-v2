import { useState, useEffect, useRef, useContext, useMemo } from 'react';
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
import { useQueries, useQuery } from '@tanstack/react-query';
import queryClient from '../../queryClient';

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
    [key: string]: number
}

interface Answers {
    answers: Answer[];
}

interface ResponseMessage {
    message: string;
}



const SurveyComponent = ({ changeStateFunction, status }: SurveyComponentProps) => {

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

    const getQuestions = async () => {
        try {
            const response = await api.get('/employee/question')
            console.log(response)
            return response.data
        } catch (e) {
            throw new Error()
        }
    }

    const { control, handleSubmit, formState: { isSubmitting }, watch } = useForm({
        defaultValues: {
            answers: []
        },
    });

    const { fields, append, update } = useFieldArray({
        control,
        name: "answers",
    });

    const answers = watch("answers")

    const answerMap = useMemo(
        () => Object.assign({}, ...answers),
        [answers]
    );

    const getButtonVariant = (questionId: string, value: number) =>
        answerMap[questionId] === value ? 'filled' : 'outline';

    const handleAnswer = (questionId: string, value: number) => {
        const idx = fields.findIndex(field =>
            Object.prototype.hasOwnProperty.call(field, questionId)
        );
        const entry = { [questionId]: value };

        if (idx >= 0) {
            update(idx, entry);
        } else {
            append(entry);
        }

        scrollNext();
    };

    const onSubmit = async (data) => {
        console.log(data.answers)
        try {
            const res = await api.post('/employee/question', data.answers)
            console.log(res.data)
            queryClient.removeQueries({ queryKey: ['question'], exact: true })
            changeStateFunction(SurveyStatus.COMPLETED);
        } catch (error) {
            console.log(error)
        }
    }

    const { data: questions, isLoading: isFetchingQuestions, isError: noAvailableQuestion } = useQuery({
        queryKey: ['question'],
        queryFn: async () => getQuestions(),
        staleTime: 0,
        refetchOnMount: 'always'
    })

    if (isFetchingQuestions || isSubmitting) return (
        <LoadingOverlay
            visible={true}
            zIndex={1000}
            overlayProps={{ radius: 'sm', blur: 20 }}
            loaderProps={{ color: '#6E51FF', type: 'bars' }}
        />
    )

    if (noAvailableQuestion) return <NoQuestions />

    const isDissabled = isSubmitting || answers.length < questions.length

    const progressValue = ((currentSlide + 1) / questions.length) * 100;

    return (
        <Box pos="relative" style={{ height: '100%', paddingTop: 24, paddingBottom: 24 }}>
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
                <Box p={24} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }} h={'100%'} >
                    <form onSubmit={handleSubmit(onSubmit)} style={{ height: '100%', flexDirection: 'column', display: 'flex', justifyContent: 'space-between' }}>
                        < Carousel slideGap="xl" getEmblaApi={setRemote} withControls={false} onSlideChange={setCurrentSlide}>
                            {questions.map(({ id, question }) => (
                                <Carousel.Slide key={id} style={{ height: '100%' }} >
                                    <Box h={250} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                        <Title ta={'center'} order={2} mb={32}>{question}</Title>
                                        <SimpleGrid cols={2}>
                                            {choices.map((choice) => (
                                                <Button
                                                    key={choice.label}
                                                    color={'#6E51FF'}
                                                    variant={getButtonVariant(id, choice.value)}
                                                    onClick={() => handleAnswer(id, choice.value)} ><Text size={'xs'}>{choice.label}</Text></Button>
                                            ))}
                                        </SimpleGrid>
                                    </Box>
                                </Carousel.Slide>
                            ))}
                        </Carousel>
                        <Flex direction={'row'} justify={'space-between'} >
                            <PrimaryButton px={32} onClick={handlePrevClick}>Back</PrimaryButton>
                            <Button color='#6E51FF' px={32} disabled={isDissabled} type="submit">Submit</Button>
                        </Flex>
                    </form>
                </Box>
            </Container >
        </Box >
    );
};

export default SurveyComponent;