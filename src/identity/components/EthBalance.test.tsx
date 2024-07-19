import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { getRoundedAmount } from '../../internal/utils/getRoundedAmount';
import { useGetETHBalance } from '../../wallet/core/useGetETHBalance';
import { EthBalance } from './EthBalance';
import { useIdentityContext } from './IdentityProvider';

function mock<T>(func: T) {
  return func as vi.Mock;
}

const silenceError = () => {
  const consoleErrorMock = vi
    .spyOn(console, 'error')
    .mockImplementation(() => {});
  return () => consoleErrorMock.mockRestore();
};

vi.mock('./IdentityProvider', () => ({
  useIdentityContext: vi.fn(),
}));

vi.mock('../../wallet/core/useGetETHBalance', () => ({
  useGetETHBalance: vi.fn(),
}));

vi.mock('../../internal/utils/getRoundedAmount', () => ({
  getRoundedAmount: vi.fn(),
}));

const useIdentityContextMock = mock(useIdentityContext);
const useGetEthBalanceMock = mock(useGetETHBalance);

describe('EthBalance', () => {
  const testIdentityProviderAddress = '0xIdentityAddress';
  const testEthBalanceComponentAddress = '0xEthBalanceComponentAddress';
  it('should throw an error if no address is provided', () => {
    useIdentityContextMock.mockReturnValue({ address: null });

    const restore = silenceError();
    expect(() =>
      render(<EthBalance address={undefined} className="" />),
    ).toThrow(
      'Address: an Ethereum address must be provided to the Identity or EthBalance component.',
    );
    restore();
  });

  it('should display the balance if provided', () => {
    const balance = 1.23456789;
    useIdentityContextMock.mockReturnValue({ address: null });
    useGetEthBalanceMock.mockReturnValue({
      convertedBalance: balance,
      error: null,
    });
    (getRoundedAmount as vi.Mock).mockReturnValue('1.2346');

    render(
      <EthBalance
        address={testEthBalanceComponentAddress}
        className="custom-class"
      />,
    );

    expect(screen.getByText('1.2346 ETH')).toBeInTheDocument();
  });

  it('should return null if balance is undefined or there is an error', () => {
    useIdentityContextMock.mockReturnValue({ address: null });
    useGetEthBalanceMock.mockReturnValue({
      convertedBalance: undefined,
      error: 'Error message',
    });

    const { container } = render(
      <EthBalance
        address={testEthBalanceComponentAddress}
        className="custom-class"
      />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('use identity context address if provided', () => {
    const balance = 1.23456789;
    useIdentityContextMock.mockReturnValue({
      address: testIdentityProviderAddress,
    });
    useGetEthBalanceMock.mockReturnValue({
      convertedBalance: balance,
      error: null,
    });
    (getRoundedAmount as vi.Mock).mockReturnValue('1.2346');

    render(<EthBalance className="custom-class" />);

    expect(useGetEthBalanceMock).toHaveBeenCalledWith(
      testIdentityProviderAddress,
    );
  });

  it('use component address over identity context if both are provided', () => {
    const balance = 1.23456789;
    useIdentityContextMock.mockReturnValue({
      address: testIdentityProviderAddress,
    });
    useGetEthBalanceMock.mockReturnValue({
      convertedBalance: balance,
      error: null,
    });
    (getRoundedAmount as vi.Mock).mockReturnValue('1.2346');

    render(
      <EthBalance
        className="custom-class"
        address={testEthBalanceComponentAddress}
      />,
    );

    expect(useGetEthBalanceMock).toHaveBeenCalledWith(
      testEthBalanceComponentAddress,
    );
  });
});
