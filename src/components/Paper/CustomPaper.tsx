import { Paper, Text } from "@mantine/core"

export const CarouselPaper = ({ description }) => {
    return (
        <Paper shadow="md" radius="md" p="xl" h={'100%'} style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>
            <Text ta={'center'} size="xl" c={'white'}>{description}</Text>
        </Paper>
    )
}