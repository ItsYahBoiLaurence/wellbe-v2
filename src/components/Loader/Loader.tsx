import { Box, LoadingOverlay } from "@mantine/core";

export default function Loader() {
    return (
        <Box pos="relative">
            <LoadingOverlay
                visible={true}
                zIndex={1000}
                overlayProps={{ radius: 'sm', blur: 2 }}
                loaderProps={{ color: 'pink', type: 'bars' }}
            />
        </Box>
    )
}