import { useRecoilState } from "recoil";
import styled from "styled-components";
import { searchAtom } from "../atom/searchAtom";

const Input = styled.input`
  position: sticky;
  z-index: 99;
  width: 100%;
  top: 10px;
  height: 50px;
  border: none;
  border-radius: 10px;
  padding: 0 20px;
  background-color: rgb(193, 193, 193);
  transition: all 0.2s ease-in-out;
  :focus {
    outline: none;
    background-color: rgb(212, 212, 212);
    transform: scale(1.01) translateY(1px);
  }
`;

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useRecoilState(searchAtom);

  return (
    <Input
      placeholder="검색어를 입력하세요."
      value={searchTerm}
      onChange={(e) => {
        e.preventDefault();
        setSearchTerm(e.target.value);
      }}
    />
  );
};

export default SearchBar;
