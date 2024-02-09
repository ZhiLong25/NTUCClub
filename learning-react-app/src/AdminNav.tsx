'use client'
import MyTheme from "./themes/MyTheme"
import React, { useState, useEffect, MouseEvent } from "react"
import { Box, Flex, Stack, Collapse, useColorModeValue, useDisclosure, ChakraProvider } from '@chakra-ui/react'
import http from "./http"
import { ThemeProvider, Avatar, Button, IconButton } from "@mui/material"
import { DesktopNav, DesktopSubNav, MobileNav, MobileNavItem, NavItem, User, logoURL } from "./pages/constant"
import { Link } from "react-router-dom"
import { AccountCircleRounded, CloseRounded, LogoutRounded, MenuRounded, PersonRounded, ShoppingCart, ShoppingCartRounded } from "@mui/icons-material"



export default function AdminNav() {
    const { isOpen, onToggle } = useDisclosure()
    const [user, setUser] = useState<User | null>(null);
    const linkColor = useColorModeValue('gray.600', 'gray.200')
    const linkHoverColor = useColorModeValue('gray.800', 'white')
    const popoverContentBgColor = useColorModeValue('white', 'gray.800')

    useEffect(() => {
        if (localStorage.getItem("accessToken")) {
            http.get('/user/auth')
                .then((res) => {
                    console.log(res.data.user)
                    setUser(res.data.user);
                })
                .catch((err) => {
                    console.error(err)
                })
        }
    }, []);

    const logout = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        console.log("Loggedout")
        localStorage.clear();
        // window.location.assign("/");
    };



    const NAV_ITEMS: Array<NavItem> = user ? [
        {
            label: 'Account',
            children: [
                {
                    label: 'Account',
                    subLabel: 'Update your personal details',
                    href: user ? `/updateprofile/${user.id}` : '/login',
                },
                {
                    label: 'Add admin',
                    subLabel: 'Add admin accounts',
                    href: '/Addadmin',
                },
                {
                    label: 'Add Merchant',
                    subLabel: 'Add Merchant accounts',
                    href: '/AddMerchant',
                },
                {
                    label: 'Admin dashboard',
                    subLabel: 'View all accounts',
                    href: '/Accounts',
                },

            ],
        },
        {
            label: 'Vouchers',
            children: [
                {
                    label: 'Voucher Dashboard',
                    subLabel: 'View vouchers for users',
                    href: '/voucherDashboard',
                },
                {
                    label: 'Add Voucher',
                    subLabel: 'Add vouchers for users',
                    href: '/addVouchers',
                },

            ],
        },
        {
            label: 'Queries',
            children: [
                {
                    label: 'View Queries',
                    subLabel: 'View Queries for Admin',
                    href: '/ViewQueries',
                },

            ],
        },
        {
            label: 'Learn Design',
            href: '#',
        },
        {
            label: 'Hire Designers',
            href: '#',
        },
    ] : []


    return (
        <ChakraProvider>
            <ThemeProvider theme={MyTheme}>
                <Box>
                    <Flex
                        minH={'60px'}
                        py={{ base: 2 }}
                        px={{ base: 4 }}
                        borderBottom={1}
                        align={'center'}
                        borderStyle={'solid'}
                        justifyContent={"space-between"}
                        bg={useColorModeValue('white', 'gray.800')}
                        color={useColorModeValue('gray.600', 'white')}
                        borderColor={useColorModeValue('gray.200', 'gray.900')}
                        gridTemplateColumns={{ base: "1fr 1fr 1fr", md: "1fr 1fr" }}
                        display={"grid"}
                    >
                        <Box display={{ base: "block", md: "none" }}>
                            <IconButton color="primary" onClick={onToggle} aria-label={'Toggle Navigation'} style={{ justifyContent: "flex-start" }}>
                                {isOpen ? <CloseRounded /> : <MenuRounded />}
                            </IconButton>
                        </Box>

                        <Box display={"flex"} alignItems={"center"} justifyContent={{ base: "center", md: "flex-start" }} gap={"20px"} >
                            {/* <Link to={"/"}> */}
                            <img src={logoURL} id="navLogo" />
                            {/* </Link> */}
                            <Flex display={{ base: 'none', md: 'flex' }}>
                                <DesktopNav items={NAV_ITEMS} />
                            </Flex>
                        </Box>

                        <Stack flex={1} justify={'flex-end'} direction={'row'} spacing={2}>
                            <Link to={"/"}>
                                <IconButton aria-label={'Toggle Logout'} color="primary">
                                    <LogoutRounded />
                                </IconButton>
                            </Link>
                            <Link to={"/"}>
                                {user?.profilePicture
                                    ? <Avatar alt="Profile Picture" src={`${import.meta.env.BASE_URL}${user?.profilePicture}`} />
                                    : <Avatar><PersonRounded /></Avatar>}
                            </Link>
                        </Stack>
                    </Flex>

                    <Collapse in={isOpen} animateOpacity>
                        <MobileNav items={NAV_ITEMS} />
                    </Collapse>
                </Box>
            </ThemeProvider>
        </ChakraProvider>
    )
}
