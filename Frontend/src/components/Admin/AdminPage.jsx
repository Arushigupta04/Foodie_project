
import React, { useState, useEffect } from 'react';
import { Line, Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, BarElement, LineElement, PointElement } from 'chart.js';
import {toast} from "react-toastify"

// Register chart components
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, BarElement, LineElement, PointElement);

const serverURL = "http://localhost:5000";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${serverURL}/api/users`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const userData = await response.json();
        setUsers(userData);
      } catch (error) {
        setError(error.message);
      }
    };

    const fetchOrders = async () => {
      try {
        const response = await fetch(`${serverURL}/api/orders`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }
        const orderData = await response.json();
        setOrders(orderData);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchUsers();
    fetchOrders();
  }, []);
  const handleDelete = async (email, role) => {
    // Prevent deleting Admin users
    if (role === "Admin") {
      toast.error("Admin cannot be deleted!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        style: {
          borderRadius: "8px",          // Rounded corners
          backgroundColor: "#fff",     // White background
          color: "#000",               // Black text for readability
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", // Subtle shadow
        },
      });
      return; // Exit the function early
    }
  
    try {
      const response = await fetch(`http://localhost:5000/api/user`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        toast.success(data.message || "User deleted successfully", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          style: {
            borderRadius: "8px",
            backgroundColor: "#fff",    // White background
            color: "#000",             // Black text for readability
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", // Subtle shadow
          },
        });
  
        // Optionally refetch the user list or update the state
        // fetchUsers();
      } else {
        toast.error(data.error || "Failed to delete user", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          style: {
            borderRadius: "8px",
            backgroundColor: "#fff",    // White background
            color: "#000",             // Black text for readability
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", // Subtle shadow
          },
        });
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("An error occurred while deleting the user", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        style: {
          borderRadius: "8px",
          backgroundColor: "#fff",    // White background
          color: "#000",             // Black text for readability
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", // Subtle shadow
        },
      });
    }
  };
  
  
  
  const totalEarnings = orders.reduce((total, order) => {
    return total + (parseFloat(order.price) * parseInt(order.quantity));
  }, 0);

  const pendingOrders = orders.filter(order => order.status === 'Pending').length;

  const orderStatusCounts = orders.reduce((counts, order) => {
    counts[order.status] = (counts[order.status] || 0) + 1;
    return counts;
  }, {});

  const userRoleCounts = users.reduce((counts, user) => {
    counts[user.role] = (counts[user.role] || 0) + 1;
    return counts;
  }, {});

  const itemsData = {
    labels: ['Combo', 'All-in-1', 'Main Course', 'Sandwiches', 'Drinks', 'Desserts', 'Ice Creams', 'Biryani'],
    datasets: [{
      label: 'Category on Platform',
      data: [30, 20, 50, 10, 70, 40, 30, 40],
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#AFEEEE', '#FF6384', '#C9CBCF', '#32CD32'],
      borderColor: '#fff',
      borderWidth: 2,
    }],
  };

  const monthlySalesData = {
    labels: ['January', 'February', 'March', 'April', 'May'],
    datasets: [{
      label: 'Monthly Sales',
      data: [5000, 7000, 6000, 8000, 9000],
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 2,
      fill: true,
      tension: 0.1,
    }],
  };

  const userRoleData = {
    labels: Object.keys(userRoleCounts),
    datasets: [{
      label: 'User Roles',
      data: Object.values(userRoleCounts),
      backgroundColor: ['#F3C65C', '#F7B733', '#FF6B6B', '#6B8E23'],
      borderColor: '#fff',
      borderWidth: 1,
    }],
  };

  // Static data for the last two cards
  const totalReviews = 150; // Example static data
  const totalProducts = 30; // Example static data

  return (
    <>
      {error ? (
        <div className="error-message">
          <h3>Error</h3>
          <p>{error}</p>
        </div>
      ) : (
        <>
          <div id="wrapper">
            <div id="content-wrapper" className="d-flex flex-column">
              <div id="content">
                <div className="container-fluid" style={{ display: "contents" }}>
                  <div className="d-sm-flex align-items-center justify-content-center mb-4">
                    <h1 className="h3 mb-0 text-gray-800" style={{ textAlign: "center" }}>Dashboard</h1>
                  </div>

                  {/* First Row of Cards */}
                  <div className="row" style={{ justifyContent: "center" }}>
                    <div className="col-xl-3 col-md-6 mb-4">
                      <div className="card shadow h-100 py-2" style={{ backgroundColor: '#007bff' }}>
                        <div className="card-body">
                          <div className="row no-gutters align-items-center">
                            <div className="col mr-2">
                              <div className="text-xs font-weight-bold text-white text-uppercase mb-1">
                                Earnings (Total)
                              </div>
                              <div className="h5 mb-0 font-weight-bold text-white">₹{totalEarnings}</div>
                            </div>
                            <div className="col-auto">
                              <i className="fas fa-calendar fa-2x text-gray-300"></i>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-xl-3 col-md-6 mb-4">
                      <div className="card shadow h-100 py-2" style={{ backgroundColor: '#ffc107' }}>
                        <div className="card-body">
                          <div className="row no-gutters align-items-center">
                            <div className="col mr-2">
                              <div className="text-xs font-weight-bold text-white text-uppercase mb-1">
                                Total Orders
                              </div>
                              <div className="h5 mb-0 font-weight-bold text-white">{orders.length}</div>
                            </div>
                            <div className="col-auto">
                              <i className="fa-solid fa-cart-shopping fa-2x text-gray-300"></i>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-xl-3 col-md-6 mb-4">
                      <div className="card shadow h-100 py-2" style={{ backgroundColor: '#28a745' }}>
                        <div className="card-body">
                          <div className="row no-gutters align-items-center">
                            <div className="col mr-2">
                              <div className="text-xs font-weight-bold text-white text-uppercase mb-1">
                                Total Users
                              </div>
                              <div className="h5 mb-0 font-weight-bold text-white">{users.length}</div>
                            </div>
                            <div className="col-auto">
                              <i className="fas fa-user-plus fa-2x text-gray-300"></i>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Second Row of Cards */}
                  <div className="row" style={{ justifyContent: "center" }}>
                    <div className="col-xl-3 col-md-6 mb-4">
                      <div className="card shadow h-100 py-2" style={{ backgroundColor: '#dc3545' }}>
                        <div className="card-body">
                          <div className="row no-gutters align-items-center">
                            <div className="col mr-2">
                              <div className="text-xs font-weight-bold text-white text-uppercase mb-1">
                                Pending Orders
                              </div>
                              <div className="h5 mb-0 font-weight-bold text-white">{pendingOrders}</div>
                            </div>
                            <div className="col-auto">
                              <i className="fas fa-clock fa-2x text-gray-300"></i>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-xl-3 col-md-6 mb-4">
                      <div className="card shadow h-100 py-2" style={{ backgroundColor: '#17a2b8' }}>
                        <div className="card-body">
                          <div className="row no-gutters align-items-center">
                            <div className="col mr-2">
                              <div className="text-xs font-weight-bold text-white text-uppercase mb-1">
                                Total Reviews
                              </div>
                              <div className="h5 mb-0 font-weight-bold text-white">{totalReviews}</div> {/* Static data */}
                            </div>
                            <div className="col-auto">
                              <i className="fas fa-star fa-2x text-gray-300"></i>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-xl-3 col-md-6 mb-4">
                      <div className="card shadow h-100 py-2" style={{ backgroundColor: '#6f42c1' }}>
                        <div className="card-body">
                          <div className="row no-gutters align-items-center">
                            <div className="col mr-2">
                              <div className="text-xs font-weight-bold text-white text-uppercase mb-1">
                                Total Products
                              </div>
                              <div className="h5 mb-0 font-weight-bold text-white">{totalProducts}</div> {/* Static data */}
                            </div>
                            <div className="col-auto">
                              <i className="fas fa-box fa-2x text-gray-300"></i>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>


                  {/* Graphs */}
                  <div className="row" style={{ justifyContent: "center" }}>
                    {/* Items on Platform */}
                    <div className="col-xl-4 col-md-6 mb-4">
                      <div className="card shadow h-100 py-2">
                        <div className="card-header py-3">
                          <h6 className="m-0 font-weight-bold text-primary">Items on Platform</h6>
                        </div>
                        <div className="card-body">
                          <div className="chart-container" style={{ width: '100%', height: '300px' }}>
                            <Pie data={itemsData} />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Monthly Sales */}
                    <div className="col-xl-4 col-md-6 mb-4">
                      <div className="card shadow h-100 py-2">
                        <div className="card-header py-3">
                          <h6 className="m-0 font-weight-bold text-primary">Monthly Sales</h6>
                        </div>
                        <div className="card-body">
                          <div className="chart-container" style={{ width: '100%', height: '300px' }}>
                            <Line data={monthlySalesData} />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* User Roles */}
                    <div className="col-xl-4 col-md-6 mb-4">
                      <div className="card shadow h-100 py-2">
                        <div className="card-header py-3">
                          <h6 className="m-0 font-weight-bold text-primary">User Roles</h6>
                        </div>
                        <div className="card-body">
                          <div className="chart-container" style={{ width: '100%', height: '300px' }}>
                            <Bar data={userRoleData} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Users Overview */}
                  <div className="row" style={{ justifyContent: "center" }}>
  <div className="col-xl-10 col-lg-12 mb-4">
    <div
      className="card shadow h-100 py-2"
      style={{ border: "1px solid gray" }}
    >
      <div className="card-header py-3">
        <h6 className="m-0 font-weight-bold text-primary">Users Overview</h6>
      </div>
      <div className="card-body">
        <div className="table-responsive">
          <table
            className="table table-bordered"
            style={{ border: "1px solid gray", width: "100%" }}
            cellSpacing="0"
          >
            <thead style={{ backgroundColor: "#f8f9fc", fontWeight: "bold" }}>
              <tr>
              <th
  style={{
    border: "1px solid gray",
    backgroundColor: "#007bff", // Blue background
    color: "white",            // White text
    textAlign: "center",       // Center-align text
    padding: "10px",           // Add some padding for spacing
  }}
