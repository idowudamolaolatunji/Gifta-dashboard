import React, { useEffect, useState } from 'react'
import DashHeader from '../DashBoard/DashboardComponents/DashHeader'
import DashTabs from '../DashBoard/DashboardComponents/DashTabs'
import { useAuthContext } from '../../Auth/context/AuthContext';
import DataTable from 'react-data-table-component';


const columns = [
//     {
//         name: "Order Gift Details",
//         selector: (row) => {
//             return (
//                 <div className="table-flex table-product">
//                     <img src={`https://test.tajify.com/asset/others/${row?.gift.image}`} alt={row?.gift.name} />
//                     <p>{row?.gift.name}</p>
//                 </div>
//             );
//         },
//     },
//     {
//         name: "Gifter Email",
//         selector: (row) => row.gifter.fullName,
//     },
//     {
//         name: "Celebrant Name",
//         selector: (row) => row.celebrant,
//     },
//     {
//         name: "Price",
//         selector: (row) => row.amount,
//     },
//     {
//         name: "State",
//         selector: (row) => row.state,
//     },
//     {
//         name: "Order Date",
//         selector: (row) => dateConverter(row.createdAt),
//     },
//     {
//         name: "Delivery Stat",
//         selector: (row) => row.isDelivered,
//     },
];

function index() {
    const [orders, setOrders] = useState([]);

    const { user, token } = useAuthContext();


    async function handleOrders() {
        try {
            const res = await fetch('http://localhost:3010/api/orders', {
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
            <DashHeader />
            <DashTabs />

            <section className="product__section">
                <div className="section__container">
                    <p className='section__heading'>Orders</p>

                    <DataTable
                        columns={columns}
                        data={orders}
                        pagination
                    />

                </div>
            </section>

        </>
    )
}

export default index
