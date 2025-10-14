import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Header from "./components/Header/Header.jsx";
import Dashboard from "./components/Home/Dashboard.jsx";
import ServicosInternos from "./components/Home/Deploys/ServicosInternos.jsx";
import Relatorio from "./components/Home/Deploys/Relatorios/Relatorio.jsx";
import ChamadosSemana from "./components/Home/Deploys/Relatorios/ChamadosSemana.jsx";
import Testes from "./components/Home/TestesAutomatizados/Testes.jsx";

const App = () => {
  return (
    <>
      <div className="containerGeral">
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="/" element={<Dashboard />}>
              <Route index element={<ServicosInternos />} />
              <Route path="testes" element={<Testes />} />
              <Route path="relatorioDeploy" element={<Relatorio />} />
              <Route
                path="relatorioChamados"
                element={<ChamadosSemana />}
              />{" "}
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
};

export default App;
