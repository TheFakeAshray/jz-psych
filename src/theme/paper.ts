import { css } from 'styled-components'
import grain from '../assets/paper-grain.png'

// Sparse lighter-terracotta flecks over whatever colour the page already is.
// Repeats, and moves with whichever element paints it, so a sliding view
// carries the grain with it.
export const paperTexture = css`
  background-image: url(${grain});
  background-repeat: repeat;
  background-size: 256px 256px;
  background-blend-mode: soft-light;
`
