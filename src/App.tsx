import "bootstrap/dist/css/bootstrap.min.css";
import "./style.css";
// import { Routes } from "react-router-dom";
import VNavbar from "./components/VNabar";
import Footer from "./components/Footer";
import { Route, Routes } from "react-router-dom";
import MainPage from "./pages/MainPage";
import RegistryManagement from "./pages/RegistryManagement";
import PacientRegistryForm from "./pages/PatientRegistryForm";
import ProfessionalRegistryForm from "./pages/ProfessionaLRegistryForm";
import ManufacturerRegistryForm from "./pages/ManufacturerRegistryForm";
import Support from "./pages/Support";
import Requests from "./pages/Requests";
import AddressForm from "./components/AddressForm";
import PersonForm from "./components/PersonForm";
import VaccinationForm from "./components/VaccineRegistryForm";
import VaccineManagement from "./components/VaccineManagement";

function App() {
  return (
    <>
      <VNavbar />
      <div id="root">
        <div className="main-content">
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/formVaccination" element={<VaccinationForm />} />
            <Route path="/vaccineManagement" element={<VaccineManagement />} />
            <Route
              path="/registrymanagement"
              element={<RegistryManagement />}
            />
            <Route path="/formPacient" element={<PacientRegistryForm />} />
            <Route
              path="/formProfessional"
              element={<ProfessionalRegistryForm />}
            />
            <Route
              path="/formManufacturer"
              element={<ManufacturerRegistryForm />}
            />
            <Route path="/formAddress" element={<AddressForm />} />
            <Route path="/formPerson" element={<PersonForm />} />
            <Route path="/support" element={<Support />} />
            <Route path="/requests" element={<Requests />} />
          </Routes>
        </div>
      </div>
      {/*<Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/registrymanagement" element={<RegistryManagement />} />
        <Route path="/formPacient" element={<PacientRegistryForm />} />
        <Route
          path="/formProfessional"
          element={<ProfessionalRegistryForm />}
        />
        <Route
          path="/formManufacturer"
          element={<ManufacturerRegistryForm />}
        />
        <Route path="/formAddress" element={<AddressForm />} />
        <Route path="/formPerson" element={<PersonForm />} />
        <Route path="/support" element={<Support />} />
        <Route path="/requests" element={<Requests />} />
      </Routes>*/}
      <Footer />
    </>
  );
}

export default App;
