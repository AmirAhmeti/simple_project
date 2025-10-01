import { useMemo } from 'react'
import { useParams, Link as RouterLink } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store/store'
import { Box, Button, Card, CardBody, CardHeader, Heading, Stack, Text } from '@chakra-ui/react'

export default function UserDetailsPage() {
  const { id } = useParams()
  const user = useSelector((s: RootState) => s.users.items.find(u => String(u.id) === id))

  const address = useMemo(() => {
    const a = user?.address
    if (!a) return '-'
    return `${a.street}, ${a.suite}, ${a.city}, ${a.zipcode}`
  }, [user])

  if (!user) {
    return (
      <Stack>
        <Text>User not found. It might be loading or deleted.</Text>
        <Button as={RouterLink} to="/" colorScheme="teal">Back</Button>
      </Stack>
    )
  }

  return (
    <Card>
      <CardHeader>
        <Heading size="md">{user.name}</Heading>
      </CardHeader>
      <CardBody>
        <Stack>
          <Box>
            <Text><b>Email:</b> {user.email}</Text>
            <Text><b>Phone:</b> {user.phone ?? '-'}</Text>
            <Text><b>Website:</b> {user.website ?? '-'}</Text>
            <Text><b>Address:</b> {address}</Text>
          </Box>
          <Button as={RouterLink} to="/" colorScheme="teal" alignSelf="start">Back to list</Button>
        </Stack>
      </CardBody>
    </Card>
  )
}


