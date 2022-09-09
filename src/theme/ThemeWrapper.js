import React from 'react'
import {useSelector} from 'react-redux'
import {createMuiTheme, ThemeProvider} from "@material-ui/core/styles";

export const ThemeWrapper = ({children}) => {
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
                    color: '#3aa85a',
                    '& + $track': {
                        backgroundColor: '#26389e',
                        opacity: 1,
                        border: 'none',
                    },
                },
            },
            activeButtons: {
                background: '#3d5afe',
                color: '#fff',
                transition: '.41s 0s',
                '&:hover': {
                    backgroundColor: 'rgb(17, 82, 147)',
                    boxShadow: '0 1px 3px 0 rgb(60 64 67 / 30%), 0 4px 8px 3px rgb(60 64 67 / 15%)',
                },
            },
            checked: { // radius around circle
                color: 'green',
            },
            track: {},

            primary: {
                main: '#3d5afe',
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
        userPageWrapper: {
            minHeight: 'calc(100vh - 60px)',
            background: '#fff',
            overflow: 'hidden'
        },
        listItem: {
            // boxShadow: theme.palette.shadow.boxShadow,
            cursor: 'pointer',
            background: '#fff',
            // color: '#000',
            border: '1px solid #80808038',
            borderRadius: '6px',
            marginTop: '5px',
            '&:hover': {
                backgroundColor: '#e6dff0'
            }
        },
        customDivider: {
            margin: '.5rem 0',
            display: 'block',
            textAlign: 'center',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            '& > span': {
                position: 'relative',
                display: 'inline-block',
            },
            '& > span:before': {
                content: "''",
                position: 'absolute',
                top: '50%',
                width: '9999px',
                height: '1px',
                background: '#80808038',
                right: '100%',
                marginRight: '15px',
            },
            '& > span:after': {
                content: "''",
                position: 'absolute',
                top: '50%',
                width: '9999px',
                height: '1px',
                background: '#80808038',
                left: '100%',
                marginLeft: '15px',
            }
        },
    })

    const darkTheme = createMuiTheme({
        palette: {
            type: 'dark',
            topAndButtons: {
                background: '#424242',
                color: '#fff',
            },
            icons: {
                color: '#fff',
            },
            switchBase: {
                color: '#fafafa',
                '&$checked': {
                    transform: 'translateX(16px)',
                    color: '#a65cffb3',
                    '& + $track': {
                        backgroundColor: '#664b86',
                        opacity: 1,
                        border: 'none',
                    },
                },
            },
            activeButtons: {
                background: '#a65cffb3',
                color: '#fff',
                transition: '.41s 0s',
                    '&:hover': {
                        background: '#bb86fc',
                    }
            },
            checked: { // radius around circle
                color: '#a65cffb3',
            },
            track: {},

            primary: {
                main: '#03700B3',
            },
            secondary: {
                main: '#f48fb1',
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
        userPageWrapper: {
            minHeight: 'calc(100vh - 60px)',
            background: '#323435',
            overflow: 'hidden'
        },
        listItem: {
            // boxShadow: theme.palette.shadow.boxShadow,
            cursor: 'pointer',
            backgroundColor: '#323232',
            // color: '#fff',
            border: '1px solid #80808038',
            borderRadius: '6px',
            marginTop: '5px',
            '&:hover': {
                backgroundColor: '#424242',
            }
        },
        customDivider: {
            display: 'block',
            margin: '.5rem 0',
            textAlign: 'center',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            '& > span': {
                position: 'relative',
                display: 'inline-block',
            },
            '& > span:before': {
                content: "''",
                position: 'absolute',
                top: '50%',
                width: '9999px',
                height: '2px',
                background: 'rgba(255, 255, 255, 0.08)',
                right: '100%',
                marginRight: '15px',
            },
            '& > span:after': {
                content: "''",
                position: 'absolute',
                top: '50%',
                width: '9999px',
                height: '2px',
                background: 'rgba(255, 255, 255, 0.08)',
                left: '100%',
                marginLeft: '15px',
            }
        },
    })

    return (
        <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
            {children}
        </ThemeProvider>
    )

}