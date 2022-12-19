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
    grid-template-rows: 1fr 3fr 3fr 4fr;
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
    font-size: 1.75rem;
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
  font-size: 0.2rem;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.7);
  margin-top: 10px;
  background-color: rgba(0, 0, 0, 0.15);
  padding: 4px 10px;
  border-radius: 9999px;
  div {
    margin: 0 10px;
    border-radius: 9999px;
    @media (max-width: 600px) {
      width: 100px;
      /* height: 10px; */
    }
    @media (min-width: 601px) {
      width: 200px;
      /* height: 10px; */
    }
    height: calc(100% + 8px);
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

const WeatherWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-weight: 400;

  span {
    color: #ed7547;
    margin-right: 5px;
    padding-top: 3px;
  }
`;

const HiLoWrapper = styled(WeatherWrapper)``;

const CurrentTempWrapper = styled(WeatherWrapper)``;

const SensibleTempWrapper = styled(WeatherWrapper)``;

const PcpWrapper = styled(WeatherWrapper)``;

const PcpMsgWrapper = styled(WeatherWrapper)``;

const TrafficInfoCell = styled(Cell)`
  grid-area: trafficInfo;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: scroll;
  @media (max-width: 600px) {
    padding-top: 25px;
    h2 {
      margin-bottom: 0;
    }
  }
`;

const TrafficWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 600px) {
    flex-direction: column;
    margin: 25px 0;
    justify-content: flex-start;
  }
`;

const AvgTrafficCircle = styled.div<{ level?: string }>`
  width: 100px;
  height: 100px;
  @media (max-width: 600px) {
    width: 80px;
    height: 80px;
  }
  @media (min-width: 601px) {
    margin-right: 10px;
  }
  font-weight: 500;
  color: #eee;
  border-radius: 50%;
  background-color: ${({ level }) =>
    level === "원활"
      ? "rgba(0,191,165,1)"
      : level === "서행"
      ? "rgba(255,165,0,1)"
      : level === "정체"
      ? "rgba(255,0,0,1)"
      : "rgba(0,0,0,0.1)"};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  font-size: 1.8rem;
  span {
    font-size: 0.75rem;
    margin-bottom: 2px;
  }
`;

const TrafficChartWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
    margin: 25px 0;
  }
`;

const RoadName = styled.div`
  font-weight: 500;
  font-size: 1.1rem;
  word-break: keep-all;
`;

const RoadCell = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  @media (max-width: 600px) {
    margin: 5px 0;
  }
  @media (min-width: 601px) {
    flex-direction: column;
    margin: 0 10px;
  }
`;

const RoadSpeed = styled.div`
  font-weight: 400;
  font-size: 0.8rem;
  @media (max-width: 600px) {
    margin: 0 5px;
  }
  @media (min-width: 601px) {
    margin: 2.5px 0 7px 0;
  }
  color: rgba(0, 0, 0, 0.5);
`;

const RoadLevel = styled.div<{ level?: string }>`
  font-weight: 400;
  font-size: 0.95rem;
  padding: 4px 12px 5px 12px;
  border-radius: 9999px;
  background-color: ${({ level }) =>
    level === "원활"
      ? "rgba(0,191,165,1)"
      : level === "서행"
      ? "rgba(255,165,0,1)"
      : level === "정체"
      ? "rgba(255,0,0,1)"
      : "rgba(0,0,0,0.1)"};
  color: #eee;
`;

const NewsCell = styled(Cell)`
  grid-area: news;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0 20px;
  height: 100%;
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
            <H2>날씨</H2>
            {thisInfo ? (
              <>
                <HiLoWrapper>
                  <span className="material-icons">schedule</span>
                  {"최저 " +
                    thisInfo?.weather.min_temp +
                    " ℃ ~ 최고 " +
                    thisInfo?.weather.max_temp +
                    " ℃"}
                </HiLoWrapper>
                <CurrentTempWrapper>
                  <span className="material-icons">thermostat</span>[ 현재 기온
                  ] {thisInfo?.weather.temp} ℃
                </CurrentTempWrapper>
                <SensibleTempWrapper>
                  <span className="material-icons">air</span>[ 체감 기온 ]{" "}
                  {thisInfo?.weather.sensibe_temp} ℃
                </SensibleTempWrapper>
                <PcpWrapper>
                  <span className="material-icons">cloud</span>
                  {thisInfo?.weather.pcp + " " + thisInfo?.weather.pcp_type}
                </PcpWrapper>
                <PcpMsgWrapper>
                  <span className="material-icons">umbrella</span>
                  {thisInfo?.weather.pcp_msg}
                </PcpMsgWrapper>
              </>
            ) : (
              <Spinner />
            )}
          </WeatherInfoCell>
          <TrafficInfoCell>
            <H2>정체 구간 정보 (상위 10개 정체 구간)</H2>
            <TrafficWrapper>
              <AvgTrafficCircle level={thisInfo?.traffic_status.avg.level}>
                <span>구간 평균</span>
                {thisInfo?.traffic_status.avg.level}
              </AvgTrafficCircle>
              <TrafficChartWrapper>
                {thisInfo?.traffic_status.roads
                  .slice(0)
                  .sort((a, b) => Number(a.speed) - Number(b.speed))
                  .slice(0, 10)
                  .map((road) => (
                    <RoadCell>
                      <RoadName>{road.name}</RoadName>
                      <RoadSpeed>{road.speed} km/h</RoadSpeed>
                      <RoadLevel level={road.level}>{road.level}</RoadLevel>
                    </RoadCell>
                  ))}
              </TrafficChartWrapper>
            </TrafficWrapper>
          </TrafficInfoCell>
        </InnerContainer>
      </Container>
    </>
  );
};

export default Detail;
