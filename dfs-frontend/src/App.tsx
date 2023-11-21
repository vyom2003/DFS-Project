// Libs
import React, {createContext} from "react";

// Components
// tsignore
import { Navbar } from "./components";
import {
  Home,
  Footer,
  About,
  Team,
  Architecture,
  Datasets,
  Contact,
  HomePage,
  ModelPage,
  ReviewPage,
  UploadPage,
  CommentsPage,
  RequestPage,
  DatasetVersionPage,
  Fileupload,
  Verify,
  AddDataset,
  AddDataModel,
  Tnc,
  TncEdit,
  ModelViewer,
  MyModelsPage,
  Groups,
  Group,
  FilePermission,
  Discussion,
  Discussions,
  Me,
  UserStats,
} from "./containers";
import { View } from "./components/styled/View";
import AddDomainForm from "./AddDomainForm";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SignInForm from "./components/login/SignInForm";
import SignUpForm from "./components/login/SignUpForm";
import { ToastComponent } from "./packages/toasts/Toast"; 
import { useToast } from "./packages/hooks/useToast"

// constants
import { TOAST_VARIANTS } from "./packages/toasts/constants";

// styles
import "./App.css";
import CartPage from "./components/cart/cartPage";
import SuccessPage from "./components/cart/successPage";

type ToastContext = {
  addToast: (a : {message : string, variant : TOAST_VARIANTS }) => void;
}

export const ToastContext = createContext<ToastContext>({addToast : ({message, variant}) => {}});

const App = () => {

  const { toastData, addToast, deleteToast } = useToast();

  return (
    <Router>
      <div className="App">
        <div className="navbar__bg" style={{ position: "sticky", top: 0 }}>
          <Navbar />
        </div>
        <ToastContext.Provider value={{addToast}}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/team" element={<Team />} />
            <Route path="/architecture" element={<Architecture />} />
            <Route path="/datasets" element={<Datasets />} />
            <Route path="/dataModels" element={<ModelPage />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/sign-in" element={<SignInForm />} />
            <Route path="/sign-up" element={<SignUpForm />} />
            <Route path="/review" element={<ReviewPage />} />
            <Route path="/my-data" element={<HomePage />} />
            <Route path="/upload-page" element={<UploadPage />} />
            <Route path="/comments" element={<CommentsPage />} />
            <Route path="/request" element={<RequestPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/successPage" element={<SuccessPage />} />
            <Route
              path="/dataset-versions/:dataset_id"
              element={<DatasetVersionPage />}
            />
            <Route path="/fileupload/:dataset_id" element={<Fileupload />} />
            <Route path="/fileupload/:dataset_id/:dataset_name" element={<Fileupload />} />
            <Route path="/verify" element={<Verify />} />
            <Route path="/add-dataset" element={<AddDataset />} />
            <Route path="/add-dataModel" element={<AddDataModel />} />
            <Route path="/tnc/:target_id" element={<Tnc />} />
            <Route path="/tnc-edit/:target_id" element={<TncEdit />} />
            <Route path="/get-dataset-id/:target_id" element={<Tnc />} />
            <Route path="/view-model/:model_id" element={<ModelViewer />} />
            <Route
              path="/dataset-version/:filename"
              element={<FilePermission />}
            />
            <Route path="/domain" element={<AddDomainForm />} />
            <Route path="/models" element={<MyModelsPage />} />
            <Route path="/groups" element={<Groups />} />
            <Route path="/discussions/:group_id" element={<Discussions />} />
            <Route path="/discussion/:discussion_id" element={<Discussion />} />
            <Route path="/group/:group_id" element={<Group />} />
            <Route path="/view-styles" element={<View />}></Route>
            <Route path="/me" element={<Me />}></Route>
            <Route path="/user-stats/:dataset_id" element={<UserStats />}></Route>
          </Routes>
        </ToastContext.Provider>
        <ToastComponent toastData={toastData} deleteToast={deleteToast} />
        <Footer />
      </div>
    </Router>
  );
}

export default App;