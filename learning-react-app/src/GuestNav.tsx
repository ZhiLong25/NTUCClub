'use client'
import React from "react"
import {
  Box,
  Flex,
  Text,
  Stack,
  Collapse,
  Icon,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useColorModeValue,
  useBreakpointValue,
  useDisclosure,
  ChakraProvider
} from '@chakra-ui/react'


import { ChevronDownIcon, ChevronRightIcon } from '@chakra-ui/icons'
import { Link } from "react-router-dom"
import { Button, IconButton, List, ListItemButton, ListItemIcon, ListItemText, ListSubheader } from "@mui/material"
import { MenuRounded, CloseRounded, ExpandMoreRounded, SubdirectoryArrowRightRounded, ExpandLessRounded } from "@mui/icons-material"


export default function GuestNav() {
  const { isOpen, onToggle } = useDisclosure()

  return (
    <ChakraProvider>
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
        >
          <Box display={"flex"} alignItems={"center"} gap={"20px"} >
            <Link to={"/"}>
              <img src="./assets/logo.png" id="navLogo" />
            </Link>
            <Flex display={{ base: 'none', md: 'flex' }}>
              <DesktopNav />
            </Flex>
          </Box>

          <Stack display={{ base: 'none', md: 'flex' }} flex={1} justify={'flex-end'} direction={'row'} spacing={2}>
            <Link to={"/login"}>
              <Button variant="text">Sign In</Button>
            </Link>
            <Link to={"/register"}>
              <Button variant="contained">Sign Up</Button>
            </Link>
          </Stack>

          <Box display={{ base: 'block', md: 'none' }}>
            <IconButton color="primary" onClick={onToggle} aria-label={'Toggle Navigation'}>
              {isOpen ? <CloseRounded /> : <MenuRounded />}
            </IconButton>
          </Box>
        </Flex>

        <Collapse in={isOpen} animateOpacity>
          <MobileNav />
        </Collapse>
      </Box>
    </ChakraProvider>
  )
}

const DesktopNav = () => {
  return (
    <Stack direction={'row'} spacing={2}>
      {NAV_ITEMS.map((navItem) => (
        <Box key={navItem.label}>
          <Popover trigger={'hover'} placement={'bottom-start'}>
            <PopoverTrigger>
              <Link to={navItem.href ?? '#'}>
                <Button variant="text">{navItem.label}</Button>
              </Link>
            </PopoverTrigger>

            {navItem.children && (
              <PopoverContent
                border={0}
                boxShadow={'xl'}
                bg={useColorModeValue('white', 'gray.800')}
                p={4}
                rounded={'xl'}
                minW={'sm'}>
                <Stack>
                  {navItem.children.map((child) => (<DesktopSubNav key={child.label} {...child} />))}
                </Stack>
              </PopoverContent>
            )}
          </Popover>
        </Box>
      ))}
    </Stack>
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
      _hover={{ bg: useColorModeValue('pink.50', 'gray.900') }}
    >
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
          flex={1}
        >
          <Icon color={'pink.400'} w={5} h={5} as={ChevronRightIcon} />
        </Flex>
      </Stack>
    </Box>
  )
}

const MobileNav = () => {
  return (
    <List id="mobileNavList" aria-labelledby="nested-list-subheader">
      {NAV_ITEMS.map((navItem) => (
        <MobileNavItem key={navItem.label} {...navItem} />
      ))}
    </List>
  )
}

const MobileNavItem = ({ label, children, href }: NavItem) => {
  const { isOpen, onToggle } = useDisclosure()
  return (
    <>
      <Link to={href ?? "#"}>
        <ListItemButton onClick={children && onToggle}>
          <ListItemText primary={label} />
          {children ? isOpen ? <ExpandLessRounded /> : <ExpandMoreRounded /> : null}
        </ListItemButton>
      </Link>

      {children && <Collapse in={isOpen} unmountOnExit>
        <List component="div" disablePadding>
          {children &&
            children.map((child) => (
              <Link to={child.href ?? "#"}>
                <ListItemButton sx={{ pl: 4 }} >
                  <ListItemIcon><SubdirectoryArrowRightRounded /></ListItemIcon>
                  <ListItemText primary={child.label} />
                </ListItemButton>
              </Link>
            ))}
        </List>
      </Collapse>}
    </>
  )
}

interface NavItem {
  label: string
  subLabel?: string
  children?: Array<NavItem>
  href?: string
}

const NAV_ITEMS: Array<NavItem> = [
  {
    label: 'Home',
    href: '/',
  },
  {
    label: 'Experiences',
    href: '/experiences',
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
  }
]