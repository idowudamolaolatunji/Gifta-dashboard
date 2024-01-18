import React, { useEffect, useState } from 'react'
import Header from './Components/Header'
import { useAuthContext } from '../../Auth/context/AuthContext';

import DataTable from 'react-data-table-component';
import { dateConverter, getInitials, numberConverter } from '../../utils/helper';
import DashboardModal from '../../Components/Modal';
import CurrencyInput from 'react-currency-input-field';
import { PaystackButton } from 'react-paystack';
import Alert from '../../Components/Alert';
import { AiFillCheckCircle, AiFillExclamationCircle } from 'react-icons/ai';
import Spinner from '../../Components/Spinner';
import { useNavigate } from 'react-router-dom';
import GiftLoader from '../../Assets/images/gifta-loader.gif';
import { FiMinus, FiPlus } from "react-icons/fi";



function Message({ type }) {
    return (<p className="no-pcontent-message">No {type} transactions</p>)
}

const customStyles = {
    rows: {
        style: {
            minHeight: '58px',
        },
    },
}

const customModalStyle = {
    minHeight: "auto",
    maxWidth: "45rem",
    width: "45rem",
};
const customWithdrawalModalStyle = {
    minHeight: "auto",
    maxWidth: "50rem",
    width: "50rem",
};


const columns = [
    {
        name: "Amount",
        selector: (row) => "₦ " + numberConverter(row.amount),
    },
    {
        name: "Transaction Status",
        selector: (row) => (
            <span className={`status status--${row.status === "pending" ? "pending" : "success"}`}>
                <p>{row.status}</p>
            </span>
        ),
    },
    {
        name: "Reference",
        selector: (row) => row.reference,
    },
    {
        name: "Date",
        selector: (row) => dateConverter(row.createdAt),
        sortable: true,
    },
];

