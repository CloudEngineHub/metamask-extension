import React, { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { AddressQRCodeModal } from './address-qr-code-modal';
import { Button, Box } from '@metamask/design-system-react';

const meta: Meta<typeof AddressQRCodeModal> = {
  title: 'Components/MultichainAccounts/AddressQRCodeModal',
  component: AddressQRCodeModal,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof AddressQRCodeModal>;

export const Default: Story = {
  render: (args) => {
    const [isOpen, setIsOpen] = useState(true);

    return (
      <Box>
        <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
        <AddressQRCodeModal
          {...args}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        />
      </Box>
    );
  },
};
