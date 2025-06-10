import { ScrollArea, Stack, Button, Container, Title, Text, Box, TypographyStylesProvider } from "@mantine/core"
import { IconChevronLeft } from "@tabler/icons-react"
import { useQuery } from "@tanstack/react-query"
import { useNavigate, useParams } from "react-router-dom"
import api from "../../api/api"
import { useEffect } from "react"
import queryClient from "../../queryClient"
import Loader from "../../components/Loader/Loader"

export default function Index() {
    const navigate = useNavigate()
    const { id } = useParams()

    if (!id) {
        navigate(-1)
        return
    }

    const [tag, item_id] = id.split("-")

    const { data, isError, isLoading } = useQuery({
        queryKey: ['message'],
        queryFn: async () => {
            const res = await api.get(`/inbox/singleMessage`, { params: { tag, item_id } })
            return res.data
        },
        staleTime: 0,
        cacheTime: 0
    })

    useEffect(() => {
        console.log(id)
        const updateMessage = async (id: string) => {
            try {
                await api.patch(`/inbox/${id}/read`)
                queryClient.invalidateQueries({ queryKey: ['tips'], exact: true })
            } catch (e) {
                console.log(e)
            }
        }
        updateMessage(item_id)
    }, [])

    if (isError) return <>error...</>
    if (isLoading) return <Loader />

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
                    <Stack gap={'lg'} my={'md'}>
                        <Title>{data.subject}</Title>
                        <Text size="sm" c="dimmed">{formatted}</Text>
                        <TypographyStylesProvider>
                            <div
                                dangerouslySetInnerHTML={{ __html: data.body }}
                            />
                        </TypographyStylesProvider>
                    </Stack>
                </ScrollArea>
            </Container>
        </>
    )
}