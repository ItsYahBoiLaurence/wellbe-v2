import { Overlay, Center, Paper, SimpleGrid, Text, Flex, Indicator, Avatar } from "@mantine/core"
import { useContext, useEffect, useState } from "react"
import api from "../../api/api"
import Decreased from '../../assets/decrease.png'
import Increased from '../../assets/increase.png'
import Maintained from '../../assets/maintained.png'
import { AuthenticationContext } from "../../contexts/Authentication"


export const OverlayResult = ({ children }) => {
    return (
        <Overlay color="#F7F8FA" backgroundOpacity={.9} blur={6} >
            <Center h={'100%'}>
                <Paper shadow="md" radius="lg" p="md" w={'80%'} h={'80%'} style={{ display: 'flex', flexDirection: 'column' }}>
                    {children}
                </Paper>
            </Center>
        </Overlay>
    )

}
export const DomainResult = () => {
    const [report, setReport] = useState([])
    const { user } = useContext(AuthenticationContext)

    const generate = async () => {
        console.log(user?.email)
        const params = {
            email: user?.email,
        };
        try {
            await api.get('/api/engine/generateReport', { params }).then((response) => {
            })
        } catch (error) {
            console.error("Error generating report:", error);
        }
    }
    const generateReport = async () => {
        console.log(user?.email)
        const params = {
            email: user?.email,
        };
        try {
            await api.get('/api/engine/latestComparison', { params }).then((response) => {
                setReport(response.data.data)
                console.log(response.data.data)
            })
        } catch (error) {
            console.error("Error generating report:", error);
        }
    };

    const setIcon = (value) => {
        const photo = value == 0 ? Maintained : value > 0 ? Increased : Decreased
        return photo
    }

    const setTextColor = (value) => {
        const color = value == 0 ? 'gray' : value > 0 ? 'green' : 'red'
        return color
    }

    useEffect(() => {
        generate()
        generateReport();
    }, []); // Empty dependency array ensures this runs only once when the component mounts.

    return (
        <SimpleGrid cols={2} w={'100%'}>
            {report && report.map(({ label, value, difference }) => (
                <Paper shadow="xs" radius="lg" p="md">
                    <Flex direction={"column"}>
                        <Avatar radius="sm" size="lg" src={setIcon(difference)} />
                        <Text size="">{label}</Text>
                        <Flex direction={"row"} justify={'space-between'} >
                            <Text size="lg" >{value}%</Text>
                            <Text size="lg" c={setTextColor(difference)}>{difference}%</Text>
                        </Flex>
                    </Flex>
                </Paper>
            ))}
        </SimpleGrid >
    );
};