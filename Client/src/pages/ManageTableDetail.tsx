import  { useEffect, useState } from 'react'
import { useCompleteOrderMutation, useShowDetailMutation } from "../Slice/ApiSclice/AdminApi"
import { useParams } from 'react-router'
import { toast } from 'react-toastify'

function ManageTableDetail() {
  const [showDetail, { isLoading, error }] = useShowDetailMutation()
  const [orderData, setOrderData] = useState(null)
  const { id } = useParams()
  const [ordercomplete] = useCompleteOrderMutation()

  useEffect(() => {
    if (id) {
      fetchOrderDetails()
    }
  }, [id])

  const fetchOrderDetails = async () => {
    try {
      const result = await showDetail({ table_id: id }).unwrap()
      console.log('Fetched order data:', result.data) // Add this for debugging
      setOrderData(result.data)
    } catch (err) {
      console.error('Error fetching order details:', err)
      toast.error('Failed to fetch order details')
    }
  }

  const getStatusColor = (status) => {
    if (!status) return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
    
    switch (status.toLowerCase()) {
      case 'completed': 
        return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20 border-green-200 dark:border-green-800'
      case 'pending': 
        return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
      case 'cancelled': 
        return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20 border-red-200 dark:border-red-800'
      case 'preparing': 
        return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
      default: 
        return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
    }
  }

  const calculateTotal = () => {
    if (!orderData?.orderItems || !Array.isArray(orderData.orderItems)) return 0
    
    return orderData.orderItems.reduce((total, item) => {
      const price = item?.menuDetails?.[0]?.price || item?.setDetails?.[0]?.price || 0
      const quantity = item?.quantity || 1
      return total + (price * quantity)
    }, 0)
  }

  const getTableNumber = () => {
    // Try to get table number from various possible sources
    return orderData?.table_id?.table_No || 
           orderData?.tableOrders?.[0]?.table_id?.table_No || 
           orderData?.table_No || 
           id || 
           'Unknown'
  }

  const getOrderTime = () => {
    if (!orderData?.tableOrders || orderData.tableOrders.length === 0) return 'Unknown'
    
    const lastOrder = orderData.tableOrders[orderData.tableOrders.length - 1]
    return lastOrder?.time ? new Date(lastOrder.time).toLocaleString() : 'Unknown'
  }

  const hangleComplete = (orderId) => {
    // Your complete order logic here
    console.log('Completing order:', orderId)
  }

  const getOverallStatus = () => {
    if (!orderData?.orderItems?.length) return 'No Orders'
    
    const statuses = orderData.orderItems.map(item => item?.status?.toLowerCase() || 'pending')
    
    if (statuses.every(status => status === 'completed')) return 'Completed'
    if (statuses.some(status => status === 'cancelled')) return 'Cancelled'
    if (statuses.some(status => status === 'preparing')) return 'Preparing'
    return 'Pending'
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 dark:border-blue-400"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading order details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm border dark:border-gray-700 max-w-md">
          <div className="text-red-500 dark:text-red-400 text-6xl mb-4">⚠️</div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Error Loading Order</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {error?.data?.message || error?.message || 'Failed to load order details'}
          </p>
          <button 
            onClick={fetchOrderDetails}
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (!orderData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm border dark:border-gray-700 max-w-md">
          <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">👤</div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Customer Found</h3>
          <p className="text-gray-600 dark:text-gray-400">No customer found for this table</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header Bar */}
      <div className="bg-gradient-to-r from-slate-600 to-slate-700 dark:from-slate-700 dark:to-slate-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            {/* Left Section - Back Button & Title */}
            <div className="flex items-center space-x-6">
              <button 
                onClick={() => window.history.back()}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>Back</span>
              </button>
              
              <div>
                <h1 className="text-2xl font-bold">Table #{}</h1>
                <p className="text-slate-200 text-sm">Order Management</p>
              </div>
            </div>

            {/* Center Section - Order Status */}
            <div className="hidden md:flex items-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold">{orderData?.orderItems?.length || 0}</div>
                <div className="text-slate-300 text-sm">Items</div>
              </div>
              <div className="h-12 w-px bg-white/20"></div>
              <div className="text-center">
                <div className="text-2xl font-bold">${calculateTotal().toFixed(2)}</div>
                <div className="text-slate-300 text-sm">Total</div>
              </div>
              <div className="h-12 w-px bg-white/20"></div>
              <div className="text-center">
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  getOverallStatus() === 'Completed' ? 'bg-green-500/20 text-green-200' :
                  getOverallStatus() === 'Preparing' ? 'bg-yellow-500/20 text-yellow-200' :
                  getOverallStatus() === 'Cancelled' ? 'bg-red-500/20 text-red-200' :
                  'bg-gray-500/20 text-gray-200'
                }`}>
                  {getOverallStatus()}
                </div>
                <div className="text-slate-300 text-sm mt-1">Status</div>
              </div>
            </div>

            {/* Right Section - Action Buttons */}
            <div className="flex items-center space-x-3">
              <button 
                onClick={fetchOrderDetails}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors backdrop-blur-sm flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Refresh</span>
              </button>
              
              
            </div>
          </div>

          {/* Mobile Stats Row */}
          <div className="md:hidden pb-4">
            <div className="flex justify-around items-center bg-white/10 rounded-lg p-3 backdrop-blur-sm">
              <div className="text-center">
                <div className="font-bold">{orderData?.orderItems?.length || 0}</div>
                <div className="text-xs text-slate-300">Items</div>
              </div>
              <div className="text-center">
                <div className="font-bold">${calculateTotal().toFixed(2)}</div>
                <div className="text-xs text-slate-300">Total</div>
              </div>
              <div className="text-center">
                <div className={`px-2 py-1 rounded text-xs font-medium ${
                  getOverallStatus() === 'Completed' ? 'bg-green-500/20 text-green-200' :
                  getOverallStatus() === 'Preparing' ? 'bg-yellow-500/20 text-yellow-200' :
                  getOverallStatus() === 'Cancelled' ? 'bg-red-500/20 text-red-200' :
                  'bg-gray-500/20 text-gray-200'
                }`}>
                  {getOverallStatus()}
                </div>
                <div className="text-xs text-slate-300 mt-1">Status</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rest of your component remains the same, but with safer property access */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Customer Information */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <span className="mr-2">👤</span>
                Customer Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Customer ID</label>
                  <p className="text-gray-900 dark:text-gray-100 font-mono text-sm break-all">{orderData?._id || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Order Time</label>
                  <p className="text-gray-900 dark:text-gray-100">{getOrderTime()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Amount</label>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">${(calculateTotal() * 1.1).toFixed(2)}</p>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-6 mt-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <span className="mr-2">💰</span>
                Order Summary
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                  <span className="text-gray-900 dark:text-gray-100">${calculateTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Tax (10%)</span>
                  <span className="text-gray-900 dark:text-gray-100">${(calculateTotal() * 0.1).toFixed(2)}</span>
                </div>
                <div className="border-t dark:border-gray-600 pt-3">
                  <div className="flex justify-between font-semibold text-lg">
                    <span className="text-gray-900 dark:text-white">Total</span>
                    <span className="text-green-600 dark:text-green-400">${(calculateTotal() * 1.1).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700">
              <div className="p-6 border-b dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                      <span className="mr-2">📋</span>
                      Order Items
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {orderData?.orderItems?.length || 0} items ordered
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Order Total</p>
                    <p className="text-xl font-bold text-green-600 dark:text-green-400">
                      ${calculateTotal().toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="divide-y dark:divide-gray-700">
                {orderData?.orderItems?.map((item, index) => {
                  const menuItem = item?.menuDetails?.[0] || item?.setDetails?.[0]
                  return (
                    <div key={index} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <img 
                            src={menuItem?.image || 'https://via.placeholder.com/80x80?text=No+Image'} 
                            alt={menuItem?.name || 'Menu item'}
                            className="w-20 h-20 rounded-lg object-cover border dark:border-gray-600"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/80x80?text=No+Image'
                            }}
                          />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <h3 className="text-base font-medium text-gray-900 dark:text-white">
                                {menuItem?.name || 'Unknown Item'}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                {menuItem?.description || 'No description available'}
                              </p>
                              <div className="flex items-center mt-2 space-x-4">
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                  Qty: <span className="font-medium text-gray-900 dark:text-gray-100">{item?.quantity || 1}</span>
                                </span>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(item?.status)}`}>
                                  {item?.status || 'Pending'}
                                </span>
                              </div>
                            </div>
                            
                            <div className="text-right ml-4">
                              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                                ${menuItem?.price?.toFixed(2) || '0.00'}
                              </div>
                              {(item?.quantity || 1) > 1 && (
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                  ${((menuItem?.price || 0) * (item?.quantity || 1)).toFixed(2)} total
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {item?.notes && (
                            <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                              <p className="text-sm text-yellow-800 dark:text-yellow-300">
                                <span className="font-medium">Special Instructions:</span> {item.notes}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
                
                {(!orderData?.orderItems || orderData.orderItems.length === 0) && (
                  <div className="p-12 text-center">
                    <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">🕐</div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Items Ordered</h3>
                    <p className="text-gray-600 dark:text-gray-400">This customer hasn't placed any orders yet.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ManageTableDetail