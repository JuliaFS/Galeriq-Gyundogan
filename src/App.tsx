//import { useState } from 'react';
import Login from "./components/Login/Login";
import "./index.css";
import Register from "./components/Register/Register";
import { Route, Routes } from "react-router-dom";
import { Path } from "./constants/constants";
import Home from "./components/Home/Home";
import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import CreatePicture from "./components/CreatePicture/CreatePicture";
import Gallery from "./components/Gallery/Gallery";
import PictureDetails from "./components/PictureDetails/PictureDetails";
import EditPicture from "./components/EditPicture/EditPicture";
import Profile from "./components/Profile/Profile";

export default function App() {

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-purple-200 flex sm:flex-col lg:flex-row z-50">
        <Header />
      </header>

      <main className="flex items-center justify-center flex-1 overflow-y-auto">
        <Routes>
          <Route path={Path.Home} element={<Home />} />
          <Route path={Path.Gallery} element={<Gallery />} />
          {/*<Route element={<RegUsersGuard />}>*/}
          <Route>
            <Route path={Path.Login} element={<Login />} />
            <Route path={Path.Register} element={<Register />} />
          </Route>
          <Route path={Path.Details} element={<PictureDetails />} />

          <Route>
            <Route path={Path.CreatePicture} element={<CreatePicture />} />
            <Route path={Path.PictureEdit} element={<EditPicture />} />
            <Route path={Path.UserProfile} element={<Profile />} />
            {/*<Route path={Path.Logout} element={<Logout />} />*/}
          </Route>
          {/*<Route path={Path.Error404Path} element={<PageNotFound />} />*/}
        </Routes>
      </main>
      <footer className="bg-purple-200 flex sm:flex-col lg:flex-row sm:justify-center items-center sm:p-2 lg:p-4">
        <Footer />
      </footer>
    </div>
  );
}
