import { Paper, Text } from "@mantine/core"

export const CarouselPaper = ({ description }) => {
    return (
        <Paper shadow="md" radius="md" p="xl" h={'100%'} style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
            <Text ta={'center'} size="xl">{description}</Text>
        </Paper>
    )
}