'use client'
import React, { useState, useEffect, MouseEvent } from "react"
import { Box, Flex, Text, Stack, Collapse, Icon, useColorModeValue, useDisclosure, ChakraProvider } from '@chakra-ui/react'
import { ChevronDownIcon, ChevronRightIcon } from '@chakra-ui/icons'
import http from "./http"
import { CloseRounded, LogoutRounded, MenuRounded, PersonRounded, ShoppingCart } from "@mui/icons-material"
import { Link } from "react-router-dom"
import MyTheme from "./themes/MyTheme"
import { ThemeProvider, IconButton, Avatar } from "@mui/material"
import { DesktopNav, MobileNav, User, logoURL } from "./pages/constant"



export default function UserNav() {
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
        window.location.assign("/");
    };

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
                                <IconButton aria-label={'Toggle Logout'} color="primary">
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



const DesktopSubNav = ({ label, href, subLabel }: NavItem) => {
    return (
        <Box
            as="a"
            href={href}
            role={'group'}
            display={'block'}
            p={2}
            rounded={'md'}
            _hover={{ bg: useColorModeValue('pink.50', 'gray.900') }}>
            <Stack direction={'row'} align={'center'}>
                <Box>
                    <Text
                        transition={'all .3s ease'}
                        _groupHover={{ color: 'pink.400' }}
                        fontWeight={500}>
                        {label}
                    </Text>
                    <Text fontSize={'sm'}>{subLabel}</Text>
                </Box>
                <Flex
                    transition={'all .3s ease'}
                    transform={'translateX(-10px)'}
                    opacity={0}
                    _groupHover={{ opacity: '100%', transform: 'translateX(0)' }}
                    justify={'flex-end'}
                    align={'center'}
                    flex={1}>
                    <Icon color={'pink.400'} w={5} h={5} as={ChevronRightIcon} />
                </Flex>
            </Stack>
        </Box>
    )
}



const MobileNavItem = ({ label, children, href }: NavItem) => {
    const { isOpen, onToggle } = useDisclosure()

    return (
        <Stack spacing={4} onClick={children && onToggle}>
            <Box
                py={2}
                as="a"
                href={href ?? '#'}
                justifyContent="space-between"
                alignItems="center"
                _hover={{
                    textDecoration: 'none',
                }}>
                <Text fontWeight={600} color={useColorModeValue('gray.600', 'gray.200')}>
                    {label}
                </Text>
                {children && (
                    <Icon
                        as={ChevronDownIcon}
                        transition={'all .25s ease-in-out'}
                        transform={isOpen ? 'rotate(180deg)' : ''}
                        w={6}
                        h={6}
                    />
                )}
            </Box>

            <Collapse in={isOpen} animateOpacity style={{ marginTop: '0!important' }}>
                <Stack
                    mt={2}
                    pl={4}
                    borderLeft={1}
                    borderStyle={'solid'}
                    borderColor={useColorModeValue('gray.200', 'gray.700')}
                    align={'start'}>
                    {children &&
                        children.map((child) => (
                            <Box as="a" key={child.label} py={2} href={child.href}>
                                {child.label}
                            </Box>
                        ))}
                </Stack>
            </Collapse>
        </Stack>
    )
}

interface NavItem {
    label: string
    subLabel?: string
    children?: Array<NavItem>
    href?: string;
    onclick?: () => void;

}