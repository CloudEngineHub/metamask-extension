import React, { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { AddressQRCodeModal } from './address-qr-code-modal';
import { Button } from '@metamask/design-system-react';

// Mock store for Storybook
const mockStore = configureStore([]);
const store = mockStore({
  metamask: {
    currentLocale: 'en',
    localeMessages: {
      addressQrCodeModalTitle: { message: '$1 / $2' },
      addressQrCodeModalHeading: { message: '$1 Address' },
      addressQrCodeModalDescription: {
        message: 'Use this address to receive tokens and collectibles on $1',
      },
      viewOnExplorer: { message: 'View on Explorer' },
      viewAddressOnExplorer: { message: 'View address on $1' },
    },
    // Mock data for selectors
    internalAccounts: {
      accounts: {
        'ethereum-account-1': {
          id: 'ethereum-account-1',
          address: '0x1234567890123456789012345678901234567890',
          metadata: { name: 'Account 1', keyring: { type: 'HD Key Tree' } },
          type: 'eip155:eoa',
        },
        'solana-account-1': {
          id: 'solana-account-1',
          address: 'DYw8jCTfwHNRJhhmFcbXvVDTqWMEVFBX6ZKUmG5CNSKK',
          metadata: { name: 'Solana Account', keyring: { type: 'Snap Keyring' } },
          type: 'solana:mainnet',
        },
      },
    },
    networkConfigurationsByChainId: {
      '0x1': {
        chainId: '0x1',
        name: 'Ethereum Mainnet',
        nickname: 'Ethereum Mainnet',
        rpcEndpoints: [{
          networkClientId: 'mainnet',
          type: 'infura',
        }],
      },
      '0x89': {
        chainId: '0x89', 
        name: 'Polygon',
        nickname: 'Polygon',
        rpcEndpoints: [{
          networkClientId: 'polygon',
          type: 'infura',
        }],
      },
    },
    selectedNetworkClientId: 'mainnet',
  },
});

const meta: Meta<typeof AddressQRCodeModal> = {
  title: 'Components/MultichainAccounts/AddressQRCodeModal',
  component: AddressQRCodeModal,
  decorators: [
    (Story) => (
      <Provider store={store}>
        <Story />
      </Provider>
    ),
  ],
  argTypes: {
    address: {
      control: 'text',
      description: 'The address to display and generate QR code for',
    },
    chainId: {
      control: 'text',
      description: 'The chain ID for network image and explorer functionality',
    },
  },
};

export default meta;

type Story = StoryObj<typeof AddressQRCodeModal>;

// Mock account objects for different types
const mockEthereumAccount = {
  id: 'ethereum-account-1',
  address: '0x1234567890123456789012345678901234567890',
  metadata: {
    name: 'Account 1',
    keyring: { type: 'HD Key Tree' },
  },
  options: {},
  methods: [],
  type: 'eip155:eoa',
};

const mockSolanaAccount = {
  id: 'solana-account-1',
  address: 'DYw8jCTfwHNRJhhmFcbXvVDTqWMEVFBX6ZKUmG5CNSKK',
  metadata: {
    name: 'Solana Account',
    keyring: { type: 'Snap Keyring' },
  },
  options: {},
  methods: [],
  type: 'solana:mainnet',
};

const StoryWrapper = ({ children, ...args }: any) => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <AddressQRCodeModal
        {...args}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
};

export const EthereumMainnet: Story = {
  args: {
    address: '0x1234567890123456789012345678901234567890',
    chainId: '0x1',
    account: mockEthereumAccount,
  },
  render: (args) => <StoryWrapper {...args} />,
};

export const PolygonNetwork: Story = {
  args: {
    address: '0xabcdef1234567890abcdef1234567890abcdef12',
    chainId: '0x89',
    account: mockEthereumAccount,
  },
  render: (args) => <StoryWrapper {...args} />,
};

export const SolanaMainnet: Story = {
  args: {
    address: 'DYw8jCTfwHNRJhhmFcbXvVDTqWMEVFBX6ZKUmG5CNSKK',
    chainId: 'solana:mainnet',
    account: mockSolanaAccount,
  },
  render: (args) => <StoryWrapper {...args} />,
};

export const LongAccountName: Story = {
  args: {
    address: '0x9876543210987654321098765432109876543210',
    chainId: '0x1',
    account: {
      ...mockEthereumAccount,
      address: '0x9876543210987654321098765432109876543210',
      metadata: {
        ...mockEthereumAccount.metadata,
        name: 'My Very Long Account Name That Should Be Truncated Properly',
      },
    },
  },
  render: (args) => <StoryWrapper {...args} />,
};

export const ArbitrumNetwork: Story = {
  args: {
    address: '0x2468135790abcdef1234567890abcdef12345678',
    chainId: '0xa4b1',
    account: {
      ...mockEthereumAccount,
      address: '0x2468135790abcdef1234567890abcdef12345678',
      metadata: {
        ...mockEthereumAccount.metadata,
        name: 'Arbitrum Account',
      },
    },
  },
  render: (args) => <StoryWrapper {...args} />,
};

export const WithoutAccount: Story = {
  args: {
    address: '0x1111222233334444555566667777888899990000',
    chainId: '0x999',
    // No account prop provided
  },
  render: (args) => <StoryWrapper {...args} />,
};
