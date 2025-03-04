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
export const DomainResult = ({ sessionCount }) => {

    const company = localStorage.getItem("CLIENT_USER_COMPANY")

    const [report, setReport] = useState({})
    const { user } = useContext(AuthenticationContext)
    const generateReport = async () => {
        const params = {
            company: company,
            email: user?.email,
        };
        if (sessionCount == 5) {
            try {
                const response = await api.get('/api/engine/generateReport', { params })
                if (response.status === 403) {
                    console.log(response)
                }

                if (response.data.statusCode === 202) {
                    console.log(response)
                }


            } catch (error) {
                console.log(error)
            }
        }

        if (sessionCount == 5) {
            try {
                await api.get('/api/engine/latestComparison', { params }).then((response) => {
                    setReport(response.data)
                })
            } catch (error) {
                console.error("Error generating report:", error);
            }
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
        generateReport();
    }, []); // Empty dependency array ensures this runs only once when the component mounts.

    return (
        sessionCount != 5 ? (
            <Paper shadow="xs" radius="lg" p="xl">
                <Text ta={"center"}>No Report!</Text>
            </Paper>
        ) : (
            <SimpleGrid cols={2}>
                <Paper shadow="xs" radius="lg" p="md">
                    <Flex direction={"column"}>
                        <Avatar radius="sm" size="lg" src={setIcon(report.CharacterDifference)} />
                        <Text size="">Character</Text>
                        <Flex direction={"row"} justify={'space-between'} >
                            <Text size="lg" >{report.Character}%</Text>
                            <Text size="lg" c={setTextColor(report.CharacterDifference)}>{report.CharacterDifference}%</Text>
                        </Flex>
                    </Flex>
                </Paper>
                <Paper shadow="xs" radius="lg" p="md">
                    <Flex direction={"column"}>
                        <Avatar radius="sm" size="lg" src={setIcon(report.ContentmentDifference)} />
                        <Text size="">Contentment</Text>
                        <Flex direction={"row"} justify={'space-between'} >
                            <Text size="lg" >{report.Contentment}%</Text>
                            <Text size="lg" c={setTextColor(report.ContentmentDifference)}>{report.ContentmentDifference}%</Text>
                        </Flex>
                    </Flex>
                </Paper>
                <Paper shadow="xs" radius="lg" p="md">
                    <Flex direction={"column"}>
                        <Avatar radius="sm" size="lg" src={setIcon(report.ConnectednessDifference)} />
                        <Text size="">Connectedness</Text>
                        <Flex direction={"row"} justify={'space-between'} >
                            <Text size="lg" >{report.Connectedness}%</Text>
                            <Text size="lg" c={setTextColor(report.ConnectednessDifference)}>{report.ConnectednessDifference}%</Text>
                        </Flex>
                    </Flex>
                </Paper>
                <Paper shadow="xs" radius="lg" p="md">
                    <Flex direction={"column"}>
                        <Avatar radius="sm" size="lg" src={setIcon(report.CareerDifference)} />
                        <Text size="">Career</Text>
                        <Flex direction={"row"} justify={'space-between'} >
                            <Text size="lg" >{report.Career}%</Text>
                            <Text size="lg" c={setTextColor(report.CareerDifference)}>{report.CareerDifference}%</Text>
                        </Flex>
                    </Flex>
                </Paper>
            </SimpleGrid >

        )
    );
};