import api from "../api";

type Question = {
    indexQuestion: string;
    question: string;
}

type ApiResponse = {
    response: {
        questions: Question[];
    };
    status: number;
    message: string;
    name: string;
}

export const generateQuestions = async (
    email: string,
    company: string
): Promise<Question[] | undefined> => {
    try {
        const params = { email, company };
        const response = await api.get<ApiResponse>('/api/engine/generateQuestions', { params });

        return response.data.response.questions;
    } catch (error) {
        console.error('Error generating questions:', error);
        throw error;
    }
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

export const submitAnswers = async (email: string, payload: Answers): Promise<ResponseMessage | undefined> => {
    try {
        const response = await api.post('/api/engine/submitAnswers', payload, {
            params: {
                email: email
            }
        });
        if (response.status === 200) {
            return response.data as ResponseMessage;
        } else {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
};


interface AdviceMessage {
    dateGenerate: string;
    advise: string;
    feedback: string;
}

interface ResponseMessage {
    adviceMessage: AdviceMessage;
}

export const getLatestAdvice = async (email: string, company: string): Promise<ResponseMessage | undefined> => {
    try {
        const params = {
            email,
            company
        }
        const response = await api.get('/api/engine/latestAdvise', { params })
        return response.data as ResponseMessage;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

