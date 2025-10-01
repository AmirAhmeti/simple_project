import { useEffect } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import {
  Button, FormControl, FormErrorMessage, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Stack
} from '@chakra-ui/react'

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().min(1, 'Email is required').email('Invalid email'),
  company: z.string().optional()
})

export type AddUserFormValues = z.infer<typeof schema>

interface Props {
  isOpen: boolean
  onClose: () => void
  onSubmit: (values: AddUserFormValues) => void
}

export default function AddUserModal({ isOpen, onClose, onSubmit }: Props) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<AddUserFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', email: '', company: '' }
  })

  useEffect(() => {
    if (!isOpen) reset()
  }, [isOpen, reset])

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add New User</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody>
            <Stack gap={4}>
              <FormControl isInvalid={!!errors.name}>
                <FormLabel>Name</FormLabel>
                <Input placeholder="Jane Doe" {...register('name')} />
                <FormErrorMessage>{errors.name && errors.name.message}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!errors.email}>
                <FormLabel>Email</FormLabel>
                <Input type="email" placeholder="jane@example.com" {...register('email')} />
                <FormErrorMessage>{errors.email && errors.email.message}</FormErrorMessage>
              </FormControl>
              <FormControl>
                <FormLabel>Company</FormLabel>
                <Input placeholder="Acme Inc" {...register('company')} />
              </FormControl>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button mr={3} variant="ghost" onClick={onClose}>Cancel</Button>
            <Button colorScheme="teal" type="submit" isLoading={isSubmitting}>Add</Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}


