import { Container, Card, List, Text, Group, ScrollArea, LoadingOverlay, Center, Paper, Box, Stack, Indicator, Avatar } from "@mantine/core";
import { useInfiniteQuery } from "@tanstack/react-query";
import api from "../../api/api";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const InboxPage = () => {

  const navigate = useNavigate()

  const convertDate = (stringDate: string) => {
    const date = new Date(stringDate)
    const formattedDate = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
    return formattedDate
  }

  const {
    data: Tips,
    isError: noTips,
    isLoading: isFetchingTips,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['tips'],
    queryFn: async ({ pageParam = null }) => {
      console.log(pageParam)
      const res = await api.get(`/inbox?cursor=${pageParam ?? ''}`)
      return res.data
    },
    getNextPageParam: (latestPage) => latestPage.nextCursor ?? undefined
  })

  const loaderRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    });

    const current = loaderRef.current;
    if (current) observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (isFetchingTips) return (
    <LoadingOverlay
      visible={true}
      zIndex={1000}
      overlayProps={{ radius: 'sm', blur: 20 }}
      loaderProps={{ color: '#6E51FF', type: 'bars' }}
    />
  )

  if (noTips) return <Center w={"100%"} h={'100%'}>No Tips Available</Center>

  const flatTips = Tips.pages.flatMap((page) => page.data)

  console.log(flatTips)

  return (
    <Container fluid style={{ margin: "0px" }}>
      <Text ta={'center'} m="md">
        Inbox
      </Text>

      <List h={'100%'}>

        <ScrollArea h={'100%'} w={'100%'} overscrollBehavior="contain" scrollbarSize={8} scrollHideDelay={0}>
          {flatTips.map(({ id, subject, created_at, body, tag, opened }, index) => (
            <Paper w={"98%"} shadow="xs" key={index} py={'sm'} my={'md'} px={'md'} onClick={() => navigate(`${tag}-${id}`)}>
              <Stack gap={'sm'}>
                <Group justify="space-between" align="start">
                  <Text size="sm" fw={700} >{subject}</Text>
                  <Text size="xs" fw={opened ? undefined : 700}>{convertDate(created_at)}</Text>
                </Group>
                <Text c={opened ? "dimmed" : "black"} lineClamp={2} size="sm" >{body}</Text>
              </Stack>
            </Paper>
          ))}

          {hasNextPage ? (
            <Box p={'lg'} ref={loaderRef}>
              {hasNextPage && <LoadingOverlay
                pos={'relative'}
                visible={true}
                zIndex={1000}
                overlayProps={{ radius: 'sm', blur: 20 }}
                loaderProps={{ color: '#6E51FF', type: 'bars' }}
              />}
            </Box>
          ) : <></>}
        </ScrollArea>
      </List>
    </Container >
  );
};

export default InboxPage;