>
  Full Name
</th>
<th
  style={{
    border: "1px solid gray",
    backgroundColor: "#007bff",
    color: "white",
    textAlign: "center",
    padding: "10px",
  }}
>
  Email
</th>
<th
  style={{
    border: "1px solid gray",
    backgroundColor: "#007bff",
    color: "white",
    textAlign: "center",
    padding: "10px",
  }}
>
  Role
</th>
<th
  style={{
    border: "1px solid gray",
    backgroundColor: "#007bff",
    color: "white",
    textAlign: "center",
    padding: "10px",
  }}
>
 Delete Use
</th>

              </tr>
            </thead>
            <tbody>
  {users.map((user) => (
    <tr key={user._id}>
      <td>{user.fullName}</td>
      <td>{user.email}</td>
      <td>{user.role}</td>
      <td style={{ textAlign: "center" }}>
        <button
          onClick={() => handleDelete(user.email, user.role)}
          style={{
            border: "1px solid gray",
            backgroundColor: "#007bff",
            color: "white",
            padding: "5px 10px",
            borderRadius: "4px",
            cursor: "pointer",
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = "red";
            e.target.style.color = "white";
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = "#007bff";
            e.target.style.color = "white";
          }}
        >
          Delete User
        </button>
      </td>
    </tr>
  ))}
