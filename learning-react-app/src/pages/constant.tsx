import { Stack, Flex, Text, Icon, Popover, Box, PopoverTrigger, PopoverContent, useColorModeValue, useDisclosure, Collapse } from "@chakra-ui/react";
import React from "react";
import { Link } from "react-router-dom";
import { ChevronRightIcon } from '@chakra-ui/icons'
import { ListItemButton, ListItemIcon, ListItemText, List, Button } from "@mui/material";
import { ExpandLessRounded, ExpandMoreRounded, SubdirectoryArrowRightRounded } from "@mui/icons-material";

// VARIABLES
export const logoURL = './assets/logo.png'


// INTERFACE
export interface User { id: string, profilePicture: string, userType: string }
export interface NavItem { label: string, subLabel?: string, children?: NavItem[], href?: string }


const DesktopNav = ({ items }) => {
  return (
    <Stack direction={'row'} spacing={2}>
      {items.map((navItem: NavItem, i: number) => (
        <Box key={i}>
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
                minW={'sm'}
              >
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


const MobileNav = ({ items }) => {
  return (
    <List id="mobileNavList" aria-labelledby="nested-list-subheader">
      {items.map((navItem: NavItem, i: number) => (
        <MobileNavItem key={i} {...navItem} />
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


export {
  DesktopNav,
  DesktopSubNav,
  MobileNav,
  MobileNavItem
}
