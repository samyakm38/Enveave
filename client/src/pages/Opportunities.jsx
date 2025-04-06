// Opportunities.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Header from "../components/main components/Header.jsx";
import Footer from "../components/main components/Footer.jsx";
import OpportunityCard from "../components/main components/OpportunityCard.jsx"; // Use the original Card
import '../stylesheet/Opportunities.css'; // Import the CSS
import { formatDistanceToNow } from 'date-fns'; // Import date formatting function
import { useNavigate } from 'react-router-dom';



// Debounce function
const debounce = (func, delay) => {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
};

// Helper function to safely format date
const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date'; // Handle null/undefined dates
    try {
        // Format to "X days ago", "about X hours ago", etc.
        return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
        console.error("Error formatting date:", dateString, error);
        return 'Invalid date'; // Handle potential parsing errors
    }
};


const Opportunities = () => {
    const [opportunities, setOpportunities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [hasNextPage, setHasNextPage] = useState(true);
    const [nextCursor, setNextCursor] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    const observer = useRef();
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL; // Ensure this env var is set
    const navigate = useNavigate();

    const lastOpportunityElementRef = useCallback(node => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasNextPage) {
                fetchOpportunities(nextCursor, searchTerm); // Fetch next batch
            }
        });

        if (node) observer.current.observe(node);
    }, [loading, hasNextPage, nextCursor, searchTerm]);

    const fetchOpportunities = useCallback(async (cursor = null, search = '') => {
        // Prevent fetching if no more pages (unless it's a new search without cursor)
        if (!hasNextPage && cursor) return;
        // Prevent concurrent fetches during pagination
        if (loading && cursor) return;

        setLoading(true);
        setError(null);
        // Reset initial load flag only if it's truly the first fetch or a new search
        if (!cursor) setIsInitialLoad(true);

        const url = new URL(`${apiBaseUrl}/opportunities/feed`);
        url.searchParams.append('limit', 9); // Adjust limit as needed
        if (cursor) {
            url.searchParams.append('cursor', cursor);
        }
        if (search && search.trim()) {
            url.searchParams.append('search', search.trim());
            // If starting a new search, don't use the old cursor
            if (!cursor) {
                setOpportunities([]); // Clear results for new search
                setNextCursor(null);
                setHasNextPage(true); // Assume new search might have results
            }
        }
        // Add filter params here later if needed

        console.log("Fetching URL:", url.toString());

        try {
            const response = await fetch(url.toString());
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const result = await response.json();

            console.log("API Response:", result);

            if (result.data?.opportunities) {
                // Append if cursor exists (pagination), replace if not (initial load/new search)
                setOpportunities(prev => cursor ? [...prev, ...result.data.opportunities] : result.data.opportunities);
                setHasNextPage(result.data.pageInfo?.hasNextPage ?? false);
                setNextCursor(result.data.pageInfo?.nextCursor ?? null);
            } else {
                // Handle empty or unexpected data structure
                if (!cursor) setOpportunities([]); // Clear if initial load yielded no data
                setHasNextPage(false);
                setNextCursor(null);
                console.warn("No opportunities found in response data or data structure mismatch.");
            }

        } catch (err) {
            console.error("Failed to fetch opportunities:", err);
            setError(err.message || 'Failed to load opportunities.');
            // Decide error handling: maybe stop pagination, maybe allow retry?
            // setHasNextPage(false);
        } finally {
            setLoading(false);
            // Mark initial load as finished *after* the first fetch attempt completes
            if (!cursor) setIsInitialLoad(false);
        }
    }, [apiBaseUrl, loading, hasNextPage]); // fetchOpportunities dependencies

    const debouncedSearch = useCallback(
        debounce((searchValue) => {
            fetchOpportunities(null, searchValue); // Trigger fetch with null cursor for new search
        }, 500), // 500ms delay
        [fetchOpportunities] // Dependency is stable fetchOpportunities
    );

    const handleSearchChange = (event) => {
        const value = event.target.value;
        setSearchTerm(value);
        debouncedSearch(value);
    };

    // Initial data load effect
    useEffect(() => {
        // Fetch only if opportunities are empty AND it's the first time (isInitialLoad is true)
        if (opportunities.length === 0 && isInitialLoad) {
            fetchOpportunities(null, searchTerm);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isInitialLoad, fetchOpportunities]); // Depend on isInitialLoad and the stable fetch function

    const handleCardClick = (id) => {
        if (id) {
            navigate(`/opportunities/${id}`);
        } else {
            console.error("Cannot navigate: Opportunity ID is missing.");
            // Optionally show an error to the user
        }
    };


    return (
        <>
            <Header />
            <div className="opportunities-page">
                <div className="opportunities-header">
                    <h1 className="opportunities-title">Explore Opportunities</h1>
                    <div className="opportunities-search-container">
                        <input
                            type="text"
                            placeholder="Search opportunities..."
                            className="opportunities-search-input"
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                        <svg className="opportunities-search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor"> {/* Example Search Icon */}
                            <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/>
                        </svg>
                    </div>
                </div>

                {error && <p className="opportunities-error">Error: {error}</p>}

                <div className="opportunities-grid">
                    {opportunities.map((opp, index) => {
                        const isLastElement = opportunities.length === index + 1;

                        // Prepare props for the original OpportunityCard
                        const cardProps = {
                            imageSrc: opp.provider?.organizationDetails?.logo || '/images/default-opportunity.png', // Provide a default image path
                            title: opp.basicDetails?.title || 'Untitled Opportunity',
                            organization: opp.provider?.auth?.organizationName || 'Unknown Organization',
                            location: opp.schedule?.location || 'Location not specified',
                            description: opp.basicDetails?.description || 'No description provided.',
                            timestamp: formatDate(opp.createdAt) // Format date here before passing
                        };

                        return (
                            <div
                                key={opp._id || index} // IMPORTANT: Use opp._id
                                onClick={() => handleCardClick(opp._id)} // Add onClick handler
                                style={{cursor: 'pointer'}} // Add pointer cursor
                                ref={isLastElement ? lastOpportunityElementRef : null} // Keep ref on the wrapper
                            >
                                <OpportunityCard
                                    {...cardProps}
                                    // Pass any other necessary props to OpportunityCard itself
                                    // Note: The ref is now on the parent div, not the card directly
                                />
                            </div>
                        );
                    })}
                </div>

                {loading && <p className="opportunities-loader">Loading...</p>}

                {!loading && !hasNextPage && opportunities.length > 0 && (
                    <p className="opportunities-end-message">You&#39;ve seen all opportunities!</p>
                )}

                {!loading && !isInitialLoad && opportunities.length === 0 && !error && (
                    <p className="opportunities-loader">No opportunities found.</p>
                )}
            </div>
            <Footer/>
        </>
    );
};

export default Opportunities;