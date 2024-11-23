import { styled } from "styled-components";

export const SubmitBtn = styled.button`
  width: fit-content;
  padding: 0.75rem 6rem;
  border-radius: 0.75rem;
  color: white;
  background-color: #00b031;
  /* margin: 0 auto;
	margin-top: 2rem; */

  @media (max-width: 768px) {
    padding: 0.5rem 2rem;
  }

  &:hover {
    background: #00b031;
    outline: 2px solid #9ad2aa;
  }

  &:disabled {
    background-color: grey;
  }
`;
