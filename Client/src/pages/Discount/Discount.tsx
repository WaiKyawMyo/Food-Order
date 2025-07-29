import { Bounce, toast, ToastContainer } from "react-toastify"
import ComponentCard from "../../components/common/ComponentCard"
import PageBreadcrumb from "../../components/common/PageBreadCrumb"
import { discountSchema } from "../../schema/discount";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { useCreateDiscountMutation } from "../../Slice/ApiSclice/AdminApi";
import ShowDiscount from "./ShowDiscount";

type Input = z.infer<typeof discountSchema>;
function Discount() {
    const [discount,{isLoading}]= useCreateDiscountMutation()
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
      } = useForm<Input>({
        resolver: zodResolver(discountSchema),
      });

       const submit: SubmitHandler<Input> = async (data) => {
          try {
            const res =await discount({
               name:data.name,
               persent:data.persent
            })
             if (res.error) {
                  toast.error(res?.error?.data.message);
               } else {
                  toast.success("Creat Discount success");
                  reset()
               }

          } catch (err) {
            toast.error(err?.data?.message || err.message);
          }
        };
  return (
    <>
        <PageBreadcrumb pageTitle="Discount" />
              <ComponentCard title="Discount">
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
                      {...register('name')}
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
                      {...register('persent', { valueAsNumber: true })}
                      id="floating_password"
                      className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                      placeholder=" "
                      required
                    />
                    <label className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                      Persent
                    </label>
                    {errors.persent ? (
                      <p className="text-red-500">{errors.persent.message}</p>
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
                    ) :
                      "Register"
                    }
                  </button>
                  
                </form>
              </ComponentCard>

              <ShowDiscount/>
    </>
  )
}

export default Discount