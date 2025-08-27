import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import qrCode from 'qrcode-generator';
import {
  Text,
  TextVariant,
  TextAlign,
  Button,
  IconName,
  ButtonVariant,
  ButtonSize,
  Box,
  BoxFlexDirection,
  BoxJustifyContent,
  BoxAlignItems,
  AvatarNetwork,
} from '@metamask/design-system-react';
import type { InternalAccount } from '@metamask/keyring-internal-api';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
} from '../../component-library';
import type { ModalProps } from '../../component-library';
import { useI18nContext } from '../../../hooks/useI18nContext';
import { shortenAddress } from '../../../helpers/utils/util';
import { useCopyToClipboard } from '../../../hooks/useCopyToClipboard';
import { getImageForChainId } from '../../../selectors/multichain';
import { getInternalAccountByAddress } from '../../../selectors/selectors';
import { getProviderConfig } from '../../../../shared/modules/selectors/networks';
import { getMultichainAccountUrl } from '../../../helpers/utils/multichain/blockExplorer';
import { openBlockExplorer } from '../../multichain/menu-items/view-explorer-menu-item';
import { getAccountTypeCategory } from '../../../pages/multichain-accounts/account-details';

// Constants for QR code generation
const QR_CODE_TYPE_NUMBER = 4;
const QR_CODE_CELL_SIZE = 5;
const QR_CODE_MARGIN = 16;
const QR_CODE_ERROR_CORRECTION_LEVEL = 'M';

type AddressQRCodeModalProps = Omit<
  ModalProps,
  'isOpen' | 'onClose' | 'children'
> & {
  isOpen: boolean;
  onClose: () => void;
  address: string;
  chainId: string;
  account?: InternalAccount;
};

export const AddressQRCodeModal: React.FC<AddressQRCodeModalProps> = ({
  isOpen,
  onClose,
  address,
  chainId,
  account,
}) => {
  const t = useI18nContext();
  const [copied, handleCopy] = useCopyToClipboard();

  // Get account and network info from selectors
  const accountInfo = useSelector((state) => getInternalAccountByAddress(state, address));
  const providerConfig = useSelector(getProviderConfig);
  const networkImageSrc = useSelector(() => getImageForChainId(chainId));
  
  const accountName = accountInfo?.metadata?.name || '';
  const networkName = providerConfig?.nickname || providerConfig?.name || '';
  const truncatedAddress = shortenAddress(address);

  // Generate QR code
  const qrImage = qrCode(QR_CODE_TYPE_NUMBER, QR_CODE_ERROR_CORRECTION_LEVEL);
  qrImage.addData(address);
  qrImage.make();

  const handleCopyClick = useCallback(() => {
    handleCopy(address);
  }, [address, handleCopy]);

  const getExplorerButtonText = (): string => {
    if (!account) {
      return t('viewOnExplorer');
    }

    switch (getAccountTypeCategory(account)) {
      case 'evm':
        return t('viewAddressOnExplorer', ['Etherscan']);
      case 'solana':
        return t('viewAddressOnExplorer', ['Solscan']);
      default:
        return t('viewOnExplorer');
    }
  };

  const handleExplorerNavigation = useCallback(() => {
    if (!account) {
      return;
    }

    const addressLink = getMultichainAccountUrl(address, {
      chainId,
      type: 'mainnet', // This should be determined based on the network
    });

    if (addressLink) {
      openBlockExplorer(addressLink, 'Address QR Code Modal');
    }
  }, [address, chainId, account]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader
          onClose={onClose}
          backButtonProps={{
            'data-testid': 'address-qr-code-modal-back-button',
          }}
        >
          {t('addressQrCodeModalTitle', [accountName, networkName])}
        </ModalHeader>
        <ModalBody>
          <Box flexDirection={BoxFlexDirection.Column} gap={4}>
            <Box
              className="relative flex"
              justifyContent={BoxJustifyContent.Center}
              alignItems={BoxAlignItems.Center}
            >
              <Box
                dangerouslySetInnerHTML={{
                  // TODO: Fix in https://github.com/MetaMask/metamask-extension/issues/31860
                  // eslint-disable-next-line @typescript-eslint/naming-convention
                  __html: qrImage.createTableTag(
                    QR_CODE_CELL_SIZE,
                    QR_CODE_MARGIN,
                  ),
                }}
                // Background and border must remain white regardless of theme
                className="bg-white border-4 border-white rounded-2xl"
              />

              <Box
                // Background and border must remain white regardless of theme
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-8 border-white bg-white rounded-xl flex"
                justifyContent={BoxJustifyContent.Center}
                alignItems={BoxAlignItems.Center}
              >
                <AvatarNetwork name={networkName} src={networkImageSrc} />
              </Box>
            </Box>
            <Text textAlign={TextAlign.Center} variant={TextVariant.HeadingSm}>
              {t('addressQrCodeModalHeading', [networkName])}
            </Text>
            <Text textAlign={TextAlign.Center}>
              {t('addressQrCodeModalDescription', [networkName])}
            </Text>

            <Box flexDirection={BoxFlexDirection.Column} gap={2}>
              <Button
                variant={ButtonVariant.Secondary}
                startIconName={copied ? IconName.CopySuccess : IconName.Copy}
                size={ButtonSize.Lg}
                isFullWidth
                onClick={handleCopyClick}
              >
                {truncatedAddress}
              </Button>
              <Button
                variant={ButtonVariant.Tertiary}
                size={ButtonSize.Lg}
                isFullWidth
                onClick={handleExplorerNavigation}
              >
                {getExplorerButtonText()}
              </Button>
            </Box>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
