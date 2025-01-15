// import Autoplay from 'embla-carousel-autoplay';
// import { useRef } from 'react';
// import { useProfile } from '../../hooks/useProfile';
// import { Carousel } from '@mantine/carousel';

import { Box, Container } from '@mantine/core';
import GetStartedOverlay from '../../assets/getstarted-gradient-overlay.png';
import { PrimaryButton } from '../../components/Buttons/Buttons';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <Box
      style={(t) => ({
        height: '100%',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          width: '100%',
          height: '60%',
          background: `linear-gradient(to bottom, ${t.colors.gray[3]} 0%, ${t.colors.gray[3]} 50%, transparent 100%)`,
        },
      })}
    >
      <Box
        style={{
          width: '100%',
          height: '100%',
          background: 'url(https://picsum.photos/300/400)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <Container
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            paddingTop: 58,
            paddingBottom: 58,
            height: '100%',
          }}
        >
          {/* <Carousel
            plugins={[autoplay.current]}
            onMouseEnter={autoplay.current.stop}
            onMouseLeave={autoplay.current.reset}
            withIndicators
            slideGap="md"
            withControls={false}
            style={(t) => ({
              '& .mantine-Carousel-indicators': {
                top: -32,
                '& .mantine-Carousel-indicator': {
                  width: 8,
                  height: 8,
                  opacity: 0.5,
                  backgroundColor: t.colors.primary[4],
                  '&:not(:last-of-type)': {
                    marginRight: 8,
                  },
                  '&[data-active="true"]': {
                    opacity: 1,
                  },
                },
              },
            })}
          >
            <Carousel.Slide>
              <QuoteCard
                title="You are enough"
                subtitle="Your are strong enough to handle your challenges, wise enough to find a solution to your problems, and capable enough to do whatever needs to be done."
              />
            </Carousel.Slide>
            <Carousel.Slide>
              <QuoteCard
                title="Quote of the day"
                subtitle="The truth is, they will never realize how big of a part you played...until you’re not playing it anymore."
              />
            </Carousel.Slide>
            <Carousel.Slide>
              <QuoteCard
                title="From well-being, to being well."
                subtitle="Join us in building a community that supports each other."
              />
            </Carousel.Slide>
          </Carousel> */}

          <Box
            style={{ display: 'flex', justifyContent: 'center', zIndex: 50 }}
          >
            <Link to={`/survey`}>
              <PrimaryButton>Start Your Well-being Journey</PrimaryButton>
            </Link>
          </Box>

        </Container>
        <Box
          component="img"
          src={GetStartedOverlay}
          style={{
            position: 'absolute',
            bottom: 0,
            width: '100%',
            height: '50%',
          }}
        />
      </Box>
    </Box>
  );
};

export default HomePage;
