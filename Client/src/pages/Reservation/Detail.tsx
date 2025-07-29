import { useNavigate, useParams } from "react-router"
import ComponentCard from "../../components/common/ComponentCard"
import { useGetDetailDataQuery } from "../../Slice/api"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";


  // Change to Query

function Detail() {
    const navigate =useNavigate()
    const { id } = useParams()
    const header = ["No", "Name", "Quantity", "Price"];
    // Use the query hook, not mutation hook
    const { data, isLoading, error } = useGetDetailDataQuery(id, {
        skip: !id  // Skip the query if no ID
    })

    if (error) {
        return (
            <div className="py-6">
                <ComponentCard title="Reservation Detail">
                    <div className="text-red-500">
                        Error: {error.status} - {error.data?.message || 'Failed to load data'}
                    </div>
                </ComponentCard>
            </div>
        )
    }

    if (isLoading) {
        return (
            <div className="py-6">
                <ComponentCard title="Reservation Detail">
                    <div>Loading...</div>
                </ComponentCard>
            </div>
        );
    }

    if (!data || !data.data || !data.data.order) {
        return (
            <div className="py-6">
                <ComponentCard title="Reservation Detail">
                    <div>No reservation details found.</div>
                </ComponentCard>
            </div>
        );
    }

    const nowDate = new Date(data.data.order.time);

    return (
        <>
        <button onClick={()=>navigate('/reservation')} className="px-6 py-3 hover:bg-gray-500 bg-gray-600 rounded"><FontAwesomeIcon icon={faAngleLeft} /> Back</button>
        <div className="py-6">
            <ComponentCard title="Reservation Detail">
                {data.success && data.data.order ? (
                    <div>
                        <h2 className="">Order ID : {data.data.order._id}</h2>
                        <div className="mt-3 flex ">
                            <h1>Name  </h1>
                            <p className="ml-3"> : {data.data.order.user_id.username}</p>
                        </div>
                        <div className="mt-1 flex ">
                            <h1>Table No  </h1>
                            <p className="ml-3"> : {data.data.order.table_id.table_No}</p>
                        </div>
                        <div className="mt-1 flex ">
                            <h1>Date  </h1>
                            <p className="ml-3"> :   {nowDate.toLocaleDateString('en-GB') }</p>
                        </div>
                        
                    </div>
                ) : (
                    <div>Customer hasn't order yet</div>
                )}
            </ComponentCard>
            {data.data.items && data.data.items.length > 0 ? (
           
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                {header.map((head, index) => (
                                    <th key={index} scope="col" className="px-6 py-3 text-center">
                                        {head}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {data.data.items.map((item, index) => (
                                <>
                                    <tr key={item._id || index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
                                        <td className="px-6 py-4 text-center">
                                            {index + 1}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {item.menu_id?.name || item.set_id.name}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {item.quantity}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {item.menu_id?.price ? (item.menu_id.price * item.quantity) : item.set_id.price}
                                        </td>
                                    </tr>
                                    
                                </>
                            ))}
                            <tr className=" dark:bg-gray-700 dark:border-gray-700 ">
                                <td className="px-6 py-4 text-right  text-gray-300 " colSpan={3}>SubTotal</td>
                                <td className="px-6 py-4 text-center text-gray-300 " >{data.data.order?.subtotal}</td>
                            </tr>
                            <tr className=" dark:bg-gray-700 dark:border-gray-700">
                                <td className="px-6 py-4  text-right  text-gray-300 " colSpan={3}>Discount Amound</td>
                                <td className="px-6 py-4 text-center text-gray-300 " >-{data.data.order?.discount_amount}</td>
                            </tr>
                             <tr className=" dark:bg-gray-700 dark:border-gray-700">
                                <td className="px-6 py-4  text-right  text-gray-300 " colSpan={3}>Tax Amount</td>
                                <td className="px-6 py-4 text-center text-gray-300 " >{data.data.order?.tax_amount}</td>
                            </tr>
                             <tr className=" dark:bg-gray-700 dark:border-gray-700">
                                <td className="px-6 py-4  text-right  text-gray-300 " colSpan={3}>Service Charge </td>
                                <td className="px-6 py-4 text-center text-gray-300 " >{data.data.order?.service_charge}</td>
                            </tr>
                            <tr className=" border-t-2 dark:bg-gray-700 dark:border-gray-500">
                                <td className="px-6 py-4  text-right font-black text-gray-300 " colSpan={3}>Total</td>
                                <td className="px-6 py-4 text-center text-gray-300 font-bold" >{data.data.order?.total}</td>
                            </tr>
                        </tbody>
                    </table>
              
            ) : (
                
                <div>No items ordered for this reservation.</div>
            
            )}
        </div>
        </>
    )
}

export default Detail