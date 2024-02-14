import React, { useEffect, useState } from 'react'
import { useAuthContext } from '../../Auth/context/AuthContext';
import DataTable from 'react-data-table-component';
import { dateConverter, numberConverter } from '../../utils/helper';
import Header from './Components/Header';

const customStyles = {
	head: {
		style: {
			fontSize: "12px",
			fontWeight: "bold",
			color: "#777",
            minHeight: '100px',
		},
	},
	rows: {
        style: {
            minHeight: '100px',
            cursor: 'pointer'
        },
    },
};


const columns = [
    {
        name: "Order Details",
        selector: (row) => {
            return (
                <div className="table-flex table-product">
                    {/* <img src={`https://test.tajify.com/asset/others/${row?.gift.image}`} alt={row?.gift.name} /> */}
                    <img src={row?.gift.image}  />
                    <span>
                        <p>{row?.gift.name}</p>
                        <p>Quantity: {row?.quantity}</p>
                        <p>Purpose: {row?.purpose}</p>
                    </span>
                </div>
            );
        },
        width: '250px'
    },
    {
        name: "Gifter Email",
        selector: (row) => row.gifter?.email,
        width: '250px'
    },
    {
        name: "Amount",
        selector: (row) => `₦${numberConverter(row.amount)}`,
    },
    {
        name: "Delivery Location",
        selector: (row) => `${row.state}, ${row.country}`,
    },
    {
        name: "Order Date",
        selector: (row) => dateConverter(row.createdAt),
    },
    {
        name: "Delivery Date",
        selector: (row) => dateConverter(row.deliveryDate),
    },
    {
        name: "Delivery Status",
        selector: (row) => row.isDelivered,
    },
];

const Spinner = () => <p>Loading...</p>

function Order() {
    const [isLoading, setIsLoading] = useState(false);
    const [orders, setOrders] = useState([]);

    const { user, token } = useAuthContext();


    async function handleOrders() {
        try {
            const res = await fetch('https://test.tajify.com/api/orders', {
                method: 'GET',
                headers: {
                    "Content-Type": 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });

            console.log(res);

            if(!res.ok) throw new Error('Something went wrong!');

            const data = await res.json();
            if(data?.status !== "success") {
                throw new Error(data.message);
            }
            setOrders(data?.data?.orders);
        } catch(err) {     
            console.log(err);
        }
    }

    useEffect(function() {
        handleOrders()
    }, []);


    return (
        <>

            <Header />

            <section className="product__section section">
                <div className="section__container">
                    {/* <span onClick={() => navigate(-1)} className='wishlist--back-btn'>Back</span> */}
                    <p className='section__heading' style={{ fontSize: '2.8rem', fontWeight: '500' }}>Orders</p>

                    <DataTable
                        columns={columns}
                        data={orders}
                        pagination
                        persistTableHead
                        highlightOnHover
                        progressPending={isLoading}
                        progressComponent={<Spinner />}
                        customStyles={customStyles}
                    />

                </div>
            </section>

        </>
    )
}

export default Order
