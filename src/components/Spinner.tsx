import styled from "styled-components";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 50px 0;
`;

const Circles = styled.div`
  display: flex;
  justify-content: center;
  overflow: visible;
`;

const Ellipse = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  overflow: hidden;
  background-color: #ed764776;
  margin: 0 5px;
  :nth-child(1) {
    animation: 1s ease-in-out 0s infinite spin;
  }

  :nth-child(2) {
    animation: 1s ease-in-out 0.2s infinite spin;
  }

  :nth-child(3) {
    animation: 1s ease-in-out 0.4s infinite spin;
  }

  @keyframes spin {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.5);
    }
    100% {
      transform: scale(1);
    }
  }
`;

const Spinner = () => {
  return (
    <Container>
      <Circles>
        <Ellipse />
        <Ellipse />
        <Ellipse />
      </Circles>
    </Container>
  );
};

export default Spinner;
