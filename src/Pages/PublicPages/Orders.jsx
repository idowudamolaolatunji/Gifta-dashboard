import React, { useEffect, useState } from 'react'
import { useAuthContext } from '../../Auth/context/AuthContext';
import DataTable from 'react-data-table-component';
import { dateConverter, expectedDateFormatter, numberConverter } from '../../utils/helper';
import Header from './Components/Header';
import DashboardModal from '../../Components/Modal';
import MobileFullScreenModal from '../../Components/MobileFullScreenModal';
import { IoLocationSharp, IoPricetagOutline } from 'react-icons/io5';
import { TfiGift } from 'react-icons/tfi';
import { CiCalendar } from 'react-icons/ci';
import { MdArrowBackIos } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { GiReceiveMoney } from 'react-icons/gi';
import Alert from '../../Components/Alert';
import { AiFillCheckCircle, AiFillExclamationCircle } from 'react-icons/ai';


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
                    <img src={`https://test.tajify.com/asset/products/${row?.gift?.image}`} alt={row?.gift?.name} />
                    <span>
                        <p>{row?.gift?.name}</p>
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

const Spinner = () => <p style={{ padding: '2rem', fontSize: '1.8rem', fontWeight: '500' }}>Loading...</p>
function Message() {
    return (<p className="modal--info" style={{ margin: '2rem auto'}}>You have No Order (0)</p>)
}


function Order() {
    const [isLoading, setIsLoading] = useState(true);
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState({});
    const [showOrderModal, setShowOrderModal] = useState(false);

    const [isError, setIsError] = useState(false);
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [helpReset, setHelpReset] = useState(false);

    const { user, token } = useAuthContext();
    const navigate = useNavigate();


    // HANDLE FETCH STATE RESET
    function handleReset() {
        setIsError(false);
        setMessage('')
        setIsSuccess(false);
    }

    // HANDLE ON FETCH FAILURE
    function handleFailure(mess) {
        setIsError(true);
        setMessage(mess)
        setTimeout(() => {
            setIsError(false);
            setMessage('')
        }, 3000);
    }

    async function handleOrders() {
        try {
            setIsLoading(true)
            const res = await fetch('https://test.tajify.com/api/orders', {
                method: 'GET',
                headers: {
                    "Content-Type": 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });

            if(!res.ok) throw new Error('Something went wrong!');

            const data = await res.json();
            if(data?.status !== "success") {
                throw new Error(data.message);
            }
            setOrders(data?.data?.orders);
        } catch(err) {     
            console.log(err);
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(function() {
        handleOrders()
    }, [helpReset]);


    function handleOrderRow(order) {
        setShowOrderModal(true);
        setSelectedOrder(order);
    }


    useEffect(function() {
		document.title = 'Gifta | My Orders';

        window.scrollTo(0, 0)
	}, []);

    console.log(orders)



    async function handleAcceptOrder() {
        try {
            handleReset();
            setIsLoading(true);
            setHelpReset(false);

            const res = await fetch(`https://test.tajify.com/api/orders/accept-order/${selectedOrder._id}`, {
                method: 'PATCH',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            });

            if(!res.ok) throw new Error('Something went wrong!');
            const data = await res.json();
            if(data.status !== "success") throw new Error(data.message);

            setIsSuccess(true);
            setMessage(data.message);
            setShowOrderModal(false);
            setTimeout(() => {
                setIsSuccess(false);
                setMessage("");
                setShowOrderModal(true);
                setHelpReset(true);
            }, 2000);

        } catch(err) {
            handleFailure(err.message)
        } finally {
            setIsLoading(false);
        }
    }

    async function handleRejectOrder() {
        try {
            handleReset();
            setIsLoading(true);


        } catch(err) {
            handleFailure(err.message);
        } finally {
            setIsLoading(false);
        }
    }


    return (
        <>

            <Header />

            <section className="product__section section">
                <div className="section__container">
                    <div className="section--head">
                        <span onClick={() => navigate(-1)} className='wishlist--back-btn'>Back</span>

                        <p className='section__heading' style={{ fontSize: '2.8rem', fontWeight: '500' }}>My Orders</p>
                    </div>


                    <DataTable
                        columns={columns}
                        data={orders}
                        pagination
                        persistTableHead
                        highlightOnHover
                        progressPending={isLoading}
                        progressComponent={<Spinner />}
                        customStyles={customStyles}
                        onRowMouseEnter={handleOrderRow}
                        noDataComponent={<Message />}
                    />
                </div>
            </section>

            {showOrderModal && (
                <MobileFullScreenModal>
                <div className="gift--preview-figure">
                    
                    <div className="gift--preview-top">
                        <img src={`https://test.tajify.com/asset/products/${selectedOrder?.gift.image}`} alt={selectedOrder?.celebrant} />
                        <div className="gift--preview-details">
                            <span onClick={() => setShowOrderModal(false)}><MdArrowBackIos /></span>
                            <p className="gift--preview-name">For {selectedOrder?.gift.name}</p>
                            <p className="gift--preview-date">
                                <CiCalendar />
                                {expectedDateFormatter(selectedOrder?.deliveryDate)}
                            </p>
                        </div>
                    </div>

                    <div className="gift--preview-bottom">
                        <span className="gift--preview-title"> Purchased For <TfiGift style={{ color: '#bb0505' }} /></span>
                        <div className="gift--preview-flex">
                            {/* <img src={`https://test.tajify.com/asset/users/${selectedOrder?.gifter?.image}` } /> */}
                            <img src={`https://test.tajify.com/asset/others/${selectedOrder?.celebrantImage}` } />
                            <div>
                                {/* <p>{selectedOrder?.gifter?.fullName || selectedOrder?.gifter?.username}</p> */}
                                <p>{selectedOrder?.celebrant}</p>
                                <span className="gift--preview-price"><GiReceiveMoney /><p>Quantity: {selectedOrder?.quantity}</p></span>
                                <span className="gift--preview-price"><IoPricetagOutline /><p>Amount: {`${numberConverter(selectedOrder?.amount)}`}</p></span>
                            </div>
                        </div>
                        <span className="gift--preview-title"> Delivery Location <IoLocationSharp style={{ color: '#bb0505' }} /></span>
                        <p style={{ fontSize: '1.4rem' }}>{selectedOrder?.address}</p>


                        <div className="gift--preview-actions">
                            <button type='button' onClick={handleAcceptOrder}>Accept Order </button>
                            <button type='button' onClick={handleRejectOrder}>Reject Order</button>
                        </div>
                    </div>
                </div>
            </MobileFullScreenModal>
            )}


            {(isError || isSuccess) && (
                <Alert alertType={`${isSuccess ? "success" : isError ? "error" : ""}`}>
                    {isSuccess ? (
                        <AiFillCheckCircle className="alert--icon" />
                    ) : isError && (
                        <AiFillExclamationCircle className="alert--icon" />
                    )}
                    <p>{message}</p>
                </Alert>
            )}

        </>
    )
}

export default Order
