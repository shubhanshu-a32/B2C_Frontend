import { useEffect } from 'react';

export default function DeliveryPartner() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    return (
        <>
            <meta charSet="UTF-8" />
            <title>Delivery Partner | Ketalog.in</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14 bg-gray-50 dark:bg-gray-900">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 sm:p-8 md:p-12">
                    {/* Header */}
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold mb-6 text-gray-900 dark:text-gray-100">
                        Delivery Partner Program
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Last Updated: Jan 2026</p>
                    <br />
                    <br />
                    {/* Intro */}
                    <p className="mb-6 text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                        We, <strong>Ketalog</strong> (hereinafter referred to as "Ketalog",
                        "we", "us", or "our"), operate a technology-enabled e-commerce
                        marketplace that connects sellers directly with buyers. Ketalog does not
                        own, manage, or operate any warehouses or storage facilities. All
                        products are picked up directly from registered sellers and delivered to
                        customers through our delivery partner network.
                    </p>
                    {/* Delivery Time */}
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                        Fast Delivery Commitment (15–20 Minutes)
                    </h2>
                    <p className="mb-6 text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                        Ketalog focuses on quick-commerce delivery for daily-need products.
                        Orders placed on the platform are processed for rapid fulfillment, with
                        an estimated delivery timeline of{' '}
                        <strong>15–20 minutes</strong>, subject to seller readiness, location,
                        traffic, and operational feasibility.
                    </p>
                    <ul className="list-disc list-inside mb-8 space-y-2 text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                        <li>Products are picked up directly from nearby sellers</li>
                        <li>No centralized warehousing or stock holding by Ketalog</li>
                        <li>Delivery timelines may vary based on seller preparation time</li>
                        <li>Quick delivery applies primarily to daily essential items</li>
                    </ul>
                    {/* Products */}
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                        Types of Products Delivered
                    </h2>
                    <p className="mb-6 text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                        Delivery partners may be assigned deliveries across multiple product
                        categories, depending on seller availability and customer demand.
                    </p>
                    <ul className="list-disc list-inside mb-8 space-y-2 text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                        <li>
                            <strong>Daily Essentials:</strong> Fruits, vegetables, groceries,
                            dairy products, beverages, and household necessities.
                        </li>
                        <li>
                            <strong>Clothing &amp; Apparel:</strong> Limited and lightweight
                            apparel such as shirts, casual wear, and basic lifestyle clothing.
                        </li>
                        <li>
                            <strong>Other Products:</strong> Personal care items, utility
                            products, and small consumer goods approved for delivery.
                        </li>
                    </ul>
                    {/* Delivery Policy */}
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                        Delivery Policy &amp; Order Fulfillment
                    </h2>
                    <p className="mb-6 text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                        Ketalog acts as a facilitation platform between sellers, delivery
                        partners, and buyers. The responsibility for product quality, packaging,
                        and readiness rests with the seller, while delivery partners ensure
                        timely and safe transportation.
                    </p>
                    <ul className="list-disc list-inside mb-8 space-y-2 text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                        <li>Orders are collected only after seller confirmation</li>
                        <li>Delivery partners do not open or alter seller-packaged items</li>
                        <li>Ketalog does not inspect or store products at any stage</li>
                        <li>Multiple orders may be batched for optimized delivery routes</li>
                        <li>Delivery timelines are estimates and not guaranteed</li>
                    </ul>
                    {/* Partner Role */}
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                        Role of Delivery Partners
                    </h2>
                    <p className="mb-6 text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                        Delivery partners serve as independent service providers responsible for
                        last-mile delivery between the seller and the customer. They do not act
                        as agents or representatives of the seller with respect to product
                        ownership or quality.
                    </p>
                    <ul className="list-disc list-inside mb-8 space-y-2 text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                        <li>Pickup products only from verified sellers</li>
                        <li>Deliver orders within the assigned delivery window</li>
                        <li>Handle products carefully, especially perishables</li>
                        <li>Follow customer delivery instructions provided via the platform</li>
                        <li>Confirm successful delivery through the Ketalog system</li>
                    </ul>
                    {/* Safety */}
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                        Safety, Hygiene &amp; Compliance
                    </h2>
                    <p className="mb-6 text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                        Ketalog expects all delivery partners to follow safety, hygiene, and
                        legal guidelines while performing delivery services.
                    </p>
                    <ul className="list-disc list-inside mb-8 space-y-2 text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                        <li>Use of clean delivery bags and secure packaging</li>
                        <li>Contactless delivery where applicable</li>
                        <li>Compliance with traffic and transport laws</li>
                        <li>Professional conduct with customers and sellers</li>
                    </ul>
                    {/* Liability */}
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                        Liability &amp; Limitations
                    </h2>
                    <p className="mb-6 text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                        Ketalog's role is limited to facilitating order placement and delivery
                        coordination. Ketalog shall not be responsible for product defects,
                        seller delays, or issues arising from incorrect product information
                        provided by sellers.
                    </p>
                    {/* Final Note */}
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                        Updates to Delivery Policy
                    </h2>
                    <p className="mb-6 text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                        Ketalog reserves the right to update or modify this Delivery Partner and
                        Delivery Policy at any time based on business requirements, regulatory
                        changes, or operational needs. Continued participation in deliveries
                        constitutes acceptance of such updates.
                    </p>
                </div>
            </section>
        </>
    );
}
