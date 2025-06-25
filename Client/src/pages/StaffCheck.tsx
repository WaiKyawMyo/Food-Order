import { useEffect } from "react"
import { useSelector } from "react-redux"
import { RootState } from "../store"
import { Link, useNavigate } from "react-router"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faXmark } from "@fortawesome/free-solid-svg-icons"

interface Props{
    children:React.ReactNode
} 

function StaffCheck({children}:Props) {
    const navigate = useNavigate()
    const userInfo = useSelector((state:RootState)=>state.auth.adminInfo)
    useEffect(()=>{
        if(userInfo){
             document.body.style.overflow=''
        }else{
             window.scrollTo({top:0})
            document.body.style.overflow='hidden'
        }
    },[userInfo])
    const cancleBTN =()=>{
        navigate('/home')
    }
   
  return (
    <>
     {
        userInfo?.role ==="Staff"?  <div className=" absolute z-60 w-full Top- left-[-10px] h-screen top-[0px]  backdrop-blur-2xl">
                <div className="mx-auto mt-6 items-center justify-center p-4 w-full max-w-lg h-full ">
                    
                    <div className="relative p-4 bg-gray-600 rounded-lg shadow mt-6 md:p-8">
                       <div  className=" flex justify-end  ">
                            <FontAwesomeIcon icon={faXmark} onClick={cancleBTN} className='cursor-pointer text-gray-300 hover:text-gray-100 ' />
                        </div> 
                        <div className="mb-4 text-sm font-light  ">
                            <h3 className="mb-3 text-2xl font-bold  ">Admins Only</h3>
                            <p className="text-lg text-gray-300">
                               Only administrators can create new staff accounts.
                            </p>
                        </div>
                        
                    </div>
                </div>
            </div> : <></>
    }
    {children}
    </>
  )
}

export default StaffCheck