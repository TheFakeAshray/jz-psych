import type { ComponentProps } from 'react'
import { Slot } from 'radix-ui'
import styled, { css } from 'styled-components'

type Variant = 'primary' | 'secondary'

type ButtonProps = ComponentProps<'button'> & {
  variant?: Variant
  asChild?: boolean
}

export function Button({ variant = 'primary', asChild = false, type, ...props }: ButtonProps) {
  if (asChild) {
    return <StyledButton as={Slot.Root} $variant={variant} {...props} />
  }

  return <StyledButton type={type ?? 'button'} $variant={variant} {...props} />
}

const StyledButton = styled.button<{ $variant: Variant }>`
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

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  ${({ theme, $variant }) =>
    $variant === 'primary'
      ? css`
          background: ${theme.colors.primary};
          color: ${theme.colors.onPrimary};

          &:hover:not(:disabled) {
            background: ${theme.colors.primaryHover};
          }
        `
      : css`
          background: transparent;
          color: ${theme.colors.primary};
          border-color: ${theme.colors.primary};

          &:hover:not(:disabled) {
            background: ${theme.colors.primarySoft};
          }
        `}
`