</tbody>


          </table>
        </div>
      </div>
    </div>
  </div>
</div>

                </div>
                <div className="row" style={{ justifyContent: "center", marginTop: "20px" }}>
  <div className="col-auto">
    <a
      href="http://localhost:3000/admin/add-items"
      className="btn btn-primary"
      style={{
        fontSize: "18px",
        padding: "15px 30px",
        width: "200px",
        height: "60px",
        backgroundColor: "#007bff",
        color: "white",
        textAlign: "center",
        lineHeight: "30px", // Center text vertically
        display: "block", // Make button a block-level element
        borderRadius: "8px", // Rounded corners
        textDecoration: "none",
        transition: "background-color 0.3s ease, transform 0.2s ease", // Hover transitions
      }}
      onMouseOver={(e) => {
        e.target.style.backgroundColor = "#0056b3"; // Darker blue on hover
        e.target.style.transform = "scale(1.05)"; // Slight zoom effect
      }}
      onMouseOut={(e) => {
        e.target.style.backgroundColor = "#007bff"; // Reset color
        e.target.style.transform = "scale(1)"; // Reset scale
      }}
    >
      Add New Items
    </a>
  </div>

  <div className="col-auto">
    <a
      href="http://localhost:3000/admin/categories"
      className="btn btn-secondary"
      style={{
      fontSize: "18px",
        padding: "15px 30px",
        width: "200px",
        height: "60px",
        backgroundColor: "#007bff",
        color: "white",
        textAlign: "center",
        paddingLeft: "20px",
        lineHeight: "30px", // Center text vertically
        display: "block", // Make button a block-level element
        borderRadius: "8px", // Rounded corners
        textDecoration: "none",
        transition: "background-color 0.3s ease, transform 0.2s ease",
      }}
      onMouseOver={(e) => {
        e.target.style.backgroundColor = "#0056b3";
        e.target.style.transform = "scale(1.05)";
      }}
      onMouseOut={(e) => {
        e.target.style.backgroundColor = "#007bff";
        e.target.style.transform = "scale(1)";
      }}
    >
      All Categories Info
    </a>
  </div>

  <div className="col-auto">
    <a
      href="http://localhost:3000/admin/categories1"
      className="btn btn-primary"
      style={{
        fontSize: "18px",
        padding: "15px 30px",
        width: "200px",
        height: "60px",
        backgroundColor: "#007bff",
        color: "white",
        textAlign: "center",
        lineHeight: "30px",
        display: "block",
        borderRadius: "8px",
        textDecoration: "none",
        transition: "background-color 0.3s ease, transform 0.2s ease",
      }}
      onMouseOver={(e) => {
        e.target.style.backgroundColor = "#0056b3";
        e.target.style.transform = "scale(1.05)";
      }}
      onMouseOut={(e) => {
        e.target.style.backgroundColor = "#007bff";
        e.target.style.transform = "scale(1)";
      }}
    >
      All Items Info
    </a>
  </div>
