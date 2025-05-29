// import React from "react";
// import { useState } from "react";
import { Container, Card, List, Avatar, Text, Group, ScrollArea, LoadingOverlay, Center, Paper, Box } from "@mantine/core";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import api from "../../api/api";
import { useEffect, useRef, useState } from "react";

const messages = [
  {
    id: 1,
    sender: "Wellbe",
    subject: "Hi there!",
    preview: "How are you today?",
    timestamp: "9:56 AM",
  },
  {
    id: 2,
    sender: "Wellbe",
    subject: "It's been a while",
    preview: "How are you?",
    timestamp: "yesterday",
  },
  {
    id: 3,
    sender: "Wellbe",
    subject: "Photos from holiday",
    preview: "Hi, I put together some photos from...",
    timestamp: "5 Mar",
  },
  {
    id: 4,
    sender: "Wellbe",
    subject: "Latest order delivery",
    preview: "Good morning! Hope you are good...",
    timestamp: "4 Mar",
  },
  {
    id: 5,
    sender: "Wellbe",
    subject: "Service confirmation",
    preview: "Respected Sir, I Peter, your computer...",
    timestamp: "4 Mar",
  },
  {
    id: 6,
    sender: "Wellbe",
    subject: "Re: Blog for beta release",
    preview: "Hi, Please take a look at the beta...",
    timestamp: "3 Mar",
  },
];

const InboxPage = () => {

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
    <Container fluid style={{ margin: "0px", overflow: "auto" }}>
      <Text size="xl" mb="md">
        Inbox
      </Text>

      <List>
        <ScrollArea
          style={{ width: "100%", height: "100%" }}
          scrollbars="y"
        >
          {flatTips.map(({ created_at, tip }, index) => (
            <Paper shadow="xs" key={index} py={'sm'}>
              <Card p={'lg'} radius={'md'} mb={'sm'}>
                <Card.Section>
                  <Group justify="space-between" align="start">
                    <Text size="lg" fw={700} >Wellbe Tip</Text>
                    <Text size="xs">{convertDate(created_at)}</Text>
                  </Group>
                  <Text c="dimmed" lineClamp={2} size="sm">{tip}</Text>
                </Card.Section>
              </Card>
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
