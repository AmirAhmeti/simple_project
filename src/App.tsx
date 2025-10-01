import { Container, Flex, Heading, IconButton, Spacer, useColorMode } from '@chakra-ui/react'
import { Routes, Route, Link as RouterLink } from 'react-router-dom'
import { MoonIcon, SunIcon } from '@chakra-ui/icons'
import UsersPage from './pages/UsersPage'
import UserDetailsPage from './pages/UserDetailsPage'

export default function App() {
  const { colorMode, toggleColorMode } = useColorMode()
  return (
    <Container maxW="7xl" py={6}>
      <Flex as="header" align="center" gap={4} mb={6}>
        <Heading size="lg" as={RouterLink} to="/">Users</Heading>
        <Spacer />
        <IconButton aria-label="toggle color mode" onClick={toggleColorMode} icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />} />
      </Flex>
      <Routes>
        <Route path="/" element={<UsersPage />} />
        <Route path="/users/:id" element={<UserDetailsPage />} />
      </Routes>
    </Container>
  )
}