<<<<<<< HEAD
  <div className="col-auto">
    <a
      href="http://localhost:3000/admin/categories1"
      className="btn btn-primary"
      style={{
        fontSize: "18px",
        padding: "15px 30px",
        width: "200px",
        height: "60px",
        backgroundColor: "#007bff",
        color: "white",
        textAlign: "center",
        lineHeight: "30px",
        display: "block",
        borderRadius: "8px",
        textDecoration: "none",
        transition: "background-color 0.3s ease, transform 0.2s ease",
      }}
      onMouseOver={(e) => {
        e.target.style.backgroundColor = "#0056b3";
        e.target.style.transform = "scale(1.05)";
      }}
      onMouseOut={(e) => {
        e.target.style.backgroundColor = "#007bff";
        e.target.style.transform = "scale(1)";
      }}
    >
      All Items Info
    </a>
  </div>

  <div className="col-auto">
    <a
      href="http://localhost:3000/admin/alrect"
      className="btn btn-primary"
      style={{
        fontSize: "18px",
        padding: "15px 30px",
        width: "200px",
        height: "60px",
        backgroundColor: "#007bff",
        color: "white",
        textAlign: "center",
        lineHeight: "30px",
        display: "block",
        borderRadius: "8px",
        textDecoration: "none",
        transition: "background-color 0.3s ease, transform 0.2s ease",
      }}
      onMouseOver={(e) => {
        e.target.style.backgroundColor = "#0056b3";
        e.target.style.transform = "scale(1.05)";
      }}
      onMouseOut={(e) => {
        e.target.style.backgroundColor = "#007bff";
        e.target.style.transform = "scale(1)";
      }}
    >
      All Recent order
    </a>
  </div>
  <div className="col-auto">
    <a
      href="http://localhost:3000/admin/alpay"
      className="btn btn-primary"
      style={{
        fontSize: "18px",
        padding: "15px 30px",
        width: "200px",
        height: "60px",
        backgroundColor: "#007bff",
        color: "white",
        textAlign: "center",
        lineHeight: "30px",
        display: "block",
        borderRadius: "8px",
        textDecoration: "none",
        transition: "background-color 0.3s ease, transform 0.2s ease",
      }}
      onMouseOver={(e) => {
        e.target.style.backgroundColor = "#0056b3";
        e.target.style.transform = "scale(1.05)";
      }}
      onMouseOut={(e) => {
        e.target.style.backgroundColor = "#007bff";
        e.target.style.transform = "scale(1)";
      }}
    >
      All Payment
    </a>
  </div>

=======
>>>>>>> cbf5890e020779475066abe4027a5b702e2cb306

  <div className="col-auto">
    <a
      href="http://localhost:3000/admin/Review"
      className="btn btn-primary"
      style={{
        fontSize: "18px",
        padding: "15px 30px",
        width: "200px",
        height: "60px",
        backgroundColor: "#007bff",
        color: "white",
        textAlign: "center",
        lineHeight: "30px",
        display: "block",
        borderRadius: "8px",
        textDecoration: "none",
        transition: "background-color 0.3s ease, transform 0.2s ease",
      }}
      onMouseOver={(e) => {
        e.target.style.backgroundColor = "#0056b3";
        e.target.style.transform = "scale(1.05)";
      }}
      onMouseOut={(e) => {
        e.target.style.backgroundColor = "#007bff";
        e.target.style.transform = "scale(1)";
      }}
    >
      All Reviews
    </a>
  </div>
</div>

              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default AdminDashboard; 
