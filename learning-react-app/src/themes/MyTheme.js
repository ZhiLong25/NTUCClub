import { createTheme } from '@mui/material/styles';


// BUILT THEME HERE: https://zenoo.github.io/mui-theme-creator/
const innerMainBorderRadius = "5px!important"
const mainBorderRadius = "10px!important"

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
                    borderRadius: innerMainBorderRadius,
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: mainBorderRadius,
                    height: "100%"
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: mainBorderRadius,
                },
            },
        },
        MUIDataTable: {
            styleOverrides: {
                root: {
                    borderRadius: mainBorderRadius
                }
            }
        },
        MuiPaper: {
            styleOverrides:{
                root:{
                    borderRadius: mainBorderRadius
                }
            }
        }
    },
});

export default theme;