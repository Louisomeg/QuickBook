import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: { main: '#6b5b95' },
    secondary: { main: '#feb236' },
    background: { default: '#f5f5f5' },
  },
  typography: {
    fontFamily: ['Inter', 'sans-serif'].join(','),
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
        },
      },
    },
  },
});

export default theme;