import { AppShell, Box, Center, Stack, Tabs, Title, Text } from '@mantine/core';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import AppLogo from '../../assets/logo.svg';
import { useMediaQuery } from '@mantine/hooks';

const ROUTES = [
  { route: '/', label: 'Home' },
  { route: '/my-wellbe', label: 'My Wellbe' },
  { route: '/inbox', label: 'Inbox' },
  { route: '/profile', label: 'Profile' },
];

const Mobile = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <AppShell
      header={{
        height: 48,
      }}
      footer={{ height: 56 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      {/* <AppShell.Header
        style={{
          position: 'relative',
          zIndex: 20,
          padding: 16,
          border: 'none',
          backgroundColor: 'transparent',
        }}
      >
        <Center style={{ height: '100%' }}>
          <img src={AppLogo} alt="logo" height={29} />
        </Center>
      </AppShell.Header> */}

      <AppShell.Main
        style={{
          padding: 0,
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          minHeight: 0,
        }}
      >
        <Outlet />
      </AppShell.Main>

      <AppShell.Footer
        style={{
          position: 'relative',
          zIndex: 20,
          height: 56,
          borderTop: 'none',
        }}
      >
        <Tabs
          value={location.pathname}
          onChange={(value) => navigate(value!)}
          style={(t) => ({
            background: t.colors.darkGray[5],
            height: '100%',
            '& [role=tab]': {
              ':hover': {
                background: t.colors.darkGray[1],
              },
            },
            '& [dataActive]': {
              background: t.colors.darkGray[1],
            },
          })}
        >
          <Tabs.List
            style={{ height: '100%', '&::before': { border: 'none' } }}
            grow
          >
            {ROUTES.map((r) => (
              <Tabs.Tab
                key={r.route}
                value={r.route}
                style={(t) => ({
                  color: t.colors.gray[7],
                  border: 'none',
                  borderRadius: 0,
                })}
              >
                {r.label}
              </Tabs.Tab>
            ))}
          </Tabs.List>
        </Tabs>
      </AppShell.Footer>
    </AppShell>
  );
};

const DashboardLayout = () => {
  return (
    <Mobile />
  );
};

export default DashboardLayout;
