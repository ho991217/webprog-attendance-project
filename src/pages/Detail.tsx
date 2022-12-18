import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Link, useParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { infoAtom } from "../atom/infoAtom";
import Spinner from "../components/Spinner";
import getSeoulInfo from "../hooks/getSeoulInfo";
import useWindowDimensions from "../hooks/useWindowDimensions";
import { PopulationType } from "../props/populationType";

const Container = styled.div`
  width: 100vw;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  scroll-behavior: smooth;
  overflow-y: scroll;
  background-color: #ed7547;
  > * {
    max-width: 1400px;
  }
`;

const InnerContainer = styled.div`
  width: 100%;
  display: grid;

  @media (min-width: 601px) {
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: 0.8fr 1.15fr 1fr;
    grid-gap: 15px;
    padding: 15px;
    grid-template-areas:
      "homeButton header header header"
      "news news news weatherInfo"
      "trafficInfo trafficInfo trafficInfo trafficInfo";
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 3fr 3fr 2fr 4fr;
    grid-gap: 15px;
    padding: 15px;
    grid-template-areas:
      "homeButton"
      "header"
      "news"
      "weatherInfo"
      "trafficInfo";
  }
`;

const Cell = styled.div`
  background-color: #f1f1f1;
  border-radius: 10px;
  display: flex;
  padding: 0 15px;
  @media (max-width: 600px) {
    height: 100%;
  }
  @media (min-width: 601px) {
    height: 200px;
  }
`;

const HomeButtonCell = styled(Cell)`
  grid-area: homeButton;
  justify-content: center;
  align-items: center;
  height: 100%;
  transition: all 0.2s ease-in-out;
  :hover {
    background-color: #434343;
  }
`;

const BackHome = styled(Link)`
  color: inherit;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  transition: all 0.2s ease-in-out;
  color: #434343;
  :hover {
    color: #fff;
  }
  span {
    @media (max-width: 600px) {
      font-size: 2rem;
      margin: 10px 0;
    }
    @media (min-width: 601px) {
      font-size: 3rem;
    }
  }
`;

const HeaderCell = styled(Cell)`
  grid-area: header;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const Header = styled.header`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  > * {
    margin: 0 10px;
  }
`;

const H1 = styled.h1`
  @media (max-width: 600px) {
    font-size: 2rem;
  }
  @media (min-width: 601px) {
    font-size: 2rem;
  }

  font-weight: 800;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const LevelBar = styled.div<{ level?: string }>`
  display: flex;
  align-items: center;
  font-size: 0.7rem;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.7);
  margin-top: 10px;
  div {
    margin: 0 10px;
    border-radius: 9999px;
    @media (max-width: 600px) {
      width: 100px;
      height: 10px;
    }
    @media (min-width: 601px) {
      width: 200px;
      height: 10px;
    }
    background: ${({ level, theme }) => `linear-gradient(
      90deg,
      ${theme.colors.gradient[level || "정보 없음"]}
    )`};
  }
`;

const H2 = styled.h2`
  @media (max-width: 600px) {
    font-size: 0.9rem;
    padding: 0 5px;
  }
  @media (min-width: 601px) {
    padding: 0 25px;
    font-size: 1rem;
  }
  margin-bottom: 10px;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.7);
`;

const RefreshTime = styled.p`
  @media (max-width: 600px) {
    font-size: 0.8rem;
  }
  @media (min-width: 601px) {
    font-size: 0.8rem;
  }
  font-weight: 300;
  color: rgba(0, 0, 0, 0.5);
`;

const WeatherInfoCell = styled(Cell)`
  grid-area: weatherInfo;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const NewsCell = styled(Cell)`
  grid-area: news;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0 20px;
  height: 100%;
`;

const TrafficInfoCell = styled(Cell)`
  grid-area: trafficInfo;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Table = styled.table``;
const TableHead = styled.thead``;
const TableHeadCell = styled.th`
  color: #ed7547;
  font-weight: 400;
`;

const TableBody = styled.tbody`
  font-size: 0.9rem;
`;

const TableRow = styled.tr`
  display: grid;
  @media (max-width: 600px) {
    grid-template-columns: 0.7fr 2fr 10fr;
  }
  @media (min-width: 601px) {
    grid-template-columns: 0.7fr 2fr 1.5fr 10fr;
    margin-bottom: 5px;
    padding-bottom: 5px;
    border-bottom: 1px solid #ed76474e;
  }
`;

const TableData = styled.td`
  width: 100%;
  text-align: center;
  word-break: normal;
  line-height: 1.2em;
  :last-child {
    text-align: left;
  }
`;

const Detail = () => {
  const { place } = useParams();
  const [seoulInfo] = useRecoilState<PopulationType[]>(infoAtom);
  const [thisInfo, setThisInfo] = useState<PopulationType>();
  const { width } = useWindowDimensions();

  useEffect(() => {
    if (seoulInfo.length === 0 && place) {
      getSeoulInfo(place).then((data) => {
        setThisInfo(data);
      });
      return;
    }
    setThisInfo(seoulInfo.find((v) => v.area_name === place));
  }, [place, seoulInfo]);

  // useEffect(() => {
  //   if (thisInfo) {
  //     console.log(thisInfo.news);
  //   }
  // }, [thisInfo]);

  return (
    <>
      <Helmet>
        <meta name="theme-color" content="#EA6A3F" />
      </Helmet>
      <Container>
        <InnerContainer>
          <HomeButtonCell>
            <BackHome to="/">
              <span className="material-symbols-outlined">home</span>
            </BackHome>
          </HomeButtonCell>
          <HeaderCell>
            <Header>
              <H1>
                {place}
                <LevelBar level={thisInfo?.cong_status.level}>
                  {thisInfo?.cong_status.min ?? "-"} 명
                  <div />
                  {thisInfo?.cong_status.max ?? "-"} 명
                </LevelBar>
              </H1>
              <H2>{thisInfo?.cong_status.message ?? "로딩중..."}</H2>
              <RefreshTime>
                갱신 시간 : {thisInfo?.cong_status.time ?? "-"}
              </RefreshTime>
            </Header>
          </HeaderCell>
          <NewsCell>
            <H2>뉴스</H2>
            {/** 모바일의 경우, 날짜를 뺴고 보여주며, 상위 두 개의 뉴스만 보여 줌 */}
            {thisInfo ? (
              width > 600 ? (
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableHeadCell>상태</TableHeadCell>
                      <TableHeadCell>날짜</TableHeadCell>
                      <TableHeadCell>내용</TableHeadCell>
                      <TableHeadCell>현황</TableHeadCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {thisInfo?.news
                      .slice(0)
                      .reverse()
                      .map((news, index) => {
                        if (index > 2) return null;
                        return (
                          <TableRow>
                            <TableData>{news.command}</TableData>
                            <TableData>{news.time}</TableData>
                            <TableData>
                              {news.warn_val} {news.warn_stress}
                            </TableData>
                            <TableData>{news.warn_msg}</TableData>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              ) : (
                <div style={{ lineHeight: 1.2 }}>
                  [{thisInfo?.news[0].warn_val} {thisInfo.news[0].warn_stress}]{" "}
                  {thisInfo?.news[0].warn_msg}
                </div>
              )
            ) : (
              <Spinner />
            )}
          </NewsCell>
          <WeatherInfoCell>
            {thisInfo?.weather.pcp_type}
            {thisInfo?.weather.pcp_msg}
          </WeatherInfoCell>
          <TrafficInfoCell>
            {thisInfo?.traffic_status.avg.level}
          </TrafficInfoCell>
        </InnerContainer>
      </Container>
    </>
  );
};

export default Detail;
