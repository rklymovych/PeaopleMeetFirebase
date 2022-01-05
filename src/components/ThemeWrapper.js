import React from 'react'
import {useSelector} from 'react-redux'
import {createMuiTheme, ThemeProvider} from "@material-ui/core/styles";
import green from "@material-ui/core/colors/green";
import {AuthProvider} from "../context/AuthContext";
import App from './App';


export const ThemeWrapper = () => {
    const {isDarkMode} = useSelector(state => state.user)

    const lightTheme = createMuiTheme({
        palette: {
            type: 'light',
            topAndButtons: {
                background: '#3d5afe',
                color: '#fff',
            },
            icons: {
                color: '#fff',
            },
            switchBase: {
                color: '#fafafa',
                '&$checked': {
                    transform: 'translateX(16px)',
                    color: '#3d5afe',
                    '& + $track': {
                        backgroundColor: '#3d5afe94',
                        opacity: 1,
                        border: 'none',
                    },
                },
            },
            checked: { // radius around circle
                color: '#3d5afe',
            },
            track: {},

            primary: {
                main: '#03700B3',
            },
            secondary: {
                main: green[500],
            },
            error: {
                main: '#f71324',
            },
            white: {
                main: '#000',
            },
            paddingTopZero: {
                paddingTop: '0!important'
            },
            shadow: {
                boxShadow: '0px 2px 1px -1px rgb(0, 0, 0, .2), 0px 1px 1px 0px rgb(0, 0, 0, 0.14), 0px 1px 3px 0px rgb(0, 0, 0, 0.12)',
            }
        },

    })

    const darkTheme = createMuiTheme({
        palette: {
            type: 'dark',
            topAndButtons: {
                background: '#3d5afe',
                color: '#fff',
            },
            icons: {
                color: '#fff',
            },
            switchBase: {
                color: '#fafafa',
                '&$checked': {
                    transform: 'translateX(16px)',
                    color: '#bb86fc',
                    '& + $track': {
                        backgroundColor: '#664b86',
                        opacity: 1,
                        border: 'none',
                    },
                },
            },
            checked: { // radius around circle
                color: '#bb86fc',
            },
            track: {},

            primary: {
                main: '#03700B3',
            },
            secondary: {
                main: green[500],
            },
            error: {
                main: '#f71324',
            },
            white: {
                main: '#000',
            },
            paddingTopZero: {
                paddingTop: '0!important'
            },
            shadow: {
                boxShadow: '0px 2px 1px -1px rgb(0, 0, 0, .2), 0px 1px 1px 0px rgb(0, 0, 0, 0.14), 0px 1px 3px 0px rgb(0, 0, 0, 0.12)',
            }
        },

    })
    console.log('theme',isDarkMode, darkTheme.palette)
    return (
        <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
            <AuthProvider>
                <App/>
            </AuthProvider>
        </ThemeProvider>
    )

}