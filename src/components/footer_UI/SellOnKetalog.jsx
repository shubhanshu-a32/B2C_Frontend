// Import images and icons from local assets folder
import { useState, useEffect } from 'react';
import sellerImage from './assets/images/seller image.png';
import communityIcon from './assets/icons/community icon.svg';
import walletIcon from './assets/icons/wallet icon.svg';
import arrowIcon from './assets/icons/Arrow Icon.svg';
import callSupportIcon from './assets/icons/Call Support.svg';
import shoppingBagIcon from './assets/icons/Shooping bag.svg';
import accountIcon from './assets/icons/Account Icon.svg';
import iphonePreview from './assets/images/iPhone-13-PRO-ketalog.in (2).png';
import productPageImage from './assets/images/product page image.png';
import paymentImage from './assets/images/7 Days Payment.png';
import homePageImage from './assets/images/home page .png';
import helpImage from './assets/images/help image.png';

export default function SellOnKetalog() {
    const [activeTab, setActiveTab] = useState('create');

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const tabs = [
        { id: 'create', label: 'Create Account', icon: accountIcon },
        { id: 'products', label: 'List Products' },
        { id: 'shipping', label: 'Storage & Shipping' },
        { id: 'payments', label: 'Receive Payments' },
        { id: 'app', label: 'Seller Panel' },
        { id: 'support', label: 'Help & Support' },
    ];

    return (
        <>
            <meta charSet="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Sell on Ketalog</title>

            {/* ================= HERO SECTION ================= */}
            <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-6">
                <div className="relative w-full h-[280px] sm:h-[200px] md:h-[280px] rounded-xl overflow-hidden shadow-lg">
                    {/* Background Image */}
                    <img
                        src={sellerImage}
                        alt="Sell Online"
                        className="absolute inset-0 w-full h-full object-cover"
                        style={{ objectPosition: "80% center" }}
                    />
                    {/* Optional Dark Overlay */}
                    <div className="absolute inset-0 bg-black/30 dark:bg-black/50" />
                    {/* Overlay Content */}
                    <div className="absolute inset-0 flex items-center px-6 sm:px-20 sm:pb-10">
                        <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight drop-shadow-md">
                            Sell Online with Ketalog
                        </h1>
                    </div>
                </div>
            </section>

            {/* ================= FEATURES SECTION ================= */}
            <section className="max-w-[1350px] mx-auto px-4 sm:px-6 lg:px-8">
                <div
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg 
          -mt-10 sm:-mt-16 
          px-4 py-8 
          mb-16 sm:mb-20 
          z-20 relative border border-gray-100 dark:border-gray-700 transition-colors duration-300"
                >
                    <div
                        className="grid 
      grid-cols-2 
      sm:grid-cols-2 
      lg:grid-cols-5
      gap-y-8 gap-x-4
      text-center
      lg:divide-x lg:divide-gray-200 dark:lg:divide-gray-700"
                    >
                        {/* Feature 1 */}
                        <div className="flex flex-col items-center gap-3 text-center px-4">
                            <div className="w-16 h-16 flex items-center justify-center bg-blue-50 dark:bg-gray-700 rounded-full mb-2">
                                <img
                                    src={communityIcon}
                                    className="w-10 h-10 object-contain dark:invert"
                                    alt="Localization"
                                />
                            </div>
                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Localization Focus</p>
                        </div>
                        {/* Feature 2 */}
                        <div className="flex flex-col items-center gap-3 text-center px-4">
                            <div className="w-16 h-16 flex items-center justify-center bg-blue-50 dark:bg-gray-700 rounded-full mb-2">
                                <img
                                    src={walletIcon}
                                    className="w-10 h-10 object-contain dark:invert"
                                    alt="Payments"
                                />
                            </div>
                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                3-7* days secure &amp; regular payments
                            </p>
                        </div>
                        {/* Feature 3 */}
                        <div className="flex flex-col items-center gap-3 text-center px-4">
                            <div className="w-16 h-16 flex items-center justify-center bg-blue-50 dark:bg-gray-700 rounded-full mb-2">
                                <img
                                    src={arrowIcon}
                                    className="w-10 h-10 object-contain dark:invert"
                                    alt="Low Cost"
                                />
                            </div>
                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Low cost of doing business</p>
                        </div>
                        {/* Feature 4 */}
                        <div className="flex flex-col items-center gap-3 text-center px-4">
                            <div className="w-16 h-16 flex items-center justify-center bg-blue-50 dark:bg-gray-700 rounded-full mb-2">
                                <img
                                    src={callSupportIcon}
                                    className="w-10 h-10 object-contain dark:invert"
                                    alt="Support"
                                />
                            </div>
                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">One click Seller Support</p>
                        </div>
                        {/* Feature 5 */}
                        <div className="flex flex-col items-center gap-3 text-center px-4 col-span-2 lg:col-span-1">
                            <div className="w-16 h-16 flex items-center justify-center bg-blue-50 dark:bg-gray-700 rounded-full mb-2">
                                <img
                                    src={shoppingBagIcon}
                                    className="w-10 h-10 object-contain dark:invert"
                                    alt="Offers"
                                />
                            </div>
                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Access the Frequent Offers</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ================= MAIN SECTION ================= */}
            <section className="max-w-[1350px] mx-auto min-h-screen mb-20 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-12 gap-8 w-full">
                    {/* ================= LEFT SIDEBAR ================= */}
                    <div className="col-span-12 lg:col-span-3 self-start">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 lg:p-6 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                            <ul className="space-y-3">
                                {tabs.map((tab) => (
                                    <li key={tab.id}>
                                        <button
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`w-full flex items-center gap-3 px-5 py-3 rounded-lg font-medium transition-all duration-200 ${activeTab === tab.id
                                                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-400 shadow-sm scale-105'
                                                    : 'text-gray-700 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:scale-105'
                                                }`}
                                        >
                                            {tab.icon && (
                                                <img
                                                    src={tab.icon}
                                                    alt={tab.label}
                                                    className={`w-5 h-5 object-contain ${activeTab === tab.id ? '' : 'grayscale opacity-70'} dark:invert`}
                                                />
                                            )}
                                            {tab.label}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* ================= RIGHT CONTENT ================= */}
                    <div
                        className="col-span-12 lg:col-span-9
                        bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 sm:p-10
                        border border-gray-100 dark:border-gray-700
                        min-h-[500px] transition-colors duration-300"
                    >
                        {activeTab === 'create' && (
                            <div className="animate-fadeIn">
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                                    <div className="lg:col-span-8">
                                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                                            Create Account
                                        </h2>
                                        <div className="w-14 h-1 bg-blue-600 rounded mb-4" />
                                        <p className="text-md leading-relaxed text-gray-700 dark:text-gray-300 mb-6">
                                            Creating your <span className="font-semibold">Ketalog</span>{" "}
                                            seller account is a quick and simple process that takes less
                                            than 10 minutes. To get started, you only need to submit three
                                            basic documents. Please follow the checklist carefully to ensure
                                            a smooth and hassle-free account creation experience. Having
                                            these documents ready in advance will help streamline the
                                            registration process and allow you to start selling on Ketalog,
                                            our technology-driven online marketplace, without delay.
                                        </p>
                                        <div className="text-md text-gray-600 dark:text-gray-400 space-y-2 mb-4">
                                            <p>* Terms and conditions apply</p>
                                            <p>
                                                ** Additional verification may be required in certain cases
                                            </p>
                                        </div>
                                        <div className="mt-5 mb-8 bg-gray-50 dark:bg-gray-700/50 rounded-2xl border border-gray-200 dark:border-gray-600 px-8 py-6">
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                                                How to create an Account?
                                            </h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                                                Follow the simple steps below to get started on Ketalog.
                                            </p>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/50">
                                                        <img
                                                            src={accountIcon}
                                                            alt="Register"
                                                            className="w-6 h-6 text-blue-600 dark:text-blue-400"
                                                        />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                            Register by Number
                                                        </p>
                                                        <p className="text-xs text-gray-600 dark:text-gray-400">
                                                            Sign up using your mobile number
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/50">
                                                        <svg
                                                            className="w-6 h-6 text-blue-600 dark:text-blue-400"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth={2}
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                d="M9 12h6m-6 4h6M7 4h10a2 2 0 012 2v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6a2 2 0 012-2z"
                                                            />
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                            Company Details
                                                        </p>
                                                        <p className="text-xs text-gray-600 dark:text-gray-400">
                                                            Enter your business information
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-md leading-relaxed text-gray-700 dark:text-gray-300">
                                            Ketalog provides sellers access to a wide marketplace with 3000+
                                            product categories, enabling you to list and sell a diverse
                                            range of products to a growing customer base. These categories
                                            represent only a portion of the extensive selection available on
                                            the Ketalog platform, offering sellers significant flexibility
                                            and reach.
                                        </p>
                                    </div>
                                    <div className="lg:col-span-4">
                                        <section
                                            style={{
                                                width: '100%',
                                                maxWidth: 280,
                                                margin: "0 auto",
                                                display: "flex",
                                                justifyContent: "center"
                                            }}
                                        >
                                            <div
                                                className="phone-wrapper bg-white dark:bg-black border-8 border-gray-900 dark:border-gray-800 rounded-[2.5rem] overflow-hidden shadow-2xl relative"
                                                style={{ height: 520, width: 260 }}
                                            >
                                                <img
                                                    src={iphonePreview}
                                                    alt="Ketalog Mobile App Preview"
                                                    className="w-full absolute top-0 left-0"
                                                    style={{
                                                        animation: "phoneScroll 18s linear infinite"
                                                    }}
                                                />
                                            </div>
                                        </section>
                                        <style>
                                            {`
                                            @keyframes phoneScroll {
                                                0% { transform: translateY(0%); }
                                                100% { transform: translateY(-85%); }
                                            }
                                            `}
                                        </style>
                                    </div>
                                </div>
                                <div className="mt-8 bg-gray-50 dark:bg-gray-700/50 rounded-xl p-8 border border-gray-100 dark:border-gray-600">
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                                        Popular categories to sell across India
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-8 text-gray-700 dark:text-gray-300 text-sm">
                                        <ul className="space-y-3">
                                            {['Sell Mobile Online', 'Sell Electronics Online', 'Sell Jewellery Online', 'Sell Makeup Online', 'Sell Books Online', 'Sell Beauty Products Online', 'Sell Shirts Online'].map((item, i) => (
                                                <li key={i}><a href="https://ketalog.in" className="hover:text-blue-600 dark:hover:text-blue-400 transition">{item}</a></li>
                                            ))}
                                        </ul>
                                        <ul className="space-y-3">
                                            {['Sell Clothes Online', 'Sell Women Clothes Online', 'Sell Tshirts Online', 'Sell Paintings Online', 'Sell Home Products Online', 'Sell Toys Online', 'Sell Indian Clothes Online'].map((item, i) => (
                                                <li key={i}><a href="https://ketalog.in" className="hover:text-blue-600 dark:hover:text-blue-400 transition">{item}</a></li>
                                            ))}
                                        </ul>
                                        <ul className="space-y-3">
                                            {['Sell Sarees Online', 'Sell Shoes Online', 'Sell Furniture Online', 'Sell Watch Online', 'Sell Kurtis Online', 'Sell Appliances Online'].map((item, i) => (
                                                <li key={i}><a href="https://ketalog.in" className="hover:text-blue-600 dark:hover:text-blue-400 transition">{item}</a></li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'products' && (
                            <div className="animate-fadeIn">
                                <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl mb-8 p-6 lg:p-10">
                                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                                        <div className="lg:col-span-6">
                                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                                                List Products
                                            </h2>
                                            <div className="w-12 h-1 bg-blue-600 rounded mb-6" />
                                            <p className="text-md leading-relaxed text-gray-700 dark:text-gray-300 mb-6">
                                                What is a listing? A listing refers to the process of
                                                registering your product on the{" "}
                                                <span className="font-semibold">Ketalog</span> platform so it
                                                becomes visible to customers and available for purchase.
                                                Creating a listing involves setting up a product page with key
                                                details such as the product name, description, images, price,
                                                and other relevant information.
                                            </p>
                                            <p className="text-md leading-relaxed text-gray-700 dark:text-gray-300 mb-6">
                                                A well-created listing helps customers understand your product
                                                clearly, increases visibility on the platform, and improves
                                                your chances of making successful sales on Ketalog.
                                            </p>
                                        </div>
                                        <div className="lg:col-span-6 flex justify-center items-center">
                                            <img
                                                src={productPageImage}
                                                alt="Ketalog Product Listing Screen"
                                                className="w-full max-w-[500px] rounded-xl shadow-lg object-contain"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl p-6 mb-5">
                                    <div className="flex items-start gap-4">
                                        <svg
                                            className="w-6 h-6 text-yellow-500 mt-1 flex-shrink-0"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                        <p className="text-sm sm:text-md leading-relaxed text-gray-700 dark:text-gray-300">
                                            Did you know that providing accurate and detailed product
                                            information, along with clear and high-quality images, can
                                            increase your product’s visibility on the Ketalog platform by up
                                            to <strong>15%</strong>?
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'shipping' && (
                            <div className="animate-fadeIn">
                                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Storage &amp; Shipping</h2>
                                <div className="w-12 h-1 bg-blue-600 rounded mb-6" />
                                <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300 mb-6 max-w-3xl">
                                    Congratulations on receiving your first order! When it comes to
                                    shipping products to customers,{" "}
                                    <span className="font-semibold">Ketalog</span> understands the
                                    importance of fast, reliable delivery and secure packaging.
                                </p>
                                <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300 mb-6 max-w-3xl">
                                    Ketalog follows a{" "}
                                    <span className="font-semibold">Fulfilment by Ketalog (FBK)</span>{" "}
                                    model, where delivery is managed through our trusted delivery
                                    partner network.
                                </p>
                                <div className="bg-gray-50 dark:bg-gray-700/30 p-6 rounded-xl border border-gray-100 dark:border-gray-600 mb-8">
                                    <p className="text-base font-semibold text-gray-900 dark:text-white mb-4">
                                        Under this model:
                                    </p>
                                    <ul className="list-disc pl-5 space-y-3 text-gray-700 dark:text-gray-300">
                                        <li>Sellers prepare and package the products as per guidelines</li>
                                        <li>Ketalog assigns a delivery partner for order pickup</li>
                                        <li>Products are picked up directly from the seller</li>
                                        <li>
                                            Orders are delivered to customers quickly and efficiently,
                                            typically within 15–20 minutes for daily-need items
                                        </li>
                                    </ul>
                                </div>

                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                                    Fulfilment by Ketalog (FBK)
                                </h3>
                                <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300 mb-6 max-w-4xl">
                                    With Fulfilment by Ketalog (FBK), sellers can eliminate the
                                    complexity of managing deliveries while continuing to handle their
                                    products independently. Ketalog does not store or warehouse
                                    products. Instead, our delivery partner network picks up orders
                                    directly from the seller’s location and delivers them to customers
                                    efficiently.
                                </p>
                                <div className="max-w-4xl bg-blue-50 dark:bg-blue-900/10 p-8 rounded-xl border border-blue-100 dark:border-blue-800">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                                        {[
                                            'Direct pick-up from seller location',
                                            'No warehousing or inventory storage by Ketalog',
                                            'Faster delivery to customers (typically 15–20 minutes)',
                                            'Seamless order pickup and delivery coordination',
                                            'Secure handling during transit',
                                            'Professional delivery partner network',
                                            'Improved customer experience'
                                        ].map((benefit, i) => (
                                            <div key={i} className="flex items-start gap-3">
                                                <span className="text-blue-600 dark:text-blue-400 font-bold">✓</span>
                                                <span className="text-gray-700 dark:text-gray-300 text-sm">{benefit}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'payments' && (
                            <div className="animate-fadeIn">
                                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Receive Payments</h2>
                                <div className="w-12 h-1 bg-blue-600 rounded mb-8" />
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-blue-50 dark:bg-gray-700/30 rounded-xl p-6 lg:p-8 border border-blue-100 dark:border-gray-600">
                                    <div className="lg:col-span-4 flex justify-center">
                                        <img
                                            src={paymentImage}
                                            alt="Receive Payments in 7 Days"
                                            className="w-full max-w-[300px] object-contain drop-shadow-md"
                                        />
                                    </div>
                                    <div className="lg:col-span-8">
                                        <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300 mb-6">
                                            Currently, Ketalog operates exclusively in{" "}
                                            <span className="font-semibold text-gray-900 dark:text-white">Katni, Madhya Pradesh</span>,
                                            allowing sellers to receive orders within serviceable areas,
                                            with payments securely credited directly to the registered bank
                                            account provided during account creation.
                                        </p>
                                        <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300 mb-6">
                                            Seller payments are typically settled within{" "}
                                            <span className="font-semibold text-gray-900 dark:text-white">3–7 days</span>* from the date
                                            of successful order dispatch, helping you manage cash flow
                                            efficiently.
                                        </p>
                                        <a
                                            href="https://ketalog.in/"
                                            className="inline-block text-blue-600 dark:text-blue-400 font-medium hover:underline"
                                        >
                                            Know more about Fees &amp; Commission →
                                        </a>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'app' && (
                            <div className="animate-fadeIn">
                                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Seller App</h2>
                                <div className="w-12 h-1 bg-blue-600 rounded mb-8" />
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center rounded-xl p-6 sm:p-10 border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/30">
                                    <div className="lg:col-span-4 flex justify-center transform hover:scale-105 transition duration-300">
                                        <img
                                            src={homePageImage}
                                            alt="Ketalog Seller App"
                                            className="w-full max-w-[240px] object-contain rounded-2xl shadow-xl"
                                        />
                                    </div>
                                    <div className="lg:col-span-8">
                                        <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
                                            We understand the importance of staying connected to your{" "}
                                            <span className="font-semibold text-gray-900 dark:text-white">Ketalog</span> online business
                                            anytime, anywhere. That’s why we offer the Ketalog Seller
                                            App—your reliable companion for managing your business on the
                                            go.
                                        </p>
                                        <p className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                            With the Seller App, you can conveniently:
                                        </p>
                                        <div className="grid grid-cols-1 gap-y-3">
                                            {[
                                                'Create and manage product listings',
                                                'Manage orders and fulfilment',
                                                'Track inventory in real time',
                                                'View and manage payments',
                                                'Access advertising tools',
                                                'Monitor business insights and performance',
                                                'Get seller support and more'
                                            ].map((feature, i) => (
                                                <div key={i} className="flex items-center gap-3">
                                                    <span className="text-blue-600 dark:text-blue-400 font-bold">✓</span>
                                                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'support' && (
                            <div className="animate-fadeIn">
                                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Help &amp; Support</h2>
                                <div className="w-12 h-1 bg-blue-600 rounded mb-8" />
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                                    <div className="lg:col-span-7">
                                        <p className="text-md leading-relaxed text-gray-700 dark:text-gray-300 mb-6">
                                            What sets <span className="font-semibold text-gray-900 dark:text-white">Ketalog</span> apart
                                            is our dedicated seller support assistance. We prioritize your
                                            needs and are committed to providing timely and reliable help
                                            whenever you have questions, concerns, or require support for
                                            your business.
                                        </p>
                                        <p className="text-md leading-relaxed text-gray-700 dark:text-gray-300 mb-8">
                                            Our experienced support team is available to guide you at
                                            every stage, ensuring a smooth and successful selling
                                            experience on the Ketalog platform. Feel free to reach out
                                            whenever you need assistance—we’re always here to support you.
                                        </p>
                                        <a
                                            href="https://ketalog.in/"
                                            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                        >
                                            Contact Support
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                        </a>
                                    </div>
                                    <div className="lg:col-span-5 flex justify-center">
                                        <img
                                            src={helpImage}
                                            alt="Ketalog Seller Support"
                                            className="w-full max-w-[300px] object-contain rounded-xl"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </>
    );
}
