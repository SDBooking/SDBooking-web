import styled from "styled-components";

export const CancelBtn = styled.button`
  width: fit-content;
  padding: 0.75rem 6rem;
  border-radius: 0.75rem;
  color: #68010e;
  background-color: #f6d2d6;
  /* margin: 0 auto;
	margin-top: 2rem; */

  @media (max-width: 768px) {
    padding: 0.5rem 2rem;
  }

  &:hover {
    color: white;
    background-color: #b91a2f;
  }

  &:disabled {
    color: white;
    background-color: grey;
  }
`;
