// Import images from local assets folder
import { useEffect } from 'react';
import bannerImage from './assets/images/banner abouts us image.png';
import fastDeliveryImg from './assets/images/Fast delivery.png';
import onlineShoppingImg from './assets/images/Online Shopping.png';
import localSellersImg from './assets/images/Local Sellers.png';
import manShoppingImg from './assets/images/man shopping image.png';

export default function AboutKetalog() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <>
            <meta charSet="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>About Ketalog</title>
            {/* Tailwind CSS CDN */}
            {/* ================= HERO SECTION (REDUCED HEIGHT) ================= */}
            <section className="relative w-full h-[55vh] min-h-[360px] flex items-center justify-center">
                {/* Background Image */}
                <img
                    src={bannerImage}
                    alt="Ketalog Banner"
                    className="absolute inset-0 w-full h-full object-cover object-center"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40" />
                {/* Content */}
                <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
                        About Ketalog
                    </h1>
                    <p className="text-base sm:text-lg md:text-xl text-gray-200 mb-8 px-0 md:px-20 lg:px-40">
                        A smarter way to shop essentials, groceries, and lifestyle products —
                        all from trusted local sellers.
                    </p>
                    <a
                        href="https://ketalog.in/contact-us"
                        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl transition shadow-lg text-sm sm:text-base"
                    >
                        Contact Us
                    </a>
                </div>
            </section>
            {/* ================= FEATURE ICON SECTION ================= */}
            <section className="max-w-[1200px] mx-auto px-4 sm:px-6 py-10 sm:py-14 bg-white dark:bg-gray-900">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 text-center">
                    {/* Feature 1 */}
                    <div className="flex flex-col items-center">
                        <div className="w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 mb-4">
                            <img
                                src={fastDeliveryImg}
                                alt="Fast Delivery"
                                className="w-14 h-14 sm:w-16 sm:h-16"
                            />
                        </div>
                        <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">Fast Delivery</h3>
                        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 text-center px-4 sm:px-6 md:px-10">
                            Quick and reliable delivery from nearby sellers to your doorstep.
                        </p>
                    </div>
                    {/* Feature 2 */}
                    <div className="flex flex-col items-center">
                        <div className="w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 mb-4">
                            <img
                                src={onlineShoppingImg}
                                alt="Online Shopping"
                                className="w-14 h-14 sm:w-16 sm:h-16"
                            />
                        </div>
                        <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">Online Shopping</h3>
                        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 text-center px-4 sm:px-6 md:px-10">
                            Simple ordering experience with transparent pricing.
                        </p>
                    </div>
                    {/* Feature 3 */}
                    <div className="flex flex-col items-center sm:col-span-2 md:col-span-1">
                        <div className="w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 mb-4">
                            <img
                                src={localSellersImg}
                                alt="Local Sellers"
                                className="w-12 h-12 sm:w-14 sm:h-14"
                            />
                        </div>
                        <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">Local Sellers</h3>
                        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 text-center px-4 sm:px-6 md:px-10">
                            Supporting local businesses through a unified digital platform.
                        </p>
                    </div>
                </div>
            </section>
            {/* ================= ABOUT KETALOG SECTION ================= */}
            <section className="bg-gray-50 dark:bg-gray-800 py-12 sm:py-16">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
                        {/* LEFT CONTENT */}
                        <div className="order-2 lg:order-1">
                            <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">What Ketalog Does?</h2>
                            <div className="w-16 h-1 bg-blue-600 dark:bg-blue-500 rounded mb-6" />
                            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                                Ketalog is a modern, multi-category e-commerce platform designed to
                                make everyday shopping faster, simpler, and more reliable. We bring
                                together groceries, daily essentials, and lifestyle products from
                                verified local sellers, allowing customers to find everything they
                                need in one convenient place.
                            </p>
                            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                                From product discovery to doorstep delivery, Ketalog streamlines the
                                entire shopping journey through a technology-driven approach. Our
                                platform focuses on easy ordering, transparent pricing, and
                                efficient logistics to ensure a smooth and hassle-free purchasing
                                experience for customers and sellers alike.
                            </p>
                            <p className="text-sm sm:text-base text-gray-700 dark:text-gray-200 mb-4 leading-relaxed">
                                Currently serving customers in{' '}
                                <span className="font-semibold text-gray-900 dark:text-white">
                                    Katni, Madhya Pradesh
                                </span>
                                , Ketalog offers fast delivery, dependable service, and access to a
                                wide range of essential products — all backed by trusted local
                                businesses.
                            </p>
                        </div>
                        {/* RIGHT IMAGE */}
                        <div className="relative order-1 lg:order-2">
                            <img
                                src={manShoppingImg}
                                alt="Mobile Shopping"
                                className="w-full h-64 sm:h-80 lg:h-[420px] object-cover rounded-2xl shadow-xl"
                            />
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
