

const Wallet = () => {
  return (
    <div
            className="hover:animate-background rounded-xl bg-gradient-to-r from-red-300 via-red-500 to-pink-600 p-0.5 shadow-xl transition hover:bg-[length:400%_400%] hover:shadow-sm hover:[animation-duration:_4s]"
            >
            <div className="rounded-[10px] bg-white p-4 sm:p-6">
                <p className="block text-xs text-gray-500"> Wallet Balance: </p>

                <a href="#">
                <h3 className="mt-0.5 text-lg font-medium text-gray-900">
                    N40,000
                </h3>
                </a>
            </div>
    </div>
  )
}

export default Wallet