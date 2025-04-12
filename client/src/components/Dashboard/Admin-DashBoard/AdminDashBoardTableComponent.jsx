import React from 'react';
import PropTypes from 'prop-types';
import './stylesheet/AdminDashboardTableComponent.css'; // We'll create this CSS file next

const AdminDashboardTableComponent = ({ columns, data }) => {
    if (!columns || !data) {
        return <div>Loading table data...</div>; // Or some placeholder
    }

    return (
        <div className="admin-dashboard-table-component-wrapper">
            <table className="admin-dashboard-table-component-table">
                <thead className="admin-dashboard-table-component-thead">
                <tr className="admin-dashboard-table-component-tr-head">
                    {columns.map((col) => (
                        <th
                            key={col.accessor}
                            className="admin-dashboard-table-component-th"
                        >
                            {col.header}
                        </th>
                    ))}
                </tr>
                </thead>
                <tbody className="admin-dashboard-table-component-tbody">
                {data.map((row, rowIndex) => (
                    <tr key={rowIndex} className="admin-dashboard-table-component-tr-body">
                        {columns.map((col) => (
                            <td
                                key={`${col.accessor}-${rowIndex}`}
                                className="admin-dashboard-table-component-td"
                                data-label={col.header} // Helpful for responsive designs
                            >
                                {col.render
                                    ? col.render(row) // Use custom render function if provided
                                    : row[col.accessor] /* Otherwise display data directly */
                                }
                            </td>
                        ))}
                    </tr>
                ))}
                {data.length === 0 && (
                    <tr className="admin-dashboard-table-component-tr-body">
                        <td colSpan={columns.length} className="admin-dashboard-table-component-td admin-dashboard-table-component-no-data">
                            No data available.
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
};

// Define prop types for better component usage and error checking
AdminDashboardTableComponent.propTypes = {
    columns: PropTypes.arrayOf(PropTypes.shape({
        header: PropTypes.string.isRequired,
        accessor: PropTypes.string.isRequired,
        render: PropTypes.func, // Optional custom render function for a cell
    })).isRequired,
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default AdminDashboardTableComponent;