import { SubmitHandler, useForm } from "react-hook-form";
import { SetSchema } from "../../schema/setCreate";
import { z } from "zod/v4";
import { zodResolver } from "@hookform/resolvers/zod";
import { Bounce, toast, ToastContainer } from "react-toastify";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import { useEffect, useState } from "react";
import {
  useCrateSetMutation,
  useDeleteSetMutation,
  useGetallMenuMutation,
} from "../../Slice/ApiSclice/AdminApi";
import { Itable } from "../Menu/ShowMenu";
import ShowSet from "./ShowSet";

import UpdateSet from "./updateSet";

type Input = z.infer<typeof SetSchema>;

function Set_menu() {
  const [editData, setEditData] = useState<any | null>(null);
  const [updateMode, setUpdateMode] = useState(false);
  const [getAll] = useGetallMenuMutation();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDesigns, setSelectedDesigns] = useState<
    (Itable & { qty: number })[]
  >([]);
  const [displayedDesigns, setDisplayedDesigns] = useState<
    (Itable & { qty: number })[]
  >([]);
  const [alldata, setAlldata] = useState<Itable[]>([]);
  const [showError, setShowError] = useState(true);
  const [deleteSet] = useDeleteSetMutation();
  const [refreshKey, setRefreshKey] = useState(0);
  const [SetCreate, { isLoading }] = useCrateSetMutation();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Input>({
    resolver: zodResolver(SetSchema),
    defaultValues: {
      price: 0,
    },
  });

  const submit: SubmitHandler<Input> = async (data) => {
    try {
      if (selectedDesigns.length == 0) {
        setShowError(false);
      } else {
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("price", data.price.toString());
        formData.append("image", data.image[0]);
        formData.append("menu_items", JSON.stringify(selectedDesigns));
        const res = await SetCreate(formData);
        console.log(res);
        setShowError(true);

        if (res.error) {
          toast.error(res.error.data.message);
        } else {
          toast.success(res.data.message);
          reset();
          setSelectedDesigns([]);
          setDisplayedDesigns([]);
          setRefreshKey((prev) => prev + 1);
        }
      }
    } catch (err: any) {
      toast.error(err.data.message || err.message);
    }
  };
  function handleCheck(option, checked) {
    if (checked) {
      setSelectedDesigns((prev) => {
        if (prev.some((item) => item._id === option._id)) return prev;
        return [...prev, { ...option, qty: 1 }];
      });
    } else {
      setSelectedDesigns((prev) =>
        prev.filter((item) => item._id !== option._id)
      );
    }
  }
  function changeQty(id, delta) {
    setSelectedDesigns((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item
      )
    );
  }

  // Handle OK button
  function handleOk() {
    setDisplayedDesigns(selectedDesigns);
    setModalOpen(false);
    console.log("User selected designs:", selectedDesigns);
  }

  // Handle Cancel/Close
  function handleCancel() {
    setModalOpen(false);
  }

  const clickDrink = async (filter: string) => {
    const res = await getAll({});

    setAlldata(res.data.filter((menu) => menu.type == filter));
  };
  const delteBtn = async (_id: string) => {
    try {
      const res = await deleteSet({ _id: _id });

      if (res.error) {
        toast.error(res.error.data.message);
      } else {
        toast.success("Success Delete");
        // setEditData(null);
        // setUpdate(false);
        reset();
        setRefreshKey((prev) => prev + 1);
      }
    } catch (err: any) {
      toast.error(err.message);
    }
  };
  useEffect(() => {
    const data = async () => {
      const res = await getAll({});

      setAlldata(res.data.filter((menu) => menu.type == "Add Ons"));
    };
    data();
  }, [getAll]);
  return (
    <>
      <ToastContainer
        className={"mt-14"}
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
      <PageBreadcrumb pageTitle="Create Set" />
      <ComponentCard title="Create Set">
        {!updateMode ? (
          <form
            onSubmit={handleSubmit(submit)}
            className="max-w-md mx-auto text-gray-500 dark:text-white p-6"
          >
            <div className="relative z-0 w-full mb-5 group ">
              <input
                type="text"
                {...register("name")}
                id="floating_email"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                required
              />
              <label className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                Name
              </label>
              {errors.name ? (
                <p className="text-red-500">{errors.name?.message}</p>
              ) : (
                <></>
              )}
            </div>

            <div className="relative z-0 w-full mb-5 group">
              <input
                {...register("price", { valueAsNumber: true })}
                id="floating_password"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                required
              />
              <label className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                Price
              </label>
              {errors.price ? (
                <p className="text-red-500">{errors.price?.message}</p>
              ) : (
                <></>
              )}
            </div>
            <div className="py-3">
              <label
                htmlFor="images"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Upload Image
              </label>
              <input
                type="file"
                className="file-input file-input-sm"
                {...register("image")}
              />
              {errors.image && (
                <p className="text-red-500">{errors.image.message as string}</p>
              )}
            </div>
            <div className="py-4">
              <div className="border border-gray-300 gap-y-3  min-h-[40px] rounded text-gray-700 bg-white">
                <button
                  type="button"
                  className=" bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                  onClick={() => setModalOpen(true)}
                >
                  Choose Menu
                </button>

                {/* Display Area */}

                {displayedDesigns.length > 0 ? (
                  displayedDesigns.map((item) => (
                    <span key={item._id} className="mx-2">
                      {item.name} (x{item.qty})
                    </span>
                  ))
                ) : (
                  <span className=" ">
                    Your selected items will appear here.
                  </span>
                )}
              </div>
            </div>
            {!showError && (
              <p className="text-red-500">You need to select Menu</p>
            )}

            {modalOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                <div className="bg-gray-700 p-6 rounded shadow-lg min-w-[300px]">
                  <h2 className="mb-4 text-lg font-bold">Choose Designs</h2>
                  <div className="mb-4 space-y-2">
                    <span
                      onClick={() => clickDrink("Add Ons")}
                      className=" p-2 border rounded-2xl mr-2 cursor-pointer hover:bg-blue-500 "
                    >
                      Add Ons
                    </span>{" "}
                    <span
                      onClick={() => clickDrink("Drink")}
                      className="p-2 border rounded-2xl mr-2 cursor-pointer hover:bg-blue-600 "
                    >
                      Drink
                    </span>{" "}
                    <span
                      onClick={() => clickDrink("Main Dish")}
                      className="p-2 border rounded-2xl mr-2 cursor-pointer hover:bg-blue-500 "
                    >
                      Main Dish
                    </span>
                    <div className="space-y-2 mt-4">
                      {alldata.map((option: Itable) => (
                        <div
                          key={option._id}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id={`menu-checkbox-${option._id}`} // unique id per checkbox!
                              checked={
                                !!selectedDesigns.find(
                                  (item) => item._id === option._id
                                )
                              }
                              onChange={(e) =>
                                handleCheck(option, e.target.checked)
                              }
                              className="w-4 h-4 mr-2"
                            />
                            <label htmlFor={`menu-checkbox-${option._id}`}>
                              {option.name}
                            </label>
                          </div>
                          <div className="flex gap-x-2">
                            <button
                              type="button"
                              onClick={() => changeQty(option._id, +1)}
                              disabled={
                                !selectedDesigns.find(
                                  (item) => item._id === option._id
                                )
                              } // Only allow if checked
                            >
                              +
                            </button>
                            <p>
                              {selectedDesigns.find(
                                (item) => item._id === option._id
                              )?.qty || 1}
                            </p>
                            <button
                              type="button"
                              onClick={() => changeQty(option._id, -1)}
                              disabled={
                                !selectedDesigns.find(
                                  (item) => item._id === option._id
                                ) ||
                                (selectedDesigns.find(
                                  (item) => item._id === option._id
                                )?.qty || 1) <= 1
                              }
                            >
                              -
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button
                      className="px-4 py-2 text-gray-600 bg-gray-300 rounded hover:bg-gray-400"
                      onClick={handleCancel}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                      onClick={handleOk}
                    >
                      OK
                    </button>
                  </div>
                </div>
              </div>
            )}

            <button
              disabled={isSubmitting}
              type="submit"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              {isSubmitting || isLoading ? (
                <span className="loading loading-spinner loading-xs"></span>
              ) : (
                "Register"
              )}
            </button>
          </form>
        ) : (
          <UpdateSet
            editData={editData}
            back={() => {
              setUpdateMode(false);
              setEditData(null);
            }}
            onSuccess={() => {
              setUpdateMode(false);
              setEditData(null);
              setRefreshKey((prev) => prev + 1); // Refresh table
            }}
          />
        )}
      </ComponentCard>
      <ShowSet
        delteBtn={delteBtn}
        refreshKey={refreshKey}
        updateStart={(set) => {
          setEditData(set);
          setUpdateMode(true);
          toast.info(`Start update ${set.name}`);
        }}
      />
    </>
  );
}

export default Set_menu;
