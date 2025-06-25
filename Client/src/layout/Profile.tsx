import { z } from "zod"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft,    faXmark } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { setAdminInfo } from "../Slice/auth";
import { toast } from "react-toastify";
import updateSchema from "../schema/update";
import { useAdminProfileMutation, useUpdateSchemaMutation } from "../Slice/ApiSclice/AdminApi";


type Props = {
    setProfilebtn: React.Dispatch<React.SetStateAction<boolean>>;
}
type Loginfrom = z.infer<typeof updateSchema>
type UserType = {
    username: string;
    email: string;
    role: string;
    // add any other fields you expect from the API!
};

function Profile({setProfilebtn}:Props) {


    const [profile] = useAdminProfileMutation()
    const [update, setUpdate] = useState(false)
    const [user, setUser] = useState<UserType | null>(null);
    const dispath = useDispatch()
    const [updatepro, { isLoading }] = useUpdateSchemaMutation()
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Loginfrom>({
        resolver: zodResolver(updateSchema)
    })

    const Submit: SubmitHandler<Loginfrom> = async (data) => {
        try {
            const res = await updatepro(data).unwrap()
            setUser(prev => prev ? { ...prev, email: res.email, username: res.username, role: res.role } : prev)
            dispath(setAdminInfo(res))
            toast.success('Update Success', {
                onClose: () => {
                    setProfilebtn(true)
                    setUpdate(false)
                },

            })

        } catch (err: any) {
            toast.error(err?.data?.message || err.error)
        }


    }
    const updatebtn=()=>{
        setUpdate(true)
        
    }
    const backDetail = async () => {
        setUpdate(false)
        setProfilebtn(true)
    }
    const cancleBTN = () => {
        document.body.style.overflow = ""
        setProfilebtn((prev: boolean) => !prev)
    }

    useEffect(() => {

        const fetchProfile = async () => {
            try {
                window.scrollTo({ top: 0 })
                document.body.style.overflow = 'hidden'

                const res = await profile({}).unwrap();
                console.log()
                setUser({
                    username: res.user.username,
                    email: res.user.email,
                    role: res.user.role
                })

                // handle response here
            } catch (err: any) {
                toast.error(err?.data?.message | err.error)
                // handle error here
            }
        };
        fetchProfile();
    }, [profile,]);

    return (
        <>
            {!update ? <div className="fixed inset-0 bg-transparent backdrop-contrast-50 z-20 w-full">
                <div className=" absolute   mt-30 left-25 lg:left-2/5  bg-white overflow-hidden shadow rounded-lg border z-30 backdrop:bg-gray-500">
                    <div className="px-4 py-5 sm:px-6 flex justify-between">
                       
                        <div>
                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                User Profile
                            </h3>
                            <p className="mt-1 max-w-2xl text-sm text-gray-500">
                                This is some information about the user.
                            </p>
                        </div>
                        <div onClick={cancleBTN} className="cursor-pointer text-gray-500 hover:text-gray-700">
                            <FontAwesomeIcon icon={faXmark} className='cursor-pointer' />
                        </div>
                    </div>
                    <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                        <dl className="sm:divide-y sm:divide-gray-200">
                            <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">
                                    Full name
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {user?.username ?? "Loading..."}
                                </dd>
                            </div>
                            <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">
                                    Email address
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {user?.email ?? "Loading..."}
                                </dd>
                            </div>
                            <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">
                                    User Role
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {user?.role ?? "Loading..."}
                                </dd>
                            </div>
                            <div className="py-3 sm:mx-2 lg:ml-4 w-full">
                                <button onClick={updatebtn} type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" >Edit Profile</button>
                            </div>
                        </dl>
                    </div>
                </div>
            </div> :
                <div className="fixed inset-0 bg-transparent backdrop-contrast-50 z-20 w-full">
                    <div className=" absolute  w-80 mt-30 left-25 lg:left-2/5   bg-white overflow-hidden shadow rounded-lg border z-30 p-6">
                        <div className='py-3 cursor-pointer text-gray-500 hover:text-gray-700' onClick={backDetail}>
                            <FontAwesomeIcon icon={faArrowLeft} className='cursor-pointer' /> Back
                        </div>
                        <form onSubmit={handleSubmit(Submit)} className="max-w-sm mx-auto">

                            <div className="mb-5">
                                <label className="block mb-2 text-sm font-medium text-gray-900">Your Name</label>
                                <input  {...register('username')} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " placeholder="name" />
                                {errors.username ? <p className='text-red-400'>{errors.username?.message}</p> : <></>}
                            </div>
                            <div className="mb-5">
                                <label className="block mb-2 text-sm font-medium text-gray-900 ">Your email</label>
                                <input {...register('email')} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " placeholder="name@flowbite.com" />
                                {errors.email ? <p className='text-red-400'>{errors.email?.message}</p> : <></>}

                            </div>
                            <div className="mb-5">
                                <label className="block mb-2 text-sm font-medium text-gray-900 ">Your password</label>
                                <input {...register('password')} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " placeholder="••••••••" />
                                {errors.password ? <p className='text-red-400'>{errors.password?.message}</p> : <></>}

                            </div>

                            <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">{isSubmitting || isLoading ? "Updating..." : "Update"}</button>
                        </form>
                    </div>
                </div>
            }
        </>

    )
}

export default Profile