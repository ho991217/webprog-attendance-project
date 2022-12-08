import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { searchAtom } from "../atom/searchAtom";
import Cell from "../components/Cell";
import SearchBar from "../components/SearchBar";
import Spinner from "../components/Spinner";
import getSeoulInfo from "../hooks/getSeoulInfo";
import { places } from "../props/placeProps";
import { infoAtom } from "../atom/infoAtom";
import { PopulationType } from "../props/populationType";

const Main = styled.main`
  display: flex;
  position: relative;
  width: 100vw;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px 10px;
  > * {
    max-width: 1200px;
  }
`;

const CellContainer = styled.ul`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
`;

const Home = () => {
  const [seoulInfo, setSeoulInfo] = useRecoilState<PopulationType[]>(infoAtom);
  const [loading, setLoading] = useState<boolean>(true);
  const [search] = useRecoilState(searchAtom);

  const load = () => {
    if (seoulInfo.length === places.length) {
      return;
    }

    places.forEach((place) => {
      getSeoulInfo(place).then((data) => {
        setSeoulInfo((prev) => [...prev, data]);
      });
    });
  };

  const searchFilter = () => {
    const result = seoulInfo.filter((place) => {
      return (
        place.area_name.includes(search) || search.includes(place.area_name)
      );
    });

    const data = result.map((place) => (
      <Cell props={place} id={seoulInfo.indexOf(place)} />
    ));

    return data;
  };

  useEffect(() => {
    load();
  });

  useEffect(() => {
    if (seoulInfo.length === places.length) {
      setLoading(false);
    }
  }, [seoulInfo]);

  return (
    <Main>
      <SearchBar />
      <CellContainer>{searchFilter()}</CellContainer>
      {(loading || search) && <Spinner />}
    </Main>
  );
};

export default Home;
