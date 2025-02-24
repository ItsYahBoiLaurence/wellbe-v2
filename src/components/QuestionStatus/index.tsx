import { ActionIcon, Box, Overlay, Center, Flex, RingProgress, Text, Paper } from "@mantine/core"
import { useContext, useEffect, useState } from "react"
import { notifications } from "@mantine/notifications"
import api from "../../api/api"
import { AuthenticationContext } from "../../contexts/Authentication"
import { PrimaryButton } from "../Buttons/Buttons"
import { OverlayResult } from "../DataVisualization/DataVisualization"
import { IconCheck } from "@tabler/icons-react"
import { useNavigate } from "react-router-dom"

export const NoQuestions = () => {
    const { user } = useContext(AuthenticationContext)
    const navigate = useNavigate()
    const [status, setStatus] = useState(false)
    const [message, setMessage] = useState("")
    const generateReport = async () => {
        const params = {
            company: 'Positive Workplaces',
            email: user?.email
        }
        try {
            const response = await api.get('/api/engine/generateReport', { params })
            if (response.status === 403) {
                setMessage(response.message)
            }

            if (response.data.statusCode === 202) {
                setStatus(true)
                setMessage(response.data.message)
            }

            navigate('/')
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <Overlay color="#000" backgroundOpacity={.1} blur={6} >
            <Center h={'100%'}>
                <Paper shadow="md" radius="lg" p="md" w={'80%'} h={'35%'} style={{ display: 'flex', flexDirection: 'column' }}>
                    <RingProgress
                        style={{ alignSelf: "center" }}
                        sections={[{ value: 100, color: 'teal' }]}
                        label={
                            <Center>
                                <ActionIcon color="teal" variant="light" radius="xl" size="xl">
                                    <IconCheck size={22} />
                                </ActionIcon>
                            </Center>
                        }
                    />
                    <Text ta={"center"} mb={10}>You already answered all the questions. Well done!</Text>
                    <PrimaryButton style={{ alignSelf: "center" }} w={'50%'} onClick={generateReport}>Go Back!</PrimaryButton>
                </Paper>
            </Center>
        </Overlay>
    )
}