import { ScrollArea, Stack, Button, Container, Title, Text, Box } from "@mantine/core"
import { IconChevronLeft } from "@tabler/icons-react"
import { useQuery } from "@tanstack/react-query"
import { useNavigate, useParams } from "react-router-dom"
import api from "../../api/api"
import { useEffect } from "react"




export default function Index() {
    const navigate = useNavigate()
    const { id } = useParams()

    if (!id) {
        navigate(-1)
        return
    }

    useEffect(() => {
        const updateMessage = async (id) => {
            try {
                await api.patch(`/inbox/${id}/read`)
            } catch (e) {
                console.log(e)
            }
        }
        updateMessage(id)
    }, [])

    const [tag, item_id] = id.split("-")

    const { data, isError, isLoading } = useQuery({
        queryKey: ['message'],
        queryFn: async () => {
            const res = await api.get(`/inbox/singleMessage`, { params: { tag, item_id } })
            return res.data
        }
    })



    if (isError) return <>error...</>
    if (isLoading) return <>loading...</>

    console.log(data)

    const date = new Date(data.created_at);
    const formatted = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <>
            <Box
                maw={{ base: '100%', md: '768px' }}
                w={'768px'}
                px={'md'}
                mx={'auto'}
            >
                <Button variant="transparent" onClick={() => navigate(-1)} color="black" leftSection={<IconChevronLeft />}>Inbox</Button>
            </Box>
            <Container fluid style={{ margin: "0px", overflow: "auto" }}>
                <ScrollArea
                    maw={{ base: '100%', md: '768px' }}
                    w={'768px'}
                    px={'md'}
                    mx={'auto'}
                >
                    <Stack gap={'lg'} mt={'md'}>
                        <Title>{data.subject}</Title>
                        <Text size="sm" c="dimmed">{formatted}</Text>
                        <Text>{data.body}</Text>
                    </Stack>
                </ScrollArea>
            </Container>
        </>
    )
}