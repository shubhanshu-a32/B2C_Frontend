import { useEffect } from 'react';

export default function InvestKetalog() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <>
            <meta charSet="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Invest in Ketalog</title>
            <section className="relative flex py-10 lg:py-16 bg-white dark:bg-gray-900 transition-colors duration-300">
                {/* RIGHT DARK BLUE BACKGROUND */}
                <div className="absolute right-0 top-0 h-full w-full lg:w-2/5 bg-[#1f2937] dark:bg-gray-800 hidden lg:block transition-colors duration-300" />
                {/* CONTENT WRAPPER */}
                <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-16 flex items-center">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 w-full items-center">
                        {/* LEFT CONTENT */}
                        <div>
                            <p className="text-blue-600 dark:text-blue-400 font-semibold uppercase tracking-widest mb-4">
                                Contact
                            </p>
                            <h1 className="text-4xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                                Invest in Ketalog
                            </h1>
                            <p className="text-gray-700 dark:text-gray-300 text-lg mb-4 max-w-xl">
                                Ketalog is a technology-driven product delivery platform focused on
                                daily essentials, lifestyle commerce, and scalable logistics
                                solutions.
                            </p>
                            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-xl">
                                We welcome enquiries from investors who are interested in supporting
                                our growth journey. Submit your details to initiate a confidential
                                investment discussion with our leadership team.
                            </p>
                            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 max-w-sm transition-colors duration-300">
                                <p className="text-gray-800 dark:text-gray-200 font-medium mb-1">
                                    Prefer a direct introduction?
                                </p>
                                <p className="text-blue-600 dark:text-blue-400 font-semibold">
                                    <a
                                        href="mailto:ketalog2025@gmail.com"
                                        className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
                                    >
                                        ketalog2025@gmail.com →
                                    </a>
                                </p>
                            </div>
                        </div>
                        <div className="flex justify-center lg:justify-end items-center">
                            <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-xl shadow-xl px-6 py-6 mr-0 lg:mr-20 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                                    Connect With Us
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400 mb-5 text-sm">
                                    Share your details and we will reach out to you.
                                </p>
                                <form className="space-y-4 sm:space-y-3">
                                    {/* Full Name */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Full Name *
                                        </label>
                                        <input
                                            type="text"
                                            required=""
                                            className="w-full rounded border px-3 py-2 text-base border-gray-400 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white hover:border-gray-600 dark:hover:border-gray-500 focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all duration-200"
                                        />
                                    </div>
                                    {/* Email */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Email (official preferred) *
                                        </label>
                                        <input
                                            type="email"
                                            required=""
                                            className="w-full rounded border px-3 py-2 text-base border-gray-400 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white hover:border-gray-600 dark:hover:border-gray-500 focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all duration-200"
                                        />
                                    </div>
                                    {/* Phone */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Phone Number *
                                        </label>
                                        <input
                                            type="tel"
                                            required=""
                                            className="w-full rounded border px-3 py-2 text-base border-gray-400 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white hover:border-gray-600 dark:hover:border-gray-500 focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all duration-200"
                                        />
                                    </div>
                                    {/* Company */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Company / Fund Name
                                        </label>
                                        <input
                                            type="text"
                                            required=""
                                            className="w-full rounded border px-3 py-2 text-base border-gray-400 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white hover:border-gray-600 dark:hover:border-gray-500 focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all duration-200"
                                        />
                                    </div>
                                    {/* Role */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Role / Designation *
                                        </label>
                                        <input
                                            type="text"
                                            required=""
                                            className="w-full rounded border px-3 py-2 text-base border-gray-400 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white hover:border-gray-600 dark:hover:border-gray-500 focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all duration-200"
                                        />
                                    </div>
                                    {/* Message */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Message
                                        </label>
                                        <textarea
                                            rows={3}
                                            className="w-full rounded border px-3 py-2 border-gray-400 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white hover:border-gray-600 dark:hover:border-gray-500 focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all duration-200"
                                            defaultValue={""}
                                        />
                                    </div>
                                    {/* Submit */}
                                    <button
                                        type="submit"
                                        className="w-full bg-[#1f2937] dark:bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 dark:hover:bg-blue-500 transition-colors duration-200"
                                    >
                                        Submit →
                                    </button>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                                        Confidential investment enquiry.
                                    </p>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
