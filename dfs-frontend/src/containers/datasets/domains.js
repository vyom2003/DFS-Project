import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import download from "js-file-download";
import creds from "../../creds";
import { useNavigate } from "react-router-dom";
import ContentLoader from "react-content-loader";
import { DomainDataTombstone } from "../../components/tombstones/DomainDataTombstone";
import { ToastContext } from "../../App";
import { TOAST_VARIANTS } from "../../packages/toasts/constants";
import { Heading } from "../../components/styled/Text";

// const url= creds.backendUrl;
const url = creds.backendUrl;

export default function DomainData({ domain }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const { addToast } = useContext(ToastContext);

  const isLoggedIn = !!localStorage.getItem("dfs-user");
  const [data, setData] = useState([]);

  // const [cartItems, setCartItems] = useState([]);

  const Additem = async (itemID) => {
    let data = {
      ItemID: itemID,
      UserId: JSON.parse(localStorage.getItem("dfs-user")).user.user_email,
      versionId:null
    }
    // console.log(data)
    const response = await fetch(url + "cart", {
      method: "post",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })
    if (response.status == 200) {
      addToast({
        message: "Item Added to Cart",
        variant: TOAST_VARIANTS.SUCCESS
      });
      window.location.reload(false)
    } else if (response.status == 400) {
      addToast({
        message: "Item already in cart",
        variant: TOAST_VARIANTS.ERROR
      });
    }
  };

  const RemoveItem = async (itemID) => {

    let data = {
      ItemID: itemID,
      UserId: JSON.parse(localStorage.getItem("dfs-user")).user.user_email,
    }
    const response = await fetch(url + "remove-cart-item", {
      method: "post",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });

    if (response.status == 200) {
      addToast({
        message: "Item Removed from Cart",
        variant: TOAST_VARIANTS.SUCCESS
      });
      window.location.reload(false)
    } else if (response.status == 400) {
      addToast({
        message: "Item not in cart",
        variant: TOAST_VARIANTS.ERROR
      });
    }
  }

  useEffect(() => {
    setLoading(true);
    let dataReq
    if (isLoggedIn) {
      dataReq = {
        domain: domain,
        login: isLoggedIn,
        UserId: JSON.parse(localStorage.getItem("dfs-user")).user.user_email
      }
    }
    else {
      dataReq = {
        domain: domain,
        login: isLoggedIn,
        UserId: null
      }
    }
    axios
      .get(url + "datasets", { params: dataReq })
      .then((data) => {
        setData(data.data.data);
      })
      .catch((err) => {
        console.log("ERR", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [domain]);

  if (!loading && data.length === 0) {
    return <Heading size="2" className="text-red-900 text-center">No verified public datasets visible for above domain</Heading>
  }

  return (
    <>
      {loading ? (
        [1, 2, 3].map((k) => (
          <DomainDataTombstone key={k} />
        ))
      ) : data.map((dataset, index) => (
        <div
          class="max rounded overflow-hidden shadow-2xl hover:shadow-3xl text-center mb-8"
          key={index}
        >
          <div class="px-6 py-4">
            <div class="font-bold text-3xl mb-4">{dataset.dataset_name}</div>
            <p class="text-gray-700 text-base mb-4 text-justify">
              {dataset.dataset_description && dataset.dataset_description.split('Π').map((data) => (<p className="mb-2">{data}</p>))}
            </p>
            {(dataset.source.includes('http') || dataset.source.includes('www')) ? <a class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full m-1"
              href={dataset.source}
            >
              Source
            </a> : null}
            <a
              class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full m-1"
              href={"/dataset-versions/" + dataset.dataset_id}
            >
              Details
            </a>
            {dataset.paid ?
              <button
                class="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-full m-1 mt-2"
                id={"add-to-cart-" + dataset.dataset_id}
                onClick={() => {
                  if (!isLoggedIn) {
                    addToast({
                      message: "Sign In Required to Download",
                      variant: TOAST_VARIANTS.ERROR
                    });
                  }
                  else {
                    window.location.href = url + "request-new-dataset?datasetid=" + dataset.dataset_id + "&token=" + (isLoggedIn ? JSON.parse(localStorage.getItem("dfs-user"))["token"] : null);
                    
                  }
                }}
              >
                Download
              </button> :null}
            {dataset.added?
              <button
                class="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-full m-1 mt-2"
                id={"add-to-cart-" + dataset.dataset_id}
                onClick={() => {
                  if (!isLoggedIn) {
                    addToast({
                      message: "Sign In Required to Download",
                      variant: TOAST_VARIANTS.ERROR
                    });
                  }
                  else {
                    // window.location.href = url + "request-new-dataset?datasetid=" + dataset.dataset_id + "&token=" + (isLoggedIn ? JSON.parse(localStorage.getItem("dfs-user"))["token"] : null);
                    RemoveItem(dataset.dataset_id);
                  }
                }}
              >
                Remove
              </button>:null
            }
            {(!dataset.added & !dataset.paid)?
              <button
                class="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-full m-1 mt-2"
                id={"add-to-cart-" + dataset.dataset_id}
                onClick={() => {
                  if (!isLoggedIn) {
                    addToast({
                      message: "Sign In Required to Download",
                      variant: TOAST_VARIANTS.ERROR
                    });
                  }
                  else {
                    Additem(dataset.dataset_id);
                  }
                }}
              >
                Add Item
              </button>:null
            }
          </div>
        </div>
      ))}
    </>
  );
}
