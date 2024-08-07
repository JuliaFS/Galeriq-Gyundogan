//import { useState } from 'react';
import Login from "./components/Login/Login";
import "./index.css";
import Register from "./components/Register/Register";
import { Route, Routes } from "react-router-dom";
import { Path } from "./constants/constants";
import Home from "./components/Home/Home";
import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";

export default function App() {
  //const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="flex flex-col h-screen">
      <header className="fixed top-0 left-0 right-0 bg-orange-500 flex">
        <Header />
      </header>

      <main className="flex-grow bg-yellow-500">
        <Routes>
          <Route path={Path.Home} element={<Home />} />
          {/*<Route path={Path.Gallery} element={<PicturesList />} />*/}
          {/*<Route element={<RegUsersGuard />}>*/}
          <Route>
            <Route path={Path.Login} element={<Login />} />
            <Route path={Path.Register} element={<Register />} />
          </Route>
          {/*<Route path={Path.Details} element={<PictureDetails />} />*/}

          {/*<Route>*/}
          {/*<Route path={Path.CreatePicture} element={<CreatePicture />} />*/}
          {/*<Route path={Path.PictureEdit} element={<EditPicture />} />*/}
          {/*<Route path={Path.Logout} element={<Logout />} />*/}
          {/*</Route>*/}
          {/*<Route path={Path.Error404Path} element={<PageNotFound />} />*/}
        </Routes>
      </main>
      <footer className="bg-orange-500 flex">
        <Footer />
      </footer>
    </div>
  );
}
