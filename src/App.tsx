import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import { emotionTransform, MantineEmotionProvider } from '@mantine/emotion';
import { QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { theme } from './theme';
import queryClient from './queryClient';
import Routes from './Routes';
import { Authentication } from './contexts/Authentication'
import { ModalsProvider } from '@mantine/modals';
import '@mantine/notifications/styles.css';
import { Notifications } from '@mantine/notifications';
import '@mantine/carousel/styles.css';


function App() {
  return (
    <BrowserRouter>
      <MantineProvider theme={theme} stylesTransform={emotionTransform}>
        <MantineEmotionProvider>
          <QueryClientProvider client={queryClient}>
            <Authentication>
              <ModalsProvider>
                <Notifications />
                <Routes />
              </ModalsProvider>
            </Authentication>
          </QueryClientProvider>
        </MantineEmotionProvider>
      </MantineProvider>
    </BrowserRouter>
  );
}

export default App;
