import { z } from "zod/v4";
import { UpdateMenuSchema } from "../../schema/UpdateMenu";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useUpdateMenuMutation } from "../../Slice/ApiSclice/AdminApi";
import { toast } from "react-toastify";


type Input = z.infer<typeof UpdateMenuSchema >;
type EditData = {
  name: string;
  type: string;
  price: number;
  is_avaliable: boolean;
  _id: string; 
  
} | null
type prop ={
    editData: EditData
}

function UpdateForm({editData}:prop) {

    const [updateData,{isLoading}]=useUpdateMenuMutation()
     const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
       
      } = useForm<Input>({
        resolver: zodResolver(UpdateMenuSchema),
defaultValues: {
    // other fields...
    is_avaliable: "true",  // or "false" as your default
  },
      });

      useEffect(() => {
    if (editData) {
      reset({
        name: editData.name,
        type: editData.type,
        price: editData.price,
        is_avaliable: editData.is_avaliable === true ? "true" : "false"
      });
    } else {
      reset();
    }
  }, [reset, editData]);
     const submit: SubmitHandler<Input> = async (data) => {
       try{
         const formData = new FormData();
            formData.append("name", data.name);
        formData.append("type", data.type);
        formData.append("price", data.price.toString());
        formData.append("is_avaliable", data.is_avaliable === "true" ? "true" : "false")
        if(editData?._id){
          formData.append("_id", editData._id);
        }
        
        if(data.image){
            formData.append("image", data.image[0]);
        }
        
        

            const res= await updateData(formData)
            console.log(res)
            if(res.error){
                toast.error(res.data.error.message);
                
            }
       }catch(err:any){
        toast.error(err.data.message)
       }
     }
  return (
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

            
            
<div className="flex">
    <div className="flex items-center me-4">
        <input {...register('is_avaliable')} defaultChecked id="inline-radio" type="radio" value='true' name="inline-radio-group" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
        <label  className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Available</label>
    </div>
    <div className="flex items-center me-4">
        <input {...register('is_avaliable')} id="inline-2-radio" type="radio" value="false" name="inline-radio-group" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
        <label className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Not Available</label>
    </div>
    
</div>{errors.is_avaliable ? (
              <p className="text-red-500">{errors.is_avaliable.message}</p>
            ) : (
              <></>
            )}

          
         { <div className="py-3">
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
          </div>}
         {errors.image ? (
              <p className="text-red-500">{errors.image.message}</p>
            ) : (
              <></>
            )}

          <button
            disabled={isSubmitting}
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            {
              isLoading &&  <span className="loading loading-spinner loading-xs"></span>
            }

                Update
            
          </button>
        </form>
  )
}

export default UpdateForm