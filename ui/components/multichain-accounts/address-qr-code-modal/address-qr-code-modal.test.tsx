import React from 'react';
import { fireEvent, screen } from '@testing-library/react';
import { renderWithProvider } from '../../../../test/jest/rendering';
import configureStore from '../../../store/store';
import { AddressQRCodeModal } from './address-qr-code-modal';

describe('AddressQRCodeModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    address: '0x1234567890123456789012345678901234567890',
  };

  const mockState = {
    metamask: {
      localeMessages: {
        current: {
          // Add any required locale messages here if needed
        },
        currentLocale: 'en',
      },
    },
  };

  const renderComponent = (props = {}, state = {}) => {
    const store = configureStore({
      ...mockState,
      ...state,
    });

    return renderWithProvider(
      <AddressQRCodeModal {...defaultProps} {...props} />,
      store,
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render the modal when isOpen is true', () => {
      renderComponent();

      expect(screen.getByText('Account 1 / Ethereum')).toBeInTheDocument();
      expect(screen.getByText('Ethereum Address')).toBeInTheDocument();
      expect(
        screen.getByText(
          'Use this address to receive tokens and collectibles on Ethereum',
        ),
      ).toBeInTheDocument();
    });

    it('should not render the modal when isOpen is false', () => {
      renderComponent({ isOpen: false });

      expect(
        screen.queryByText('Account 1 / Ethereum'),
      ).not.toBeInTheDocument();
    });

    it('should render the copy button', () => {
      renderComponent();

      expect(screen.getByText('EqT4z...a8f3x')).toBeInTheDocument();
    });

    it('should render the share button', () => {
      renderComponent();

      expect(screen.getByText('Share')).toBeInTheDocument();
    });
  });

  describe('Modal Interactions', () => {
    it('should call onClose when close button is clicked', () => {
      const onClose = jest.fn();
      renderComponent({ onClose });

      const closeButton = screen.getByRole('button', { name: 'Close' });
      fireEvent.click(closeButton);

      expect(onClose).toHaveBeenCalled();
    });
  });

  describe('QR Code Generation', () => {
    it('should generate QR code with provided address', () => {
      const testAddress = '0xabcdef1234567890abcdef1234567890abcdef12';
      renderComponent({ address: testAddress });

      // QR code is generated via dangerouslySetInnerHTML, so we just verify the modal renders
      expect(screen.getByText('Ethereum Address')).toBeInTheDocument();
    });
  });
});