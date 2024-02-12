import { Stack, Flex, Text, Icon, Popover, Box, PopoverTrigger, PopoverContent, useColorModeValue, useDisclosure, Collapse } from "@chakra-ui/react";
import React from "react";
import { Link } from "react-router-dom";
import { ChevronRightIcon } from '@chakra-ui/icons'
import { ListItemButton, ListItemIcon, ListItemText, List, Button } from "@mui/material";
import { ExpandLessRounded, ExpandMoreRounded, FamilyRestroomRounded, FlightRounded, LocalDiningRounded, SpaRounded, SportsBasketballRounded, SubdirectoryArrowRightRounded } from "@mui/icons-material";

// VARIABLES
export const logoURL = '/assets/logo.png'


// INTERFACE
export interface User { id: string, profilePicture: string, userType: string }
export interface NavItem { label: string, subLabel?: string, children?: NavItem[], href?: string }

export const sampleCategoryItems = [
  {
    title: "Dine & Wine",
    icon: <LocalDiningRounded />,
  },
  {
    title: "Family Bonding",
    icon: <FamilyRestroomRounded />,
  },
  {
    title: "Hobbies & Wellness",
    icon: <SpaRounded />,
  },
  {
    title: "Sport & Advanture",
    icon: <SportsBasketballRounded />,
  },
  {
    title: "Travel",
    icon: <FlightRounded />,
  }
]

const GetCategoryCodeName = (inputString) => {
  return inputString.replace(/[^a-zA-Z]+/g, '');
}

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
            children.map((child, i) => (
              <Link to={child.href ?? "#"} key={i}>
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

const logout = (event: React.MouseEvent<HTMLButtonElement>) => {
  console.log("Logout")
  event.preventDefault();
  localStorage.clear();
  window.location.assign("/");
};

const CheckIfDataIsArray = (data: any) => {
  try {
    if (Array.isArray(data)) {
      return data
    } else {
      const checkIfArray = JSON.parse(data);
      return checkIfArray
    }
  }
  catch {
    return []
  }
}

export const sortList = [
  {
    title: "Recently Added",
    value: 'recentlyadded',
  },
  {
    title: "Alphabetically (A to Z)",
    value: 'atoz',
  },
  {
    title: "Alphabetically (Z to A)",
    value: 'ztoa'
  },
  {
    title: "Price: Low to High",
    value: 'priceAsc'
  },
  {
    title: "Price: High to Low",
    value: 'priceDesc'
  },
]

export const sampleExperienceItems = [
  {
    "id": 1,
    "image": "https://avionrx.blob.core.windows.net/avalon/899e398c-dce7-4935-b3f8-934a9d76faa1?v=20240108052937",
    "name": "Good Old Days Asian Dinner Buffet (Adult)",
    "description": "Good Old Days Food Court will delight you and your loved ones with its diverse range of tantalising local favourites",
    "category": "Dine & Wine",
    "price": 25,
    "memPrice": 20,
    "timeSlots": "12:00",
    "slots": 12,
    "vendor": "Vendor1",
    "createdAt": "2024-02-01T23:53:51",
    "updatedAt": "2024-02-01T23:53:51",
    "categoryID": 4,
    "catName": null
  },
  {
    "id": 2,
    "image": "https://avionrx.blob.core.windows.net/avalon/831ab6d4-dbdf-431c-b737-f4163f42d6dd",
    "name": "4-Hour Guided Mangrove Kayaking Adventure",
    "description": "The journey begins with a short length of open sea kayaking before entering the mangroves. You will immediately notice a sharp difference between the choppy open sea waves and tranquil calm waters among the mangroves.",
    "category": "Hobbies & Wellness",
    "price": 105.84,
    "memPrice": 65,
    "timeSlots": "10:00",
    "slots": 10,
    "vendor": "Vendor2",
    "createdAt": "2024-02-01T23:53:28",
    "updatedAt": "2024-02-01T23:53:28",
    "categoryID": 5,
    "catName": null
  },
  {
    "id": 3,
    "image": "https://avionrx.blob.core.windows.net/avalon/49899df7-6dc8-4a1f-a8e9-73e61c9e3020",
    "name": "5D4N BALI Fairfield By Marriott Legian By Garuda Airlines (Special Dep 2024)",
    "description": "Discover a relaxed tropical getaway at Fairfield by Marriott Bali Legian with easy access to Bali's best nightlife like JA'AN, La Favela, Motel Mexicola, Cafe del Mar, and attractions, such as Double Six beach and Beachwalk Shopping Centers.",
    "category": "Travel",
    "price": 778,
    "memPrice": 728,
    "vendor": "Vendor2",
  },
  {
    "id": 4,
    "image": "https://avionrx.blob.core.windows.net/avalon/b27964ca-1400-44b5-8681-12ae21b8b171",
    "name": "Private Yacht Rental (inclusive of BBQ pit usage onboard)",
    "description": "Set off into the sparkling sea as you enjoy hours of fun under the sun with your private party.",
    "category": "Hobbies & Wellness",
    "price": 699,
    "memPrice": 529,
    "vendor": "Vendor2"
  },
  {
    "id": 5,
    "image": "https://avionrx.blob.core.windows.net/avalon/39969f1f9f404fcead7aa07736a0d5cb",
    "name": "Songkran Kids Festival Weekend Splash Pass!",
    "description": "Elephant Themed Inflatables, Dance Parties, DJ Tryouts, Water Fights, Splash Activities and more!",
    "category": "Travel",
    "price": 50,
    "memPrice": null,
    "vendor": "Vendor2"
  },
  {
    "id": 6,
    "image": "https://avionrx.blob.core.windows.net/avalon/2ec3d4af-a94c-488a-afb3-b2f3e10ebceb",
    "name": "Sentosa 4D AdventureLand 2-in-1 Special",
    "description": "Sentosa's high-tech interactive entertainment zone is home to a diverse and exciting collection of highly sensorial experiences at Imbiah Lookout.",
    "category": "Hobbies & Wellness",
    "price": 26.50,
    "memPrice": 25,
    "vendor": "Vendor2"
  },
  {
    "id": 7,
    "image": "https://avionrx.blob.core.windows.net/avalon/439e7272-987c-47a5-8092-37219efad251",
    "name": "2D1N Talula Hill Farm Stay",
    "description": "Embark on an enchanting journey to Kluang, a quaint town with a blend of modernity and tradition.",
    "category": "Travel",
    "price": 228,
    "memPrice": null,
    "vendor": "Vendor2"
  }
]


export {
  DesktopNav,
  DesktopSubNav,
  MobileNav,
  MobileNavItem,
  CheckIfDataIsArray,
  logout,
  GetCategoryCodeName
}