function Wallet() {
    const { user, token } = useAuthContext();
    const [wallet, setWallet] = useState({});
    const [transactions, setTransactions] = useState([]);
    const [activeTab, setActiveTab] = useState('deposit');
    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showDepositModal, setShowDepositModal] = useState(false);
    const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);
    const [helpReset, setHelpReset] = useState(false);


    const [email, setEmail] = useState(user.email);
    const [amount, setAmount] = useState();
    const [isError, setIsError] = useState(false);
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    const deposit = transactions.filter(transaction => transaction.purpose === 'deposit');
    const gifting = transactions.filter(transaction => transaction.purpose === 'gifting');
    const withdrawal = transactions.filter(transaction => transaction.purpose === 'withdrawal');
    const reminder = transactions.filter(transaction => transaction.purpose === 'reminder');
    const subscription = transactions.filter(transaction => transaction.purpose === 'subscription');
    const wishes = transactions.filter(transaction => transaction.purpose === 'wishes');

    const navigate = useNavigate();


    let charges;
    function calcTotalAmount(amount) {
        const calcChargesAmount = (3 / 100) * amount;
        if (calcChargesAmount > 3000) {
            charges = 3000;
        } else {
            charges = calcChargesAmount;
        }
        return amount + charges;
    }

    const publicKey = "pk_test_ec63f7d3f340612917fa775bde47924bb4a90af7"
    const amountInKobo = calcTotalAmount(Number(amount)) * 100;
    const componentProps = {
        email,
        amount: amountInKobo,
        metadata: {
            name: user?.fullName,
        },
        publicKey,
        text: "Pay!",
        onSuccess: ({ reference }) => {
            handlePayment(reference);
            setShowDepositModal(false);
        },
        onClose: () => handleFailure('Transaction Not Completed!'),
    };


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

    const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    };

    async function handlePayment(reference) {
        try {
            handleReset();
            setIsLoading(true);
            setHelpReset(false);
            const res = await fetch(`https://test.tajify.com/api/transactions/payment-verification/${reference}/${charges}`, {
                method: 'POST',
                headers,
            });
            console.log(helpReset)
            if (!res.ok) throw new Error('Something went wrong!');
            const data = await res.json();
            console.log(res, data)
            if (data.success === 'fail') {
                throw new Error(data?.message);
            }
            setIsSuccess(true);
            setMessage("Deposit Successful!");
            setTimeout(() => {
                setIsSuccess(false);
                setMessage("");
                setHelpReset(true);
            }, 2000);
        } catch (err) {
            handleFailure(err.message)
        } finally {
            setIsLoading(false);
        }
    }


    useEffect(function () {
        async function handleWalletTransaction() {
            try {
                setIsLoading(true);
                setShowDepositModal(false)
                const [walletRes, transactionsRes] = await Promise.all([
                    fetch(`https://test.tajify.com/api/wallet/`, { headers }),
                    fetch(`https://test.tajify.com/api/transactions/my-transactions`, { headers }),
                ]);

                if (!walletRes.ok || !transactionsRes.ok) {
                    throw new Error('Something went wrong!');
                }
                const walletData = await walletRes.json();
                const transactionData = await transactionsRes.json();
                if (walletData.status !== 'success' || transactionData.status !== 'success') {
                    throw new Error(walletData.message || transactionData.message)
                }
                setWallet(walletData.data.wallet);
                setTransactions(transactionData.data.myTransactions);
            } catch (err) {
                console.log(err.message);
            } finally {
                setIsLoading(false)
            }
        }
        handleWalletTransaction();
    }, [helpReset]);


    return (
        <>
            {isLoading && (
                <div className='gifting--loader'>
                    <img src={GiftLoader} alt='loader' />
                </div>
            )}
            <Header />
            <section className='section wallet__section'>
                <div className="section__container wallet--container">

                    <span onClick={() => navigate(-1)} className='wishlist--back-btn'>Back</span>


                    <div className="wallet--top">
                        <div className="wallet--user-info">
                            {(user?.image === "") ? (
							<img
								alt={user?.fullName + " 's image"}
								src={`https://test.tajify.com/asset/users/${user?.image}`}
							/> 
                            ) : (
                                <span className="user__img-initials">
                                    {getInitials(user?.fullName || user.username)}
                                </span>
                            )}
                            <div>
                                <p className="wallet--user-name">{user.fullName || user.username}</p>
                                <span className='wallet--user-balance'>
                                    <span>₦</span>
                                    <span>{numberConverter(wallet?.walletBalance || 0)}</span>
                                </span>
                                <span className='wallet--buttons'>
                                    <span className="wallet--button" onClick={() => setShowDepositModal(true)}>Fund Wallet <FiPlus className='wallet--icon' /></span>
                                    <span className="wallet--button" onClick={() => setShowWithdrawalModal(true)}>Withdraw <FiMinus className='wallet--icon' /></span>
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="wallet--bottom">
                        <span>
                            <div className="wallet--head-title">
                                <h3 className="wallet--heading">Transactions History</h3>
                                <select className="wallet--tabs-mobile" value={activeTab} onChange={(e) => { setActiveTab(e.target.value) }}>
                                    <option value="deposit">Deposit</option>
                                    <option value="reminder">Reminder</option>
                                    <option value="giftings">Giftings</option>
                                    <option value="wishes">Wishes</option>
                                    <option value="withdrawal">Withdrawal</option>
                                    <option value="subscription">Subscription</option>
                                </select>
                            </div>



                            <div className="wallet--tabs">
                                <span className={`wallet--tab ${activeTab === "deposit" && "tab--active"}`} onClick={() => { setActiveTab("deposit") }}>Deposit</span>
                                <span className={`wallet--tab ${activeTab === "reminder" && "tab--active"}`} onClick={() => { setActiveTab("reminder") }}>Reminder</span>
                                <span className={`wallet--tab ${activeTab === "giftings" && "tab--active"}`} onClick={() => { setActiveTab("giftings") }}>Giftings</span>
                                <span className={`wallet--tab ${activeTab === "wishes" && "tab--active"}`} onClick={() => { setActiveTab("wishes") }}>Wishes</span>
                                <span className={`wallet--tab ${activeTab === "withdrawal" && "tab--active"}`} onClick={() => { setActiveTab("withdrawal") }}>Withdrawal</span>
                                <span className={`wallet--tab ${activeTab === "subscription" && "tab--active"}`} onClick={() => { setActiveTab("subscription") }}>Subscription</span>
                            </div>
                        </span>


                        <DataTable
                            columns={columns}
                            data={activeTab === 'deposit' ? deposit : activeTab === 'withdrawal' ? withdrawal : activeTab === 'reminder' ? reminder : activeTab === 'giftings' ? gifting : activeTab === 'wishes' ? wishes : activeTab === 'subscription' ? subscription : ''}
                            pagination
                            noDataComponent={<Message type={activeTab} />}
                            customStyles={customStyles}
                            selectableRows
                        />
                    </div>
                </div>
            </section>


            {showDepositModal && (
                <DashboardModal setShowDashboardModal={setShowDepositModal} customStyle={customModalStyle} title={
                    <>
                        Make Deposit{' '}
                        <picture style={{ transform: 'translateY(-.6rem)' }}>
                            <source srcset="https://fonts.gstatic.com/s/e/notoemoji/latest/1f389/512.webp" type="image/webp" />
                            <img src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f389/512.gif" alt="🎉" width="32" height="32" />
                        </picture>
                    </>
                }>
                    <span className='modal--info'> Ensure accuracy when funding your wallet to avoid transaction errors. Proceed with caution!</span>

                    <form className="pay--form" onSubmit={e => e.preventDefault()} style={{ marginTop: '.8rem' }}>
                        <div className="form--item">
                            <label htmlFor="email" className="form--label">Email</label>
                            <input type="email" id='email' required placeholder='Email Address' name='email' value={email} onChange={e => setEmail(e.target.value)} className="form--input" />
                        </div>
                        <div className="form--item">
                            <label htmlFor="amount" className="form--label">Amount</label>
                            <CurrencyInput
                                className='form--input'
                                decimalsLimit={0}
                                prefix='₦ '
                                placeholder='Amount to pay'
                                defaultValue={amount}
                                value={amount}
                                onValueChange={(value, _) => setAmount(value)}
                                required
                            />
                        </div>
                        <div className="form--item">
                            {(email && amount) ? (
                                <PaystackButton type='submit' className="form--button" {...componentProps} />

                            ) : (
                                <button type='submit' className="form--button">Pay!</button>
                            )}
                        </div>
                    </form>
                </DashboardModal>
            )}

            {(showWithdrawalModal) && (
                <DashboardModal setShowDashboardModal={setShowWithdrawalModal} customStyle={customWithdrawalModalStyle} title={
                    <>
                        Make a Withdrawal{' '}
                        <picture style={{ transform: 'translateY(-.6rem)' }}>
                            <source srcset="https://fonts.gstatic.com/s/e/notoemoji/latest/1f911/512.webp" type="image/webp" />
                            <img src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f911/512.gif" alt="🤑" width="32" height="32" />
                        </picture>
                    </>
                }>
                    <span className='modal--info'>Withdrawals are final. Confirm your details and available balance before initiating. Proceed with caution.!</span>
                    <form className="pay--form">

                        <div className="form--item">
                            <label className="form--label" htmlFor="amount">
                                Withdrawal Amount
                            </label>
                            <CurrencyInput
                                id="amount"
                                className="form--input"
                                placeholder="Enter Your Desired Amount"
                                defaultValue={amount}
                                value={amount}
                                decimalsLimit={2}
                                required
                                prefix="₦ "
                                onValueChange={(value, _) => setAmount(value)}
                            />
                        </div>

                        <div className="form--flex">
                            <div className="form--item">
                                <label className="form--label" htmlFor="bank">
                                    Bank Name
                                </label>
                                <input
                                    className="form--input"
                                    type="text"
                                    id="bank"
                                    // onChange={(e) => setBankName(e.target.value)}
                                    // value={bankName}
                                    required
                                    placeholder="Your Bank"
                                />
                            </div>

                            <div className="form--item">
                                <label className="form--label" htmlFor="acct-num">
                                    Account Number
                                </label>
                                <input
                                    className="form--input"
                                    type="number"
                                    id="acct-num"
                                    // onChange={(e) => setAcctNumber(e.target.value)}
                                    // value={acctNumber}
                                    required
                                    placeholder="Your Acct Number"
                                />
                            </div>
                        </div>

                        <div className="form--flex">
                            <div className="form--item">
                                <label className="form--label" htmlFor="acct-name">
                                    Account Name
                                </label>
                                <input
                                    className="form--input"
                                    type="text"
                                    id="acct-name"
                                    // onChange={(e) => setHolderName(e.target.value)}
                                    // value={holderName}
                                    required
                                    placeholder="Holder's Name"
                                />
                            </div>

                            <div className="form--item">
                                <label className="form--label" htmlFor="password">
                                    Password Confirmation
                                </label>
                                <input
                                    className="form--input"
                                    type="password"
                                    id="password"
                                    // onChange={(e) => setPassword(e.target.value)}
                                    // value={password}
                                    required
                                    placeholder="Password Confirmation"
                                />
                            </div>
                        </div>

                        <div className="form--item">
                            <button className="form--submit">Withdrawal Request</button>
                        </div>
                    </form>
                </DashboardModal>
            )}


            <Alert alertType={`${isSuccess ? "success" : isError ? "error" : ""}`}>
                {isSuccess ? (
                    <AiFillCheckCircle className="alert--icon" />
                ) : isError && (
                    <AiFillExclamationCircle className="alert--icon" />
                )}
                <p>{message}</p>
            </Alert>
        </>
    )
}

export default Wallet
