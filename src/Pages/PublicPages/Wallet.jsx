import React, { useEffect, useState } from 'react'
import Header from './Components/Header'
import { useAuthContext } from '../../Auth/context/AuthContext';

import DataTable from 'react-data-table-component';
import { dateConverter, numberConverter } from '../../utils/helper';
import DashboardModal from '../../Components/Modal';
import CurrencyInput from 'react-currency-input-field';
import { PaystackButton } from 'react-paystack';
import Alert from '../../Components/Alert';
import { AiFillCheckCircle, AiFillExclamationCircle } from 'react-icons/ai';
import Spinner from '../../Components/Spinner';


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


    let charges;
    function calcTotalAmount(amount) {
        // let charges;
        const calcChargesAmount = (3 / 100) * amount;
        if (calcChargesAmount > 3000) {
            charges = 3000;
        } else {
            charges = calcChargesAmount;
        }
        return amount + charges;
        // return [charges, amount + charges];
    }

    const publicKey = "pk_test_8fa5be5a113286b23f7775fe7f34c94ffd338c8c"
    const amountInKobo = calcTotalAmount(Number(amount)) * 100;
    const componentProps = {
        email,
        amount: amountInKobo,
        publicKey,
        text: "Pay!",
        onSuccess: ({ reference }) => handlePayment(reference),
        onClose: () => handleFailure('Transaction Not Completed!'),
    };
   

    // HANDLE ON FETCH FAILURE
    function handleFailure(mess) {
        setIsError(true);
        setMessage(mess)
        setTimeout(() => {
            setIsError(false);
            setMessage('')
        }, 2000);
    }

    async function handlePayment(reference) {
        try {
            setIsLoading(true);
            const res = fetch(`http://localhost:3010/api/transactions/payment-verification/${reference}/${charges}`, {
                method: 'POST',
                headers,
            });
            
            if(!res.ok) throw new Error('Something went wrong!');
            const data = await res.json();
            console.log(res, data);
            setMessage(data.message);
			setIsSuccess(true);
			setTimeout(() => {
				setIsError(false);
				setMessage("");
                setShowModal(false);
			}, 1500);
        } catch(err) {
            handleFailure(err.message)
        } finally {
            setIsLoading(false)
        }
    }

    const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    };

    useEffect(function() {
        async function handleWalletTransaction() {
            try {
                setIsLoading(true);
                const [walletRes, transactionsRes] = await Promise.all([
                    fetch(`http://localhost:3010/api/wallet/`, { headers }),
                    fetch(`http://localhost:3010/api/transactions/my-transactions`, { headers }),
                ]);
                console.log(walletRes, transactionsRes);

                if(!walletRes.ok || !transactionsRes.ok) {
                    throw new Error('Something went wrong!');
                }
                const walletData = await walletRes.json();
                const transactionData = await transactionsRes.json();
                if(walletData.status !== 'success' || transactionData.status !== 'success') {
                    throw new Error(walletData.message || transactionData.message)
                }
                setWallet(walletData.data.wallet);
                setTransactions(transactionData.data.myTransactions);
            } catch(err) {
                console.log(err.message);
            } finally {
                setIsLoading(false)
            }
        }
        handleWalletTransaction();
    }, []);


  return (
    <>
        {isLoading && (
            <div className='gifting--loader'>
                <Spinner />
            </div>
        )}
        <Header />
        <section className='section wallet__section'>
            <div className="section__container wallet--container">
                <div className="wallet--top">
                    <div className="wallet--user-info">
                        <img src={user.image} alt={user.username} />
                        <div>
                            <p className="wallet--user-name">{user.fullName || user.username}</p>
                            <span className='wallet--user-balance'>
                                <span>₦</span>
                                <span>{numberConverter(wallet?.walletBalance || 0)}</span>
                            </span>
                            <span className='wallet--buttons'>
                                <span className="wallet--button" onClick={() => setShowModal(true)}>Deposit</span>
                                <span className="wallet--button">Withdrawal</span>
                            </span>
                        </div>
                    </div>
                </div>

                <div className="wallet--bottom">
                    <span>
						<h3 className="wallet--heading">Transactions History</h3>
						<div className="wallet--tabs">
							<span className={`wallet--tab ${activeTab === "deposit" && "tab--active"}`} onClick={() => { setActiveTab("deposit")}}>Deposit</span>
							<span className={`wallet--tab ${activeTab === "reminder" && "tab--active"}`} onClick={() => { setActiveTab("reminder")}}>Reminder</span>
							<span className={`wallet--tab ${activeTab === "giftings" && "tab--active"}`} onClick={() => { setActiveTab("giftings")}}>Giftings</span>
							<span className={`wallet--tab ${activeTab === "wishes" && "tab--active"}`} onClick={() => { setActiveTab("wishes")}}>Wishes</span>
							<span className={`wallet--tab ${activeTab === "withdrawal" && "tab--active"}`} onClick={() => { setActiveTab("withdrawal")}}>Withdrawal</span>
							<span className={`wallet--tab ${activeTab === "subscription" && "tab--active"}`} onClick={() => { setActiveTab("subscription")}}>Subscription</span>
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


        {showModal && (
            <DashboardModal setShowDashboardModal={setShowModal} customStyle={customModalStyle} title={
                <>
                    Make Deposit{' '}
                    <picture style={{ transform: 'translateY(-.6rem)'}}>
                        <source srcset="https://fonts.gstatic.com/s/e/notoemoji/latest/1f389/512.webp" type="image/webp" />
                        <img src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f389/512.gif" alt="🎉" width="32" height="32" />
                    </picture>
                </>
            }>
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
