import React from 'react'
import styled from 'styled-components'

const Button = styled.button`
  display: inline-block;
  border-radius: 3px;
//   padding: 0.5rem 0;
  margin: 0.5rem 1rem;
  width: 11rem;
//   background: transparent;
  color: red;
  border: 2px solid white;
`
const SweetButton = ({text}) => (
    <Button
      href="https://github.com/styled-components/styled-components"
      target="_blank"
      rel="noopener"
    >
      {text}
    </Button>
)

export default SweetButton