import { useEffect, useState } from 'react'
import { useCompleteOrderMutation, useShowOrderMutation } from '../../Slice/ApiSclice/AdminApi'
import { Link } from 'react-router'
import { Bounce, toast, ToastContainer } from 'react-toastify'

function ManageAllOrders() {
  const [showAllOrders, { isLoading, error }] = useShowOrderMutation()
  const [orders, setOrders] = useState([])
  const [filteredOrders, setFilteredOrders] = useState([])
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('time')
  const [ordercomplete]= useCompleteOrderMutation()

  useEffect(() => {
    fetchAllOrders()
  }, [])

  useEffect(() => {
    filterAndSortOrders()
  }, [orders, filterStatus, searchTerm, sortBy])

  const fetchAllOrders = async () => {
    try {
      const result = await showAllOrders().unwrap()
      setOrders(result.data || [])
    } catch (err) {
      console.error('Error fetching orders:', err)
    }
    console.log(orders)
  }
  const completeHandle = async (_id) => {
    
    try {
        const res = await ordercomplete({_id}).unwrap()  // Add .unwrap() for RTK Query
        toast.success(res.message)
        toast.success("success")
        // Refresh the orders list after successful completion
        
        
    } catch (error) {
        console.error('Error completing order:', error)
        toast.error(error?.data?.message || error.message || 'Failed to complete order')
    }
}
  const filterAndSortOrders = () => {
    let filtered = [...orders]

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(order => order.status?.toLowerCase() === filterStatus.toLowerCase())
    }

    // Filter by search term (table number or order ID)
    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.table?.table_No?.toString().includes(searchTerm.toLowerCase()) ||
        order._id.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Sort orders
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'time':
          return new Date(b.time) - new Date(a.time)
        case 'total':
          return b.total - a.total
        case 'table':
          return (a.table?.table_No || 0) - (b.table?.table_No || 0)
        case 'items':
          return b.itemCount - a.itemCount
        default:
          return new Date(b.time) - new Date(a.time)
      }
    })

    setFilteredOrders(filtered)
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 border-red-200 dark:border-red-800'
      case 'preparing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 border-blue-200 dark:border-blue-800'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700'
    }
  }

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return '✅'
      case 'pending': return '⏳'
      case 'cancelled': return '❌'
      case 'preparing': return '🔄'
      default: return '📋'
    }
  }

  // Updated function to show detailed item quantities
  const getOrderSummary = (items) => {
    if (!items || items.length === 0) return 'No items'
    
    // Group items by name and sum quantities
    const itemGroups = items.reduce((acc, item) => {
      const itemName = item.menu?.name || item.set?.name || 'Unknown Item'
      const quantity = item.quantity || 1
      
      if (acc[itemName]) {
        acc[itemName] += quantity
      } else {
        acc[itemName] = quantity
      }
      
      return acc
    }, {})
    
    // Convert to array and format as "ItemName (qty)"
    const itemsWithQuantity = Object.entries(itemGroups).map(([name, qty]) => 
      `${name} (${qty})`
    )
    
    // Show first 2 items, then "+X more" if there are more
    if (itemsWithQuantity.length <= 2) {
      return itemsWithQuantity.join(', ')
    } else {
      const firstTwo = itemsWithQuantity.slice(0, 2).join(', ')
      const remaining = itemsWithQuantity.length - 2
      return `${firstTwo} +${remaining} more`
    }
  }

  // Helper function to format MMK currency
  const formatMMK = (amount) => {
    return `${(amount || 0).toLocaleString()} MMK`
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-slate-600"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading all orders...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
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
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-600 to-slate-700 dark:from-slate-700 dark:to-slate-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div>
              <h1 className="text-3xl font-bold">Order Management</h1>
              <p className="text-slate-300 mt-1">Manage all restaurant orders</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <button 
                onClick={fetchAllOrders}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors backdrop-blur-sm flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Refresh</span>
              </button>
              
              <div className="bg-white/10 rounded-lg p-2 backdrop-blur-sm">
                <div className="text-2xl font-bold">{filteredOrders.length}</div>
                <div className="text-xs text-slate-300">Total Orders</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Search */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Search Orders
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by table number or order ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                />
                <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Filter by Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                
                <option value="completed">Completed</option>
              
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              >
                <option value="time">Latest Orders</option>
                <option value="total">Total Amount</option>
                <option value="table">Table Number</option>
                <option value="items">Item Count</option>
              </select>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <span className="text-red-600 dark:text-red-400 text-lg mr-3">⚠️</span>
              <div>
                <h3 className="text-red-800 dark:text-red-400 font-medium">Error Loading Orders</h3>
                <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                  {error?.data?.message || 'Failed to load orders'}
                </p>
              </div>
              <button
                onClick={fetchAllOrders}
                className="ml-auto bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Orders Grid */}
        {filteredOrders.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredOrders.map((order) => (
              <div key={order._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 hover:shadow-md transition-shadow">
                <div className="p-6">
                  {/* Order Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Table {order.table?.table_No || 'N/A'}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)} {order.status || 'Pending'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Order #{order._id.slice(-8)}
                      </p>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-xl font-bold text-green-600 dark:text-green-400">
                        {formatMMK(order.total)}
                      </div>
                    </div>
                  </div>

                  {/* Order Details */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Items:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{order.itemCount || 0}</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Time:</span>
                      <span className="text-gray-900 dark:text-white">
                        {new Date(order.time).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Enhanced Order Summary with quantities */}
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 mb-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-2">Order Items:</p>
                    
                    {/* Show detailed items if less than 4, otherwise show summary */}
                    {order.items && order.items.length > 0 ? (
                      order.items.length <= 3 ? (
                        <div className="space-y-1">
                          {Object.entries(
                            order.items.reduce((acc, item) => {
                              const itemName = item.menu?.name || item.set?.name || 'Unknown Item'
                              const quantity = item.quantity || 1
                              
                              if (acc[itemName]) {
                                acc[itemName] += quantity
                              } else {
                                acc[itemName] = quantity
                              }
                              return acc
                            }, {})
                          ).map(([name, qty], index) => (
                            <div key={index} className="flex justify-between items-center">
                              <span className="text-sm text-gray-800 dark:text-gray-200 truncate flex-1 mr-2">
                                {name}
                              </span>
                              <span className="text-sm font-medium text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-600 px-2 py-1 rounded-full">
                                {qty}x
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-800 dark:text-gray-200">
                          {getOrderSummary(order.items)}
                        </p>
                      )
                    ) : (
                      <p className="text-sm text-gray-500 dark:text-gray-400 italic">No items</p>
                    )}
                  </div>

                  {/* Action Button - Only Complete button now */}
                  {order.status?.toLowerCase() !== 'completed' && (
                    <button onClick={()=>completeHandle(order._id)} className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2">

                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Mark as Complete </span>
                    </button>
                  )}
                  
                  {/* Show message for completed orders */}
                  {order.status?.toLowerCase() === 'completed' && (
                    <div className="w-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-4 py-2 rounded-lg text-sm text-center flex items-center justify-center space-x-2">
                      <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Order Completed</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">📋</div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {searchTerm || filterStatus !== 'all' ? 'No orders found' : 'No orders yet'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchTerm || filterStatus !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'Orders will appear here when customers place them'
              }
            </p>
            {(searchTerm || filterStatus !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('')
                  setFilterStatus('all')
                }}
                className="mt-4 bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}

        {/* Quick Stats with MMK */}
        {orders.length > 0 && (
          <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {orders.filter(o => o.status?.toLowerCase() === 'pending').length}
                </div>
                <div className="text-sm text-blue-600 dark:text-blue-400">Pending</div>
              </div>
              
              <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {filteredOrders.length}
                </div>
                <div className="text-sm text-yellow-600 dark:text-yellow-400">Order</div>
              </div>
              
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {orders.filter(o => o.status?.toLowerCase() === 'completed').length}
                </div>
                <div className="text-sm text-green-600 dark:text-green-400">Completed</div>
              </div>
              
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {formatMMK(orders.reduce((sum, order) => sum + (order.total || 0), 0)).replace(' MMK', '')}
                </div>
                <div className="text-sm text-purple-600 dark:text-purple-400">Total Revenue (MMK)</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ManageAllOrders