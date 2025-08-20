import { z } from "zod";
import { tableSchema } from "../../schema/table";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ComponentCard from "../../components/common/ComponentCard";
import { Bounce, toast, ToastContainer } from "react-toastify";
import {
  useCreteateTableMutation,
  useDeleteTableMutation,
  useUpdateTabelMutation,
} from "../../Slice/ApiSclice/AdminApi";
import ShowTable from "./ShowTable";
import { useEffect, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

type Input = z.infer<typeof tableSchema>;
type updatetab = {
  table_No: number;
  capacity: number;
  _id: string;
};

function CreateTable() {
  const [tablecrate, { isLoading }] = useCreteateTableMutation();
  const [updatetable] = useUpdateTabelMutation();
  const [update, setUpdate] = useState(false);
  const [editData, setEditData] = useState<updatetab | null>(null);
  const [deleteTB] = useDeleteTableMutation();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Input>({
    resolver: zodResolver(tableSchema),
  });
  useEffect(() => {
    reset({
      table_No: editData?.table_No,
      capacity: editData?.capacity,
    });
  }, [reset, editData]);
  const updateStart = (table_No: number, capacity: number, _id: string) => {
    setEditData({ _id, table_No, capacity });

    setUpdate(true);
    toast.info(`Update Table No ${table_No}`);
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
      if (!update) {
        const res = await tablecrate({
          table_No: data.table_No,
          capacity: Number(data.capacity),
          is_reserved: false,
          status: "available",
        });
        reset()
        if (res.error) {
          toast.error(res?.error?.data.message);
        } else {
          toast.success("Create table success");
        }
      } else {
        if (editData) {
          const res = await updatetable({
            _id: editData._id,
            table_No: data.table_No,
            capacity: data.capacity,
          });
          console.log(res);
          
          if (res.error) {
            toast.error(res.error.data.message);
            reset()
          } else {
            toast.success(res.data.message);
            setEditData(null);
            reset();
            setUpdate(false);
          }
        }
      }
    } catch (err: any) {
      toast.error(err?.data?.message || err.message);
    }
  };
    const back=()=>{
    setUpdate(false)
    setEditData(null);
     reset();
  }
  return (
    <>
    <PageBreadcrumb pageTitle="Create Table" />
      <ComponentCard title="Create Table">
        <ToastContainer
         className={'mt-14'}
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
        <form
          onSubmit={handleSubmit(submit)}
          className="max-w-md mx-auto text-gray-500 dark:text-white p-6"
        >
          <div className="relative z-0 w-full mb-5 group ">
            <input
              type="text"
              {...register("table_No", { valueAsNumber: true })}
              id="floating_email"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
            />
            <label className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
              Table No
            </label>
            {errors.table_No ? (
              <p className="text-red-500">{errors.table_No?.message}</p>
            ) : (
              <></>
            )}
          </div>
          <div className="relative z-0 w-full mb-5 group">
            <input
              {...register("capacity", { valueAsNumber: true })}
              id="floating_password"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
            />
            <label className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
              Number of People
            </label>
            {errors.capacity ? (
              <p className="text-red-500">{errors.capacity?.message}</p>
            ) : (
              <></>
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
          {update && <button onClick={back} className="text-white ml-3 bg-gray-600 hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center ">
             Cancel
          </button>}
        </form>
      </ComponentCard>

      <ShowTable updateStart={updateStart} delteBtn={delteBtn} />
    </>
  );
}

export default CreateTable;
