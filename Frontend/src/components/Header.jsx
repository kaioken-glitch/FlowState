import React, { useState } from 'react'
import logo from '../assets/logodarkmode.svg'
import { FaTasks, FaBell, FaComment, FaMicroscope } from 'react-icons/fa'

export default function Header({ setCurrentPage }) {
    const [searchQuery, setSearchQuery] = useState('')
    const [showResults, setShowResults] = useState(false)
    const [results, setResults] = useState([])

    // Mock search function - replace with actual search logic
    const handleSearch = (query) => {
        setSearchQuery(query)
        
        if (query.length > 0) {
            // Mock results - replace with actual search API call
            const mockResults = [
                {
                    id: 1,
                    title: "Complete project proposal",
                    description: "Finish writing the project proposal for the new client",
                    type: "task",
                    status: "in-progress"
                },
                {
                    id: 2,
                    title: "Team meeting reminder",
                    description: "Weekly standup meeting at 2 PM",
                    type: "notification",
                    status: "pending"
                },
                {
                    id: 3,
                    title: "Message from John",
                    description: "Hey, can we discuss the budget changes?",
                    type: "message",
                    status: "unread"
                }
            ].filter(item => 
                item.title.toLowerCase().includes(query.toLowerCase()) ||
                item.description.toLowerCase().includes(query.toLowerCase())
            )
            
            setResults(mockResults)
            setShowResults(true)
        } else {
            setShowResults(false)
            setResults([])
        }
    }

    const handleInputFocus = () => {
        if (searchQuery.length > 0) {
            setShowResults(true)
        }
    }

    const handleInputBlur = () => {
        // Delay hiding results to allow for clicks
        setTimeout(() => setShowResults(false), 200)
    }

    return (
        <header className="border-b border-neutral-700 text-white p-4
        w-[100%] h-[60px] flex flex-row items-center justify-center mx-auto
        select-none relative">
            <button onClick={() => setCurrentPage('dashboard')} className="flex items-center ml-[20px]
            cursor-pointer">
                <img src={logo} alt="flowstate" className=' w-[110px] h-[40px]'/>
            </button>

            <div className="searchContainer border border-neutral-700 rounded-[6px]
            flex flex-row items-center justify-between ml-[20px] w-[300px] h-[35px] mr-auto relative">
                <input 
                    type="text" 
                    name="search" 
                    id="searchInput" 
                    placeholder='Search...' 
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    className='indent-2 bg-transparent text-white w-[240px] h-full
                    outline-none placeholder:text-neutral-500 font-poppins text-[14px]
                    caret-blue-400' 
                    autoComplete='off' 
                    autoCorrect='off' 
                    spellCheck="false"
                    autoCapitalize="off" 
                    pattern="[A-Za-z0-9 ]*"
                />
                <button className="commandKey border border-neutral-700 rounded-[4px]
                flex items-center justify-center w-[60px] h-[25px] hover:bg-neutral-700 mr-1">
                    <span className="commandKeyText">⌘</span>
                    <span className="commandKeyText">+</span>
                    <span className="commandKeyText">K</span>
                </button>

                {/* Search Results Dropdown */}
                {showResults && (
                    <div className="resultsDiv pt-[5px] pb-2 flex flex-col absolute top-[40px] left-0 w-[400px] 
                    bg-black rounded-[12px] border border-gray-800 z-50">
                        {results.length > 0 ? (
                            <>
                                <div className="px-3 py-2 border-b border-gray-700 ">
                                    <p className="text-[12px] text-gray-500 font-medium">
                                        {results.length} result{results.length !== 1 ? 's' : ''} found
                                    </p>
                                </div>
                                {results.map(item => {
                                    // Determine icon and colors based on item type
                                    const getItemIcon = (type) => {
                                        switch (type) {
                                            case 'task':
                                                return <FaTasks className="text-white w-[14px] h-[14px]" />;
                                            case 'notification':
                                                return <FaBell className="text-white w-[14px] h-[14px]" />;
                                            case 'message':
                                                return <FaComment className="text-white w-[14px] h-[14px]" />;
                                            default:
                                                return <FaMicroscope className="text-white w-[14px] h-[14px]" />;
                                        }
                                    };

                                    const getItemColor = (type, status) => {
                                        switch (type) {
                                            case 'task':
                                                return status === 'completed' ? 'bg-green-500 group-hover:bg-green-600' : 
                                                        status === 'in-progress' ? 'bg-blue-500 group-hover:bg-blue-600' : 
                                                        'bg-gray-500 group-hover:bg-gray-600';
                                            case 'notification':
                                                return 'bg-orange-500 group-hover:bg-orange-600';
                                            case 'message':
                                                return 'bg-purple-500 group-hover:bg-purple-600';
                                            default:
                                                return 'bg-blue-500 group-hover:bg-blue-600';
                                        }
                                    };

                                    return (
                                        <div key={item.id} className="resultItem mx-2 my-1 p-3 rounded-[8px] 
                                        text-gray-950/10 cursor-pointer border border-transparent
                                        hover:bg-gray-900 transition-all duration-200 ease-in-out
                                        group mt-[5px] mb-[5px]"
                                        onClick={() => {
                                            // Handle item click - navigate to item or perform action
                                            console.log('Clicked item:', item)
                                            setShowResults(false)
                                        }}>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className={`iconContainer w-[32px] h-[32px] rounded-[6px] 
                                                    flex items-center justify-center transition-colors duration-200 ${
                                                        getItemColor(item.type, item.status)
                                                    }`}>
                                                        {getItemIcon(item.type)}
                                                    </div>
                                                    <div className="textContent flex-1">
                                                        <div className="flex items-center gap-2">
                                                            <h4 className="text-[14px] font-semibold text-gray-800 group-hover:text-blue-600 
                                                            transition-colors duration-200">{item.title}</h4>
                                                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                                                                item.type === 'task' ? 'bg-blue-100 text-blue-600' :
                                                                item.type === 'notification' ? 'bg-orange-100 text-orange-600' :
                                                                item.type === 'message' ? 'bg-purple-100 text-purple-600' :
                                                                'bg-gray-100 text-gray-600'
                                                            }`}>
                                                                {item.type}
                                                            </span>
                                                        </div>
                                                        <p className="text-[12px] text-gray-500 mt-1 line-clamp-2">
                                                            {item.description || 'Click to view details'}
                                                        </p>
                                                        {item.status && (
                                                            <p className="text-[11px] text-gray-400 mt-1">
                                                                Status: <span className="capitalize">{item.status}</span>
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="arrowIcon opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                    <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </>
                        ) : (
                            <div className="resultItem p-4 text-center">
                                <div className="flex flex-col items-center justify-center py-4">
                                    <div className="iconContainer w-[48px] h-[48px] bg-gray-100 rounded-full 
                                    flex items-center justify-center mb-3">
                                        <FaMicroscope className="text-gray-400 w-[20px] h-[20px]" />
                                    </div>
                                    <p className="text-[14px] text-gray-600 font-medium">No results found</p>
                                    <p className="text-[12px] text-gray-400 mt-1">Try searching for tasks, notifications, or messages</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <nav className="hidden md:flex items-center space-x-6">
                <button onClick={() => setCurrentPage('dashboard')} className="hover:text-blue-400 transition-colors
                flex flex-row items-center gap-2 text-[14px] cursor-pointer">
                    Dashboard
                </button>
                <button onClick={() => setCurrentPage('tasks')} className="hover:text-blue-400 transition-colors
                flex flex-row items-center gap-2 text-[14px] cursor-pointer">
                    All Tasks
                </button>
                <button onClick={() => setCurrentPage('completed')} className="hover:text-blue-400 transition-colors
                flex flex-row items-center gap-2 text-[14px] cursor-pointer">
                    Completed
                </button>
                <button onClick={() => setCurrentPage('analytics')} className="hover:text-blue-400 transition-colors
                flex flex-row items-center gap-2 text-[14px] cursor-pointer">
                    Analytics
                </button>
            </nav>

        </header>
    )
}