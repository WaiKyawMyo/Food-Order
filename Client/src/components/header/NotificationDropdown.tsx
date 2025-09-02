import { useState, useEffect } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { Link } from "react-router";

import { toast } from "react-toastify";
import { useGetTablesNeedingHelpQuery, useResolveTableHelpMutation } from "../../Slice/ApiSclice/AdminApi";

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [previousCount, setPreviousCount] = useState(0);

  // Fetch help requests with polling
  const { data: helpTables, isLoading, error, refetch } = useGetTablesNeedingHelpQuery(
    undefined,
    {
      pollingInterval: 30000, // Poll every 30 seconds
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
    }
  );

  const [resolveHelp] = useResolveTableHelpMutation();

  const helpCount = helpTables?.count || 0;
  const notifying = helpCount > 0;

  // Show toast when new help requests come in
  useEffect(() => {
    if (helpCount > previousCount && previousCount > 0) {
      const newRequests = helpCount - previousCount;
      toast.warn(`${newRequests} new help request${newRequests > 1 ? 's' : ''}!`, {
        autoClose: 5000,
      });
    }
    setPreviousCount(helpCount);
  }, [helpCount, previousCount]);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  const handleClick = () => {
    toggleDropdown();
  };

  const handleResolveHelp = async (tableId) => {
    try {
      await resolveHelp(tableId).unwrap();
      toast.success('Help request resolved');
      refetch(); // Refresh the data
    } catch (error) {
      console.error('Error resolving help:', error);
      toast.error('Failed to resolve help request');
    }
  };

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const requestTime = new Date(dateString);
    const diffInMinutes = Math.floor((now - requestTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hr${diffInHours > 1 ? 's' : ''} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  };

  return (
    <div className="relative">
      <button
        className="relative flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full dropdown-toggle hover:text-gray-700 h-11 w-11 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
        onClick={handleClick}
      >
        {/* Updated notification indicator */}
        <span
          className={`absolute right-0 top-0.5 z-10 h-2 w-2 rounded-full ${
            notifying ? "bg-red-500" : "bg-orange-400 hidden"
          }`}
        >
          {notifying && (
            <span className="absolute inline-flex w-full h-full bg-red-500 rounded-full opacity-75 animate-ping"></span>
          )}
        </span>
        
        {/* Notification count badge */}
        {helpCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
            {helpCount > 99 ? '99+' : helpCount}
          </span>
        )}

        <svg
          className="fill-current"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10.75 2.29248C10.75 1.87827 10.4143 1.54248 10 1.54248C9.58583 1.54248 9.25004 1.87827 9.25004 2.29248V2.83613C6.08266 3.20733 3.62504 5.9004 3.62504 9.16748V14.4591H3.33337C2.91916 14.4591 2.58337 14.7949 2.58337 15.2091C2.58337 15.6234 2.91916 15.9591 3.33337 15.9591H4.37504H15.625H16.6667C17.0809 15.9591 17.4167 15.6234 17.4167 15.2091C17.4167 14.7949 17.0809 14.4591 16.6667 14.4591H16.375V9.16748C16.375 5.9004 13.9174 3.20733 10.75 2.83613V2.29248ZM14.875 14.4591V9.16748C14.875 6.47509 12.6924 4.29248 10 4.29248C7.30765 4.29248 5.12504 6.47509 5.12504 9.16748V14.4591H14.875ZM8.00004 17.7085C8.00004 18.1228 8.33583 18.4585 8.75004 18.4585H11.25C11.6643 18.4585 12 18.1228 12 17.7085C12 17.2943 11.6643 16.9585 11.25 16.9585H8.75004C8.33583 16.9585 8.00004 17.2943 8.00004 17.7085Z"
            fill="currentColor"
          />
        </svg>
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute -right-[240px] mt-[17px] flex h-[480px] w-[350px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark sm:w-[361px] lg:right-0"
      >
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100 dark:border-gray-700">
          <h5 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Help Requests ({helpCount})
          </h5>
          <div className="flex items-center space-x-2">
            <button
              onClick={refetch}
              disabled={isLoading}
              className="text-blue-600 hover:text-blue-700 text-sm transition disabled:opacity-50"
            >
              {isLoading ? 'Loading...' : 'Refresh'}
            </button>
            <button
              onClick={toggleDropdown}
              className="text-gray-500 transition dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            >
              <svg
                className="fill-current"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M6.21967 7.28131C5.92678 6.98841 5.92678 6.51354 6.21967 6.22065C6.51256 5.92775 6.98744 5.92775 7.28033 6.22065L11.999 10.9393L16.7176 6.22078C17.0105 5.92789 17.4854 5.92788 17.7782 6.22078C18.0711 6.51367 18.0711 6.98855 17.7782 7.28144L13.0597 12L17.7782 16.7186C18.0711 17.0115 18.0711 17.4863 17.7782 17.7792C17.4854 18.0721 17.0105 18.0721 16.7176 17.7792L11.999 13.0607L7.28033 17.7794C6.98744 18.0722 6.51256 18.0722 6.21967 17.7794C5.92678 17.4865 5.92678 17.0116 6.21967 16.7187L10.9384 12L6.21967 7.28131Z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </div>
        </div>

        <ul className="flex flex-col h-auto overflow-y-auto custom-scrollbar">
          {isLoading ? (
            <li className="p-4 text-center text-gray-500 dark:text-gray-400">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-500 mx-auto mb-2"></div>
              Loading help requests...
            </li>
          ) : error ? (
            <li className="p-4 text-center text-red-500">
              <div className="text-2xl mb-2">⚠️</div>
              Failed to load notifications
              <button 
                onClick={refetch}
                className="block mt-2 text-blue-600 hover:text-blue-700 text-sm"
              >
                Try again
              </button>
            </li>
          ) : helpTables?.data?.length > 0 ? (
            helpTables.data.map((table) => (
              <li key={table._id}>
                <DropdownItem
                  onItemClick={closeDropdown}
                  className="flex gap-3 rounded-lg border-b border-gray-100 p-3 px-4.5 py-3 hover:bg-gray-100 dark:border-gray-800 dark:hover:bg-white/5"
                >
                  {/* Table icon instead of user image */}
                  <span className="relative flex items-center justify-center w-10 h-10 bg-red-100 rounded-full dark:bg-red-900/20">
                    <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 14.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    {/* Animated pulse dot */}
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                  </span>

                  <div className="flex-1">
                    <div className="mb-1.5 space-x-1 text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-medium text-gray-800 dark:text-white/90">
                        Table {table.table_No}
                      </span>
                      <span>needs assistance</span>
                      <span className="text-xs text-gray-400">
                        (Capacity: {table.capacity})
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-500 text-xs dark:text-gray-400">
                        <span>Help Request</span>
                        <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                        <span>{formatTimeAgo(table.updatedAt || table.createdAt)}</span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleResolveHelp(table._id);
                        }}
                        className="ml-2 bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-xs transition-colors"
                      >
                        Resolve
                      </button>
                    </div>
                  </div>
                </DropdownItem>
              </li>
            ))
          ) : (
            <li className="p-8 text-center text-gray-500 dark:text-gray-400">
              <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="font-medium mb-1">All caught up!</div>
              <div className="text-sm">No help requests at the moment</div>
            </li>
          )}
        </ul>

       
      </Dropdown>
    </div>
  );
}