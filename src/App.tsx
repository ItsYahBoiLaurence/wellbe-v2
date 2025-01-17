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

function App() {
  return (
    <BrowserRouter>
      <MantineProvider theme={theme} stylesTransform={emotionTransform}>

        <MantineEmotionProvider>
          <QueryClientProvider client={queryClient}>
            {/* <AuthProvider> */}
            {/* <ProfileProvider> */}
            <Authentication>
              <ModalsProvider>
                <Routes />
              </ModalsProvider>
            </Authentication>
            {/* </ProfileProvider> */}
            {/* </AuthProvider> */}
          </QueryClientProvider>
        </MantineEmotionProvider>
      </MantineProvider>
    </BrowserRouter>
  );
}

export default App;
