import { createTheme } from '@mui/material/styles';


// BUILT THEME HERE: https://zenoo.github.io/mui-theme-creator/
const borderRadius = "5px!important"
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
    components: {
        MuiListItemButton: {
            styleOverrides: {
                root: {
                    borderRadius: borderRadius,
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: "10px!important",
                    height: "100%"
                },
            },
        }
    },
});

export default theme;