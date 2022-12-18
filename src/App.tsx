import { RecoilRoot } from "recoil";
import { ThemeProvider } from "styled-components";
import Router from "./pages/Router";
import { GlobalStyle } from "./styles/GlobalStyle";
import { theme } from "./styles/theme";

const App = () => (
  <RecoilRoot>
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Router />
    </ThemeProvider>
  </RecoilRoot>
);

export default App;
