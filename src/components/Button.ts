import styled, { css } from 'styled-components'

type Variant = 'primary' | 'secondary'

export const Button = styled.a<{ $variant?: Variant }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  padding: ${({ theme }) => `${theme.space[3]} ${theme.space[6]}`};
  border-radius: ${({ theme }) => theme.radii.pill};
  border: 1px solid transparent;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition:
    background-color 150ms ease,
    border-color 150ms ease;

  ${({ theme, $variant = 'primary' }) =>
    $variant === 'primary'
      ? css`
          background: ${theme.colors.primary};
          color: ${theme.colors.onPrimary};

          &:hover {
            background: ${theme.colors.primaryHover};
          }
        `
      : css`
          background: transparent;
          color: ${theme.colors.primary};
          border-color: ${theme.colors.primary};

          &:hover {
            background: ${theme.colors.primarySoft};
          }
        `}
`
