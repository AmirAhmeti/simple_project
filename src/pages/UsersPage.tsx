import { useEffect, useMemo, useState } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from '@/store/store'
import { addUser, deleteUser, fetchUsers, updateUser, type User } from '@/store/usersSlice'
import {
  Box, Button, Card, CardBody, CardHeader, Divider, Flex, Grid, GridItem, HStack, Heading, IconButton, Input, Menu, MenuButton, MenuItem, MenuList, Select, Spinner, Stack, Table, Tbody, Td, Th, Thead, Tr, Text, Tag, useToast
} from '@chakra-ui/react'
import { AddIcon, ChevronDownIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons'
import AddUserModal, { type AddUserFormValues } from '@/components/AddUserModal'

type SortKey = 'name' | 'email' | 'company'

export default function UsersPage() {
  const dispatch = useDispatch<AppDispatch>()
  const { items, status, error } = useSelector((s: RootState) => s.users)
  const [query, setQuery] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('name')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
  const toast = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    if (status === 'idle') dispatch(fetchUsers())
  }, [status, dispatch])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const base = q
      ? items.filter(u =>
          u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
        )
      : items
    const sorted = [...base].sort((a, b) => {
      const aVal = sortKey === 'company' ? (a.company?.name || '') : (a as any)[sortKey] || ''
      const bVal = sortKey === 'company' ? (b.company?.name || '') : (b as any)[sortKey] || ''
      return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
    })
    return sorted
  }, [items, query, sortKey, sortDir])

  const [isAddOpen, setAddOpen] = useState(false)

  function handleAdd(values: AddUserFormValues) {
    const user: Omit<User, 'id'> = {
      name: values.name,
      email: values.email,
      company: values.company ? { name: values.company } : undefined
    }
    dispatch(addUser(user))
    toast({ title: 'User added locally', status: 'success' })
    setAddOpen(false)
  }

  function handleQuickEdit(user: User) {
    const newName = prompt('Update name', user.name)
    if (!newName) return
    dispatch(updateUser({ ...user, name: newName }))
  }

  function handleDelete(id: number) {
    dispatch(deleteUser(id))
  }

  return (
    <Stack gap={4}>
      <Card>
        <CardHeader>
          <Flex align="center" gap={3} wrap="wrap">
            <Heading size="md">Users</Heading>
            <Input placeholder="Search by name or email" value={query} onChange={e => setQuery(e.target.value)} maxW="sm" />
            <HStack>
              <Select value={sortKey} onChange={e => setSortKey(e.target.value as SortKey)} maxW="36"> 
                <option value="name">Name</option>
                <option value="email">Email</option>
                <option value="company">Company</option>
              </Select>
              <Select value={sortDir} onChange={e => setSortDir(e.target.value as any)} maxW="28">
                <option value="asc">Asc</option>
                <option value="desc">Desc</option>
              </Select>
            </HStack>
            <Button leftIcon={<AddIcon />} colorScheme="teal" onClick={() => setAddOpen(true)}>
              Add User
            </Button>
          </Flex>
        </CardHeader>
        <Divider />
        <CardBody>
          {status === 'loading' && <Spinner />}
          {status === 'failed' && <Text color="red.400">{error}</Text>}
          {status !== 'loading' && (
            <Box overflowX="auto">
              <Table size="sm" variant="simple">
                <Thead>
                  <Tr>
                    <Th>Name</Th>
                    <Th>Email</Th>
                    <Th>Company</Th>
                    <Th></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {filtered.map(u => (
                    <Tr key={u.id} _hover={{ bg: 'gray.50', cursor: 'pointer' }}>
                      <Td onClick={() => navigate(`/users/${u.id}`)}>{u.name}</Td>
                      <Td onClick={() => navigate(`/users/${u.id}`)}>{u.email}</Td>
                      <Td onClick={() => navigate(`/users/${u.id}`)}>{u.company?.name ?? '-'}</Td>
                      <Td>
                        <HStack>
                          <IconButton aria-label="edit" icon={<EditIcon />} size="sm" onClick={() => handleQuickEdit(u)} />
                          <IconButton aria-label="delete" icon={<DeleteIcon />} size="sm" colorScheme="red" onClick={() => handleDelete(u.id)} />
                        </HStack>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          )}
        </CardBody>
      </Card>
      <AddUserModal isOpen={isAddOpen} onClose={() => setAddOpen(false)} onSubmit={handleAdd} />
    </Stack>
  )
}


