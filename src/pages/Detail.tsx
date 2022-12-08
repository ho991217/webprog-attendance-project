import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { infoAtom } from "../atom/infoAtom";
import getSeoulInfo from "../hooks/getSeoulInfo";
import { PopulationType } from "../props/populationType";

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ed7547;
`;

const InnerContainer = styled.div`
  width: 100%;
  height: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
`;

const Header = styled.header`
  @media (max-width: 600px) {
    height: 120px;
    margin: 0 10px;
  }
  width: 100%;
  height: 120px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #f1f1f1;
  border-bottom: 1px solid #ed7547;
  border-radius: 0 0 10px 10px;
`;

const H1 = styled.h1<{ congest_lv: string | undefined }>`
  font-size: 2rem;
  font-weight: 600;
  color: ${({ congest_lv }) =>
    congest_lv === "여유"
      ? "#00bfa5"
      : congest_lv === "보통"
      ? "#ffc107"
      : congest_lv === "혼잡"
      ? "#ff2222"
      : "#3a3a3a9c"};
  margin-bottom: 0.3em;
`;

const H3 = styled.h3`
  font-size: 1rem;
  font-weight: 400;
  color: #3a3a3a9c;
  word-break: keep-all;
  text-align: center;
`;

const Detail = () => {
  const { place } = useParams();
  const [seoulInfo] = useRecoilState<PopulationType[]>(infoAtom);
  const [thisInfo, setThisInfo] = useState<PopulationType>();

  useEffect(() => {
    setThisInfo(seoulInfo.find((v) => v.area_name === place));
  }, []);
  return (
    <Container>
      <InnerContainer>
        <Header>
          <H1 congest_lv={thisInfo?.status.area_congestion_level}>{place}</H1>
          <H3>{thisInfo?.status.area_congestion_message}</H3>
        </Header>
        <Link to="/">home</Link>
        <div>갱신 시간 : {thisInfo?.status.time}</div>
        <div>단위 시간 최대 인구 : {thisInfo?.status.area_population_max} 명</div>
        <div>단위 시간 최소 인구 : {thisInfo?.status.area_population_min} 명</div>
      </InnerContainer>
    </Container>
  );
};

export default Detail;
