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
import OTPInput from 'react-otp-input';
import GiftLoader from '../../Assets/images/gifta-loader.gif';


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

const customStyleModal = {
	minHeight: "auto",
	maxWidth: "44rem",
	width: "44rem",
    zIndex: 30000
};

const containerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '2.4rem'
}

const inputStyle = {
    width: '5.2rem',
    height: '5.2rem',
    fontSize: '2rem',
    border: '1.6px solid #ccc',
    borderRadius: '.4rem',
    color: '#444',
}


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
        name: "Delivery Status",
        selector: (row) => (
            <span className={`status status--${!row.isDelivered ? "pending" : "success"}`}>
                <p>{row.isDelivered ? 'Delivered' : 'Pending'}</p>
            </span>
        ),
    },
    {
        name: "Delivery Date",
        selector: (row) => expectedDateFormatter(row.deliveryDate),
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
];

const Spinner = () => <p style={{ padding: '2rem', fontSize: '1.8rem', fontWeight: '500' }}>Loading...</p>
function Message() {
    return (<p className="modal--info" style={{ margin: '2rem auto' }}>You have No Order (0)</p>)
}


function Order() {
    const [isLoading, setIsLoading] = useState(false);
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState({});
    const [showOrderModal, setShowOrderModal] = useState(false);

    const [isError, setIsError] = useState(false);
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [helpReset, setHelpReset] = useState(false);

    const [orderId, setOrderId] = useState(null);
    const [showAcceptModal, setShowAcceptModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [activeTab, setActiveTab] = useState('all');

    const [deliveryCode, setDeliveryCode] = useState('');

    const { user, token, handleSetOrder } = useAuthContext();
    const navigate = useNavigate();

    const all = orders;
    const pendingOrders = all?.filter(order => order?.status === 'pending' || !order?.isDelivered);
    const deliveredOrders = all?.filter(order => order?.status === 'delivered' || order?.isDelivered);

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

    function handleOrderActions(id, type) {
        setOrderId(id);
        if(type === 'accept') {
            setShowAcceptModal(true);
            console.log(true)
        }else {
            setShowRejectModal(true)
        }
    }

    function handleOrderRow(order) {
        setShowOrderModal(true);
        setSelectedOrder(order);
    }


    useEffect(function () {
        document.title = 'Gifta | My Orders';

        window.scrollTo(0, 0)
    }, []);

    // console.log(orders)



    async function handleAcceptOrder() {
        try {
            handleReset();
            setIsLoading(true);
            setHelpReset(false);

            // const res = await fetch(`http://localhost:3010/api/orders/accept-order/${selectedOrder?._id}`, {
            const res = await fetch(`https://test.tajify.com/api/orders/accept-order/${selectedOrder?._id}`, {
                method: 'PATCH',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            });

            if (!res.ok) throw new Error('Something went wrong!');
            const data = await res.json();
            if (data.status !== "success") throw new Error(data.message);
            const count = data?.data?.orders?.filter(order => !order.isDelivered && !order.isRejectedOrder);

            setIsSuccess(true);
            setMessage(data.message);
            setShowOrderModal(false);
            setTimeout(() => {
                setSelectedOrder(data?.data?.order);
                setIsSuccess(false);
                setMessage("");
                setShowOrderModal(true);
                setHelpReset(true);
                handleSetOrder(data.data.orders, count.length);
            }, 2000);

        } catch (err) {
            handleFailure(err.message)
        } finally {
            setIsLoading(false);
        }
    }

    async function handleRejectOrder() {
        try {
            handleReset();
            setIsLoading(true);

            const res = await fetch(`https://test.tajify.com/api/orders/reject-order/${selectedOrder?._id}`, {
                method: 'PATCH',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            });

            if (!res.ok) throw new Error('Something went wrong!');
            const data = await res.json();
            if (data.status !== "success") throw new Error(data.message);
            const count = data?.data?.orders?.filter(order => !order.isDelivered && !order.isRejectedOrder);

            setIsSuccess(true);
            setMessage(data.message);
            setShowOrderModal(false);
            setTimeout(() => {
                setSelectedOrder(data?.data?.order);
                setIsSuccess(false);
                setMessage("");
                setShowOrderModal(true);
                setHelpReset(true);
                handleSetOrder(data.data.orders, count.length);
            }, 2000);

        } catch (err) {
            handleFailure(err.message);
        } finally {
            setIsLoading(false);
        }
    }


    return (
        <>

            {isLoading && (
                <div className='gifting--loader'>
                    <img src={GiftLoader} alt='loader' />
                </div>
            )}

            <Header />

            <section className="product__section section">
                <div className="section__container">
                    <div className="section--head">
                        <span onClick={() => navigate(-1)} className='wishlist--back-btn'>Back</span>

                        <span className='section--flex-two' style={{ marginBottom: '2rem' }}>
                            <p className='section__heading' style={{ margin: '0', fontSize: '2.8rem', fontWeight: '500' }}>My Orders</p>
                            <div className="wallet--tabs">
                                <span className={`wallet--tab ${activeTab === "all" && "tab--active"}`} onClick={() => { setActiveTab("all") }}>All Orders({all.length})</span>
                                <span className={`wallet--tab ${activeTab === "pending" && "tab--active"}`} onClick={() => { setActiveTab("pending") }}>Pending({pendingOrders.length})</span>
                                <span className={`wallet--tab ${activeTab === "delivered" && "tab--active"}`} onClick={() => { setActiveTab("delivered") }}>Delivered({deliveredOrders.length})</span>
                            </div>

                            <select className="wallet--tabs-mobile" value={activeTab} onChange={(e) => { setActiveTab(e.target.value) }}>
                                <option value="all">All Orders({all.length})</option>
                                <option value="pending">Pending({pendingOrders.length})</option>
                                <option value="delivered">Delivered({deliveredOrders.length})</option>
                            </select>
                        </span>
                    </div>


                    <DataTable
                        columns={columns}
                        data={(activeTab === 'all') ? all : (activeTab === 'pending') ? pendingOrders : (activeTab === 'delivered') ? deliveredOrders : ''}
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
                                <img src={`https://test.tajify.com/asset/others/${selectedOrder?.celebrantImage}`} />
                                <div>
                                    <p>For {selectedOrder?.celebrant}</p>
                                    <span className="gift--preview-amount"><IoPricetagOutline /><p>Amount: <span>{`₦${numberConverter(selectedOrder?.amount)}`}</span></p></span>
                                    <span className="gift--preview-amount"><GiReceiveMoney /><p>Quantity: <span>{selectedOrder?.quantity}</span></p></span>
                                </div>
                            </div>
                            <span className="gift--preview-title"> Delivery Location <IoLocationSharp style={{ color: '#bb0505' }} /></span>
                            <p style={{ fontSize: '1.4rem' }}>{selectedOrder?.address}</p>


                            {(!selectedOrder?.isAcceptedOrder || !selectedOrder?.isRejectedOrder) && (
                                <div className="gift--preview-actions">
                                    <button type='button ' onClick={() => handleOrderActions(selectedOrder._id, 'accept')}>Accept Order </button>
                                    <button type='button btn--submit' onClick={() => handleOrderActions(selectedOrder._id, 'reject')}>Reject Order</button>
                                </div>
                            )}

                            {selectedOrder?.isAcceptedOrder && (
                                <div className='order--code-box' style={{ gap: '2.4rem' }}>
                                    <span className='order-stat accepted-stat'>
                                        <AiFillCheckCircle className='order--icon' />
                                        You Approved This Order!
                                    </span>
                                    <OTPInput
                                        value={deliveryCode}
                                        onChange={setDeliveryCode}
                                        numInputs={4}
                                        inputStyle={inputStyle}
                                        containerStyle={containerStyle}
                                        renderInput={(props) => <input {...props} />}
                                    />
                                    <button type='button' className='order--code-btn'>Confirm</button>
                                </div>
                            )}

                            {selectedOrder?.isRejectedOrder && (
                                <div className='order--code-box'>
                                    <span className='order-stat rejected-stat'>
                                        <AiFillExclamationCircle className='order--icon' />
                                        You Rejected This Order!
                                    </span>
                                </div>
                            )}

                            {selectedOrder?.isDelivered && (
                                <div className='order--code-box'>
                                    <span className='order-stat delivered-stat'>
                                        <AiFillCheckCircle className='order--icon' />
                                        Order Delivered!
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </MobileFullScreenModal>
            )}


            {(showAcceptModal || showRejectModal) && (
                <DashboardModal customStyle={customStyleModal} overLayZIndex={true} title={`${showAcceptModal ? 'Accept' : 'Reject'} this order!`} setShowDashboardModal={showAcceptModal ? setShowAcceptModal : setShowRejectModal}>
                    <p className='modal--text-2'>Are you sure you want to {showAcceptModal ? 'accept' : 'reject'} this Order?</p>
                    <span className='modal--info'>Note that everything relating data to this wish would also be deleted including transaction history!</span>
                    <div className="reminder--actions" style={{ marginTop: '1.4rem' }}>
                        <button type='button' className='cancel--btn' onClick={() => showAcceptModal ? setShowAcceptModal(false) : setShowRejectModal(false)}>Cancel</button>
                        <button type='submit' className='set--btn' onClick={showAcceptModal ? handleAcceptOrder : handleRejectOrder}>{showAcceptModal ? 'Accept' : 'Reject'} Order</button>
                    </div>
                </DashboardModal>
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
