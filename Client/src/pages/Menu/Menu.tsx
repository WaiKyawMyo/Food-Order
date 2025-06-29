import { z } from "zod/v4";
import { LoginSchema } from "../../schema/menu";
import {
  useCreateMenuMutation,
  useDeleteMenuMutation,
  useUpdateMenuMutation,
} from "../../Slice/ApiSclice/AdminApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import { useEffect, useState } from "react";
import { Bounce, toast, ToastContainer } from "react-toastify";
import ShowMenu from "./ShowMenu";

type Input = z.infer<typeof LoginSchema>;
type inputupdate = {
  name: string;
  type: string;
  price: number;
  is_avaliable: boolean;
  _id: string;
};



function Menu() {
  const [crestetable, { isLoading }] = useCreateMenuMutation();
  const [update, setUpdate] = useState(false);

  const [updatetable] = useUpdateMenuMutation();

  const [editData, setEditData] = useState<inputupdate | null>(null);
  const [deleteTB] = useDeleteMenuMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Input>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      is_avaliable: true,
    },
  });
  const updateStart = (
    name: string,
    type: string,
    is_avaliable: boolean,
    price: number,
    _id: string
  ) => {
    setEditData({ _id, price, is_avaliable, type, name });

    setUpdate(true);
    toast.info(`Update Menu: ${name}`);
  };

  const delteBtn = async (_id: string) => {
    try {
      const res = await deleteTB({ _id: _id });

      if (res.error) {
        toast.error(res.error.data.message);
      } else {
        toast.success("Success Delete");
        setEditData(null);
        setUpdate(false);
        reset();
      }
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const submit: SubmitHandler<Input> = async (data) => {
    try {
      if (update) {
        const formData = new FormData();

        formData.append("name", data.name);
        formData.append("type", data.type);
        formData.append("price", data.price.toString());
        formData.append("is_avaliable", String(data.is_avaliable));
        formData.append("image", data.image[0]);
        if (data.image && data.image.length > 0) {
          formData.append("image", data.image[0]);
        }
        const res = await updatetable({ _id: editData?._id, formData });
        if (res.error) {
          toast.error(res.error.data.message);
        } else {
          toast.success(res.data.message);
          reset();
        }
      } else {
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("type", data.type);
        formData.append("price", data.price.toString());
        formData.append("is_avaliable", String(data.is_avaliable));
        formData.append("image", data.image[0]);

        const res = await crestetable(formData);
        console.log(res);
        if (res.error) {
          toast.error(res.error.data.message);
        } else {
          toast.success(res.data.message);
          reset();
        }
      }
    } catch (err: any) {
      toast.error(err.data.message || err.message);
    }
  };
  useEffect(() => {
    if (editData) {
      reset({
        name: editData.name,
        type: editData.type,
        price: editData.price,
        is_avaliable: editData.is_avaliable,
      });
    } else {
      reset();
    }
  }, [reset, editData]);
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
      <PageBreadcrumb pageTitle="Create Menu" />
      <ComponentCard title="Create Menu">
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
          <div className="relative z-0 w-full mb-5 group">
            <input
              {...register("type")}
              id="floating_password"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
            />
            <label className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
              Type
            </label>
            {errors.type ? (
              <p className="text-red-500">{errors.type?.message}</p>
            ) : (
              <></>
            )}
          </div>
          <div className="py-3">
            <label
              htmlFor="images"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Upload multiple images
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

          <button
            disabled={isSubmitting}
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            {isSubmitting || isLoading ? (
              <span className="loading loading-spinner loading-xs"></span>
            ) : update ? (
              "Update"
            ) : (
              "Register"
            )}
          </button>
        </form>
      </ComponentCard>

      <ShowMenu  updateStart={updateStart} delteBtn={delteBtn}/>
    </>
  );
}

export default Menu;
