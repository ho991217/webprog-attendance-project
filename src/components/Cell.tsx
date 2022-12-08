import { Link } from "react-router-dom";
import styled from "styled-components";
import useWindowDimensions from "../hooks/useWindowDimensions";
import { PopulationType } from "../props/populationType";

interface CellProps {
  props: PopulationType;
  id: number;
}

const rightChevron = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 384 512"
    width="1.5em"
    fill="white"
  >
    <path d="M342.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L274.7 256 105.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z" />
  </svg>
);

const Container = styled.li`
  // 모바일
  @media (max-width: 600px) {
    height: 120px;
    margin: 10px 0;
  }
  margin: 15px 0;
  height: 200px;
  width: 100%;
  background-color: #ed7547;
  border-radius: 10px;
  list-style: none;
`;

const Wrapper = styled(Link)`
  @media (max-width: 600px) {
    padding: 0 25px;
  }
  all: unset;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 60px;
`;

const LeftSection = styled.div`
  @media (max-width: 600px) {
    height: 100%;
  }
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
`;

const Title = styled.h2`
  @media (max-width: 600px) {
    font-size: 1.5rem;
    margin-bottom: 5px;
  }
  @media (min-width: 601px) {
    font-size: 3rem;
    margin-bottom: 15px;
  }
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: space-between;
  font-weight: 600;
  color: #fff;
`;

const Comment = styled.p`
  @media (max-width: 600px) {
    font-size: 0.7rem;
    word-break: keep-all;
    line-height: 1.3em;
  }
  @media (min-width: 601px) {
    font-size: 1.2rem;
  }
  font-weight: 300;
  color: #ffffffab;
`;

const HorizontalLine = styled.div`
  height: 1px;
  flex-grow: 1;
  margin: 0 10px;
  background-color: rgba(255, 255, 255, 0.3);
  border: 0.5px solid rgba(255, 255, 255, 0.3);
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const CongestionLevelContainer = styled.div`
  display: flex;
  align-items: center;
`;

const CongestionLevel = styled.div<{ level: string }>`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${({ level }) =>
    level === "여유" ? "#00bfa5" : level === "보통" ? "#ffc107" : "#ff2222"};
  margin-right: 10px;
`;

const CongestionLevelText = styled.p`
  margin-right: 20px;
  font-size: 1.2rem;
  font-weight: 600;
  color: #fff;
  transform: translateY(-0.1em);
`;

const Cell = ({ props, id }: CellProps) => {
  const { width } = useWindowDimensions();
  return (
    <Container key={id}>
      <Wrapper to={`/detail/${props.area_name}`}>
        <LeftSection>
          <Title>
            {props.area_name}
            <HorizontalLine />
          </Title>
          <Comment>{props.status.area_congestion_message}</Comment>
        </LeftSection>
        <RightSection>
          {width > 600 && (
            <CongestionLevelContainer>
              <CongestionLevel level={props.status.area_congestion_level} />
              <CongestionLevelText>
                {props.status.area_congestion_level}
              </CongestionLevelText>
            </CongestionLevelContainer>
          )}
          {rightChevron}
        </RightSection>
      </Wrapper>
    </Container>
  );
};

export default Cell;
