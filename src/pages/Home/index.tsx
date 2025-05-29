// import Autoplay from 'embla-carousel-autoplay';
// import { useRef } from 'react';
// import { useProfile } from '../../hooks/useProfile';
// import { Carousel } from '@mantine/carousel';

import { Box, Container } from '@mantine/core';
import GetStartedOverlay from '../../assets/getstarted-gradient-overlay.png';
import { PrimaryButton } from '../../components/Buttons/Buttons';
import { Link } from 'react-router-dom';
import { Carousel } from '@mantine/carousel';
import { CarouselPaper } from '../../components/Paper/CustomPaper';
import ORANGEBG from '../../assets/forest.jpg'

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
          backgroundImage: `url(${ORANGEBG})`,
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
          <Carousel height={200} dragFree slideGap="md" align="start" withControls={false} withIndicators>
            <Carousel.Slide><CarouselPaper description={"Be the change that you wish to see in the world."} /></Carousel.Slide>
            <Carousel.Slide><CarouselPaper description={"The only way to do great work is to love what you do."} /></Carousel.Slide>
            <Carousel.Slide><CarouselPaper description={"Success is not final, failure is not fatal: It is the courage to continue that counts."} /></Carousel.Slide>
          </Carousel>
          <Box
            style={{ display: 'flex', justifyContent: 'center', zIndex: 50 }}
          >
            <Link to={`/survey`}>
              <PrimaryButton>Start answering your well-being</PrimaryButton>
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
