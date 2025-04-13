import React from 'react';
import PropTypes from 'prop-types';
// Import the BASE CSS for the component itself
import './stylesheet/DashBoardTable.css';

const DashboardTable = ({
                            columns,
                            data,
                            tabs,
                            activeTab, // Now controlled by parent
                            onTabChange,
                            className = '', // Allows parent to add specific wrapper classes
                            emptyMessage = 'No data available.',
                        }) => {
    const handleTabClick = (tabName) => {
        if (onTabChange) {
            onTabChange(tabName); // Notify parent component of tab change
        }
    };

    const displayedData = data || [];

    return (
        // Base container class + any custom class from parent
        <div className={`dashboard-table-container ${className}`}>
            {/* Tabs Navigation (only if tabs are provided) */}
            {tabs && tabs.length > 0 && (
                <div className="dashboard-table-tabs">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            className={`dashboard-table-tab ${activeTab === tab ? 'dashboard-table-tab-active' : ''}`}
                            onClick={() => handleTabClick(tab)}
                            type="button"
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            )}

            {/* Table Wrapper for Responsiveness */}
            <div className="dashboard-table-wrapper">
                <table className="dashboard-table-table">
                    <thead className="dashboard-table-header">
                    <tr className="dashboard-table-header-row">
                        {columns.map((col) => (
                            <th
                                key={col.accessor || col.header}
                                // Base class + any specific class from column definition
                                className={`dashboard-table-header-cell ${col.headerClassName || ''}`}
                                style={col.headerStyle || {}}
                            >
                                {col.header}
                            </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody className="dashboard-table-body">
                    {displayedData.length > 0 ? (
                        displayedData.map((row, rowIndex) => (
                            <tr key={row.id || rowIndex} className="dashboard-table-row">
                                {columns.map((col) => (                                    <td
                                        key={`${col.accessor}-${rowIndex}`}
                                        // Base class + any specific class from column definition
                                        className={`dashboard-table-cell ${col.cellClassName || ''} ${col.isClickable ? 'dashboard-table-cell-clickable' : ''}`}
                                        style={col.cellStyle || {}}
                                        data-label={col.header} // For mobile CSS
                                        onClick={col.isClickable && row[col.accessor] ? () => col.onCellClick(row) : undefined}
                                    >
                                        {col.cellRenderer
                                            ? col.cellRenderer(row[col.accessor], row, col)
                                            : row[col.accessor]}
                                    </td>
                                ))}
                            </tr>
                        ))
                    ) : (
                        <tr className="dashboard-table-row-empty">
                            <td
                                className="dashboard-table-cell-empty"
                                colSpan={columns.length}
                            >
                                {emptyMessage}
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// --- PropTypes ---
DashboardTable.propTypes = {
    columns: PropTypes.arrayOf(
        PropTypes.shape({
            header: PropTypes.string.isRequired,
            accessor: PropTypes.string.isRequired,
            cellRenderer: PropTypes.func,
            headerClassName: PropTypes.string,
            cellClassName: PropTypes.string,
            headerStyle: PropTypes.object,
            cellStyle: PropTypes.object,
        })
    ).isRequired,
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
    tabs: PropTypes.arrayOf(PropTypes.string),
    activeTab: PropTypes.string, // Active tab is now passed as a prop
    onTabChange: PropTypes.func,
    className: PropTypes.string,
    emptyMessage: PropTypes.string,
};

export default DashboardTable;