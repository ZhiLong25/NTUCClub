'use client'
import React, { useState, useEffect, MouseEvent } from "react"
import { Box, Flex, Text, Stack, Collapse, Icon, useColorModeValue, useDisclosure, ChakraProvider } from '@chakra-ui/react'
import { ChevronDownIcon, ChevronRightIcon } from '@chakra-ui/icons'
import http from "./http"
import { CloseRounded, LogoutRounded, MenuRounded, PersonRounded, ShoppingCart } from "@mui/icons-material"
import { Link } from "react-router-dom"
import MyTheme from "./themes/MyTheme"
import { ThemeProvider, IconButton, Avatar } from "@mui/material"
import { DesktopNav, MobileNav, NavItem, User, logoURL, logout } from "./pages/constant"



export default function UserNav() {
    const { isOpen, onToggle } = useDisclosure()
    const [user, setUser] = useState<User | null>(null);

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


    const NAV_ITEMS: Array<NavItem> = user ? [
        {
            label: 'Account',
            children: [
                {
                    label: 'User Account',
                    subLabel: 'Update your personal details',
                    href: user ? `/updateprofile/${user.id}` : '/login',
                },
                {
                    label: 'Card Information',
                    subLabel: 'View your card details',
                    href: '/manageCard',
                },

            ],
        },
        {
            label: 'Vouchers',
            children: [
                {
                    label: 'Find Vouchers',
                    subLabel: 'To get activites at a discounted price, click here!',
                    href: '/viewVouchers',
                },


            ],
        },
        {
            label: 'FAQ',
            children: [
                {
                    label: 'Send Query',
                    subLabel: 'Ask us any questions(slow but more detailed reply)',
                    href: '/AddQueries',
                },
                {
                    label: 'Chat Bot',
                    subLabel: 'Ask us any questions(chatting with our AI',
                    href: '/FAQ',
                },

            ],
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
                            <Link to={"/cart"}>
                                <IconButton aria-label={'Toggle Cart'} color="primary">
                                    <ShoppingCart />
                                </IconButton>
                            </Link>
                            <Link to={"/"}>
                                <IconButton aria-label={'Toggle Logout'} color="primary" onClick={logout}>
                                    <LogoutRounded />
                                </IconButton>
                            </Link>
                            <Link to={"/cart"}>
                                {user?.profilePicture
                                    ? <Avatar alt="Profile Picture" src={`${import.meta.env.BASE_URL}${user?.profilePicture}`} />
                                    : <Avatar><PersonRounded /></Avatar>}
                            </Link>
                        </Stack>
                    </Flex>



                    {/* MOBILE NAV */}
                    <Collapse in={isOpen} animateOpacity>
                        <MobileNav items={NAV_ITEMS} />
                    </Collapse>
                </Box>
            </ThemeProvider>
        </ChakraProvider>
    )
}

