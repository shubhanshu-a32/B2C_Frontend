import { useEffect } from 'react';

export default function ContactUs() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    return (
        <>
            <meta charSet="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Contact Us | Ketalog</title>
            {/* Tailwind CSS */}
            {/* Font Awesome Icons */}
            <link
                rel="stylesheet"
                href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
            />
            {/* Contact Section */}
            <section className="min-h-screen flex items-center justify-center px-4 py-12 bg-gray-50 dark:bg-gray-900">
                <div className="max-w-6xl w-full bg-white dark:bg-gray-800 rounded-md shadow-lg overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2">
                        {/* LEFT : CONTACT FORM */}
                        <div className="p-6 sm:p-10">
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">Contact Us</h2>
                            <form id="contactForm" className="space-y-4 sm:space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter your name"
                                        required=""
                                        className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        required=""
                                        className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Message
                                    </label>
                                    <textarea
                                        rows={5}
                                        placeholder="Write your message"
                                        required=""
                                        className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                                        defaultValue={""}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-blue-600 dark:bg-blue-700 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 dark:hover:bg-blue-600 transition"
                                >
                                    Submit
                                </button>
                            </form>
                        </div>
                        {/* RIGHT : CONTACT DETAILS */}
                        <div className="bg-gray-800 dark:bg-gray-900 text-white p-6 sm:p-10 flex flex-col justify-between">
                            <div>
                                <h2 className="text-2xl sm:text-3xl font-bold mb-6">Get in Touch</h2>
                                <p className="text-blue-100 dark:text-blue-200 mb-8 text-sm sm:text-base">
                                    Feel free to contact us for any queries or support.
                                </p>
                                <div className="space-y-5">
                                    {/* Phone */}
                                    <div className="flex items-start gap-4">
                                        <i className="fa-solid fa-phone text-lg sm:text-xl mt-1" />
                                        <div>
                                            <p className="font-semibold">Phone</p>
                                            <a href="tel:+919589916322" className="hover:underline text-sm sm:text-base">
                                                +91 9589916322
                                            </a>
                                        </div>
                                    </div>
                                    {/* WhatsApp */}
                                    <div className="flex items-start gap-4">
                                        <i className="fa-brands fa-whatsapp text-lg sm:text-xl mt-1" />
                                        <div>
                                            <p className="font-semibold">WhatsApp</p>
                                            <a
                                                href="https://wa.me/919589916322"
                                                target="_blank"
                                                className="hover:underline text-sm sm:text-base"
                                                rel="noreferrer"
                                            >
                                                +91 9589916322
                                            </a>
                                        </div>
                                    </div>
                                    {/* Email */}
                                    <div className="flex items-start gap-4">
                                        <i className="fa-solid fa-envelope text-lg sm:text-xl mt-1" />
                                        <div>
                                            <p className="font-semibold">Email</p>
                                            <a
                                                href="mailto:ketalog2025@gmail.com"
                                                className="hover:underline text-sm sm:text-base break-all"
                                            >
                                                ketalog2025@gmail.com
                                            </a>
                                        </div>
                                    </div>
                                    {/* Address */}
                                    <div className="flex items-start gap-4">
                                        <i className="fa-solid fa-location-dot text-lg sm:text-xl mt-1" />
                                        <div>
                                            <p className="font-semibold">Address</p>
                                            <a
                                                href="https://www.google.com/maps/search/?api=1&query=Ketalog+Pvt+Ltd+Ahmedabad+Gujarat"
                                                target="_blank"
                                                className="hover:underline leading-relaxed text-sm sm:text-base"
                                                rel="noreferrer"
                                            >
                                                Ketalog Katni-483501,
                                                <br /> Madhya Pradesh, India
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* SOCIAL ICONS */}
                            <div className="mt-10">
                                <p className="font-semibold mb-4">Follow Us</p>
                                <div className="flex gap-4">
                                    <a
                                        href="https://www.facebook.com/ketalog.ecommerce/"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-gray-800 text-gray-800 dark:text-white hover:bg-blue-100 dark:hover:bg-gray-700"
                                    >
                                        <i className="fa-brands fa-facebook-f" />
                                    </a>
                                    <a
                                        href="https://www.instagram.com/ketalog.in/"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-gray-800 text-gray-800 dark:text-white hover:bg-blue-100 dark:hover:bg-gray-700"
                                    >
                                        <i className="fa-brands fa-instagram" />
                                    </a>
                                    <a
                                        href="https://www.linkedin.com/company/ketalog/"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-gray-800 text-gray-800 dark:text-white hover:bg-blue-100 dark:hover:bg-gray-700"
                                    >
                                        <i className="fa-brands fa-linkedin-in" />
                                    </a>
                                    <a
                                        href="https://x.com/ketalog_in"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-gray-800 text-gray-800 dark:text-white hover:bg-blue-100 dark:hover:bg-gray-700"
                                    >
                                        <i className="fa-brands fa-x-twitter" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
