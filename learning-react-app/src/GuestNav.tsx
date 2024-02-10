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


import { Link } from "react-router-dom"
import { Button, IconButton, ThemeProvider } from "@mui/material"
import { MenuRounded, CloseRounded } from "@mui/icons-material"
import MyTheme from "./themes/MyTheme"
import { DesktopNav, MobileNav, NavItem, logoURL } from "./pages/constant"

export default function GuestNav() {
  const { isOpen, onToggle } = useDisclosure()

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

            <Stack display={{ base: 'none', md: 'flex' }} flex={1} justify={'flex-end'} direction={'row'} spacing={2}>
              <Link to={"/login"}>
                <Button variant="text">Sign In</Button>
              </Link>
              <Link to={"/register"}>
                <Button variant="contained">Sign Up</Button>
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