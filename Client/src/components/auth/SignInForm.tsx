import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod/v4";
import { zodResolver } from "@hookform/resolvers/zod";

import { Bounce, toast, ToastContainer } from "react-toastify";
import cover from '../../assets/3714960.jpg'
import logo from '../../assets/Logo.svg'
import { LoginSchema } from "../../schema/input";
import { useLoginMutation } from "../../Slice/ApiSclice/AdminApi";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { setAdminInfo } from "../../Slice/auth";

type Input = z.infer<typeof LoginSchema>;
export default function SignInForm() {
  const navigate = useNavigate()
  const dispath = useDispatch()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Input>({
    resolver: zodResolver(LoginSchema),
  });
  const [Login, { isLoading }] = useLoginMutation();
  const submit: SubmitHandler<Input> = async (data) => {
    try {
      const res=await Login(data).unwrap();
      dispath(setAdminInfo(res))
      toast.success("User Login Success",{
        onClose:()=>{
          navigate('/home')
        }
      })
      
    } catch (err: any) {
      toast.error(err?.data?.message || err.error);
    }
  };
  return (
     <div className="bg-gray-100 flex justify-center items-center h-screen">
      <ToastContainer
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
      <div className="w-1/2 h-screen hidden lg:block">
        <img
          src={cover}
          alt="Placeholder Image"
          className="object-cover w-full h-full"
        />
      </div>

      <div className="lg:p-36 md:p-52 sm:20 p-8 w-full lg:w-1/2">
       <div>
        <img src={logo} className="mx-auto w-25" alt="" />
       </div>
        <h1 className="text-2xl text-black font-semibold mb-4">Login</h1>
        <form onSubmit={handleSubmit(submit)} method="POST">
          <div className="mb-4">
            <label className="block text-gray-600">Email</label>

            <input
              {...register("email")}
              type="email"
              className="w-full border text-black border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
            />
            {errors.email ? (
              <p className="text-red-400">{errors.email.message}</p>
            ) : (
              <></>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-600">Password</label>
            <input
              {...register("password")}
              type="password"
              className="w-full border text-black border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
            />
            {errors.password ? (
              <p className="text-red-400">{errors.password.message}</p>
            ) : (
              <></>
            )}
          </div>

          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md py-2 px-4 w-full"
          >
            {isSubmitting || isLoading ? (
              <span className="loading loading-spinner loading-xs"></span>
            ) : (
              "Login"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
