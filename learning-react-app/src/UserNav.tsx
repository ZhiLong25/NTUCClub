'use client'
import React, { useState, useEffect, MouseEvent } from "react"
import {
    Box,
    Flex,
    Text,
    IconButton,
    Button,
    Stack,
    Collapse,
    Icon,
    Popover,
    PopoverTrigger,
    PopoverContent,
    useColorModeValue,
    MenuButton,
    useDisclosure,
    ChakraProvider,
    Avatar,
    Menu
} from '@chakra-ui/react'
import {
    HamburgerIcon,
    CloseIcon,
    ChevronDownIcon,
    ChevronRightIcon,
} from '@chakra-ui/icons'
import http from "./http"

export default function UserNav() {

    interface User {
        id: string;
        // other user properties
        profilePicture: string
        userType: String
    }


    const { isOpen, onToggle } = useDisclosure()
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        if (localStorage.getItem("accessToken")) {
            http.get('/user/auth').then((res) => {
                console.log(res.data.user)
                setUser(res.data.user);
            });
        }
    }, []);

    const logout = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        console.log("Loggedout")
        localStorage.clear();
        window.location.assign("/");
    };

    interface NavItem {
        label: string
        subLabel?: string
        children?: Array<NavItem>
        href?: string;


    }

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
                    subLabel: 'Update your card details',
                    href: '/addCard',
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
                    subLabel: 'Ask us any questions',
                    href: '/AddQueries',
                },

            ],
        },
        {
            label: 'Hire Designers',
            href: '#',
        },
    ] : []
    const linkColor = useColorModeValue('gray.600', 'gray.200')
    const linkHoverColor = useColorModeValue('gray.800', 'white')
    const popoverContentBgColor = useColorModeValue('white', 'gray.800')
    return (
        <ChakraProvider >
            <Box>
                <Flex
                    bg={useColorModeValue('white', 'gray.800')}
                    color={useColorModeValue('gray.600', 'white')}
                    minH={'60px'}
                    py={{ base: 2 }}
                    px={{ base: 4 }}
                    borderBottom={1}
                    borderStyle={'solid'}
                    borderColor={useColorModeValue('gray.200', 'gray.900')}
                    align={'center'}>
                    <Flex
                        flex={{ base: 1, md: 'auto' }}
                        ml={{ base: -2 }}
                        display={{ base: 'flex', md: 'none' }}>
                        <IconButton
                            onClick={onToggle}
                            icon={isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />}
                            variant={'ghost'}
                            aria-label={'Toggle Navigation'}
                        />
                    </Flex>
                    <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }}>
                        <Text
                            // textAlign={useBreakpointValue({ base: 'center', md: 'left' })}
                            fontFamily={'heading'}
                            color={useColorModeValue('gray.800', 'white')}>
                            Logo
                        </Text>
                        {/* desktop */}
                        <Flex display={{ base: 'none', md: 'flex' }} ml={10}>
                            <Stack direction={'row'} spacing={4}>
                                {NAV_ITEMS.map((navItem) => (
                                    <Box key={navItem.label}>
                                        <Popover trigger={'hover'} placement={'bottom-start'}>
                                            <PopoverTrigger>
                                                <Box
                                                    as="a"
                                                    p={2}
                                                    href={navItem.href ?? '#'}
                                                    fontSize={'sm'}
                                                    fontWeight={500}
                                                    color={linkColor}
                                                    _hover={{
                                                        textDecoration: 'none',
                                                        color: linkHoverColor,
                                                    }}>
                                                    {navItem.label}
                                                </Box>
                                            </PopoverTrigger>

                                            {navItem.children && (
                                                <PopoverContent
                                                    border={0}
                                                    boxShadow={'xl'}
                                                    bg={popoverContentBgColor}
                                                    p={4}
                                                    rounded={'xl'}
                                                    minW={'sm'}>
                                                    <Stack>
                                                        {navItem.children.map((child) => (
                                                            <DesktopSubNav key={child.label} {...child} />
                                                        ))}
                                                    </Stack>
                                                </PopoverContent>
                                            )}
                                        </Popover>
                                    </Box>
                                ))}
                            </Stack>
                        </Flex>
                    </Flex>

                    <Stack flex={{ base: 1, md: 0 }} justify={'flex-end'} direction={'row'} spacing={6}>
                        <Menu>
                            <MenuButton
                                as={Button}
                                rounded={'full'}
                                variant={'link'}
                                cursor={'pointer'}
                                minW={0}>
                                {user?.userType}
                            </MenuButton>
                            <MenuButton
                                as={Button}
                                rounded={'full'}
                                variant={'link'}
                                cursor={'pointer'}
                                onClick={logout}
                                minW={0}>
                                <Button
                                    size={'sm'}

                                >Log Out</Button>
                            </MenuButton>
                            <MenuButton
                                as={Button}
                                rounded={'full'}
                                variant={'link'}
                                cursor={'pointer'}
                                minW={0}>
                                <Avatar
                                    size={'sm'}
                                    // src={`${import.meta.env.VITE_FILE_BASE_URL}${user?.profilePicture}`}
                                />
                            </MenuButton>
                        </Menu>
                    </Stack>
                </Flex>
                {/* Mobile Nav */}
                <Collapse in={isOpen} animateOpacity>

                    <Stack bg={useColorModeValue('white', 'gray.800')} p={4} display={{ md: 'none' }}>
                        {NAV_ITEMS.map((navItem) => (
                            <MobileNavItem key={navItem.label} {...navItem} />
                        ))}
                    </Stack>

                </Collapse>
            </Box>
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