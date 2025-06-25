import { z } from "zod";
import { RegisterSchema } from "../../schema/register";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { useDeleteAdminMutation, useRegisterStaffMutation, useUpdateAdminMutation } from "../../Slice/ApiSclice/AdminApi";
import { Bounce, toast, ToastContainer } from "react-toastify";

import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import ShowStaff from "./ShowStaff";
import { useEffect, useState } from "react";
import { UpdateAdminSchema } from "../../schema/UpdateAdmin";


type updatetab = {
  _id: string;
  username?:string 
    email?:string,
    password?:string

};


function StaffRegister() {

 



  const [Register, { isLoading }] = useRegisterStaffMutation();
const [updateAdmin] = useUpdateAdminMutation();
  const [update, setUpdate] = useState(false);
  const [editData, setEditData] = useState<updatetab | null>(null);
  const [deleteTB] = useDeleteAdminMutation();
  const currentSchema = update  ? UpdateAdminSchema : RegisterSchema;
  
  
  type Loginform = z.infer<typeof RegisterSchema> | z.infer<typeof UpdateAdminSchema>;
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<Loginform>({
    resolver: zodResolver(currentSchema),
  });
  useEffect(() => {
  if (editData) {
    reset({
      username: editData.username,
      email: editData.email,
      password: '',
    });
  } else {
    reset({
      username: "",
      email: "",
      password: "",
    });
  }
}, [reset, editData]);
    const updateStart = (username:string, email: string,password:string , _id: string) => {
      setEditData({ _id,  username ,email , password});
  
      setUpdate(true);
      toast.info(`Update Admin: ${username}`);
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

  const submit: SubmitHandler<Loginform> = async (data) => {
    try {
      if(!update){
        const res = await Register(data);
      if (res.error) {
        toast.error(res.error?.data.message);
      } else {
        toast.success("Staff account has been created successfully");
      }
      } else {
        if(editData){
          const res = await updateAdmin({
            _id:editData._id,
            username:data.username,
            email:data.email,
            password:data.password
          })
          if (res.error){
            toast.error(res.error.data.message)
          }else{
            toast.success(res.data.message)
            console.log(res.data)
            setEditData(null)
            reset()
            setUpdate(false)
          }
        }
        
      } 
      
    } catch (err: any) {
      toast.error(err?.data?.message || err.message);
    }
  };

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
      <PageBreadcrumb pageTitle="Staff Register" />
      <ComponentCard title="Staff Register">
        <form
          onSubmit={handleSubmit(submit)}
          className="max-w-md mx-auto text-gray-500 dark:text-white p-6"
        >
          <div className="relative z-0 w-full mb-5 group ">
            <input
              type="text"
              {...register("username")}
              id="floating_email"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
            />
            <label className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
              Username
            </label>
            {errors.username ? (
              <p className="text-red-500">{errors.username?.message}</p>
            ) : (
              <></>
            )}
          </div>
          <div className="relative z-0 w-full mb-5 group">
            <input
              type="email"
              {...register("email")}
              id="floating_password"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
            />
            <label className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
              Email address
            </label>
            {errors.email ? (
              <p className="text-red-500">{errors.email?.message}</p>
            ) : (
              <></>
            )}
          </div>
          <div className="relative z-0 w-full mb-5 group">
            <input
              type="password"
              {...register("password")}
              id="floating_repeat_password"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
             
            />
            <label className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
              Password
            </label>
            {errors.password ? (
              <p className="text-red-500">{errors.password?.message}</p>
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
            ) : update? (
              "Update"
            ):("Register")}
          </button>
        </form>
      </ComponentCard>
      <ShowStaff updateStart={updateStart} delteBtn={delteBtn}/>
    </>
  );
}

export default StaffRegister;
