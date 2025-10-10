import React from "react";
import "./App.css";
import Relatorio from "./components/Relatorio.jsx";
import Header from "./components/Header/Header.jsx";
import Dashboard from "./components/Home/Dashboard.jsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Email from "./components/Home/Deploys/Email.jsx";
import Testes from "./components/Home/TestesAutomatizados/Testes.jsx";
import ChamadosSemana from "./components/ChamadosSemana.jsx"; // import do novo componente

const App = () => {
  return (
    <>
      <div className="containerGeral">
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="/" element={<Dashboard />}>
              <Route index element={<Email />} />
              <Route path="testes" element={<Testes />} />
              <Route path="relatorioDeploy" element={<Relatorio />} />
              <Route path="relatorioChamados" element={<ChamadosSemana />} /> {/* nova rota */}
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
};

export default App;
