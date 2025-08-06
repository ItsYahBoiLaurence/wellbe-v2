import { Button, Container, Input, Modal, Stack, Text, Title } from "@mantine/core";
import { PageHeader } from "../../components/PageHeader";
import { useForm } from "react-hook-form";
import { IconCheck } from '@tabler/icons-react';
import { useDisclosure } from "@mantine/hooks";
import api from "../../api/api";

export default function ForgotPasswordPage() {

    const { register, handleSubmit, formState: { errors, isSubmitSuccessful, isSubmitting }, reset } = useForm<{ email: string }>({
        defaultValues: {
            email: ""
        }
    })

    const [opened, { open, close }] = useDisclosure(isSubmitSuccessful);

    const onsubmit = async (data: { email: string }) => {
        try {
            await api.post(`/user/password-reset`, data)
            open()
            reset()
        } catch (error) {
            console.log(error)
        }
    }

    return (<>
        <Modal opened={opened} onClose={close} centered>
            <Stack pb={'md'}>
                <Stack gap={0} align="center" c={'teal'}>
                    <IconCheck size={'80px'} />
                    <Text fw={700}>Success!</Text>
                </Stack>
                <Text ta={'center'}>We've sent a password reset link to your email address. If you don't see it in your inbox, please check your spam or junk folder — sometimes it ends up there by mistake.</Text>
            </Stack>
        </Modal>
        <Container
            maw={{ base: '100%', md: '768px' }}
            w={'768px'}
            p={'md'}
            mx={'auto'}
            h={'100vh'}
        >

            <Stack>
                <PageHeader previousPage="/get-started" />
                <Stack>
                    <Title order={2}>
                        Forgot your password?
                    </Title>
                    <Text>Don't worry — it happens to the best of us. Just enter te email address you used to create your account, and we'll send you a link to reset your password.</Text>
                </Stack>
                <form onSubmit={handleSubmit(onsubmit)}>
                    <Stack align="start">
                        <Input.Wrapper label={<Text>Email</Text>} w={'100%'} error={errors.email?.message}>
                            <Input type="email" {...register('email', {
                                required: 'Email is required!',
                            })} />
                        </Input.Wrapper>
                        <Button leftSection={isSubmitSuccessful ? <IconCheck /> : undefined} type="submit" size="lg" color={'violet'} style={{ borderRadius: '8px' }} loading={isSubmitting}>{isSubmitSuccessful ? <Text>Sent Success</Text> : "Send reset link"}</Button>
                    </Stack>
                </form>
            </Stack >
        </Container >
    </>
    )
}