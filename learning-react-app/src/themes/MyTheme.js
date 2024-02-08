import { createTheme } from '@mui/material/styles';


// BUILT THEME HERE: https://zenoo.github.io/mui-theme-creator/
const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#e81515',
        },
        secondary: {
            main: '#fddc02',
        },
    },
    shape: {
        borderRadius: 5,
    },
    typography: {
        button: {
            textTransform: "none",
        },
    },
});

export default theme;