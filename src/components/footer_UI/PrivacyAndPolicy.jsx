import { useEffect } from "react";

export default function PrivacyAndPolicy() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <>
            <section className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 md:p-12 transition-colors duration-300">
                    {/* Header */}
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold mb-6 text-gray-900 dark:text-white">
                        Privacy Policy
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Last Updated: Jan 2026</p>

                    {/* Intro */}
                    <div className="text-gray-700 dark:text-gray-300 space-y-6">
                        <p>
                            We, <strong>Ketalog</strong> (hereinafter referred to as “Ketalog”,
                            “we”, “us”, or “our”), are committed to safeguarding the privacy,
                            confidentiality, and security of the personal information shared by
                            users of the Ketalog platform. Protecting user data is a core part of
                            our responsibility as a technology-driven e-commerce marketplace, and we
                            take this obligation seriously.
                        </p>
                        <p>
                            This Privacy Policy explains in detail how Ketalog collects, processes,
                            stores, uses, shares, and protects information relating to individuals
                            who access or use the Ketalog website, mobile application, and any
                            related services (collectively referred to as the “Platform”). By using
                            the Platform, you acknowledge that you have read, understood, and agreed
                            to the practices described in this Privacy Policy, in addition to the
                            Terms and Conditions governing the use of Ketalog.
                        </p>
                        <p>
                            We may update this Privacy Policy periodically to reflect changes in
                            legal requirements, business operations, technology, or user
                            expectations. Users are encouraged to review this page regularly. For
                            any questions or concerns related to privacy/support, please contact us
                            at{" "}
                            <a
                                href="mailto:support@ketalog.in"
                                className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
                            >
                                support@ketalog.in
                            </a>
                            .
                        </p>

                        {/* Applicability */}
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
                            Applicability and Scope
                        </h2>
                        <p>
                            This Privacy Policy applies to all individuals who interact with Ketalog
                            in any capacity, including but not limited to buyers, sellers, delivery
                            partners, registered users, and visitors who browse the Platform without
                            creating an account. It governs the collection and processing of
                            information through the Ketalog website, mobile applications, user
                            registration processes, order placement and fulfillment, customer
                            support interactions, and promotional communications.
                        </p>
                        <p>
                            This Privacy Policy applies only to information collected directly by
                            Ketalog through its Platform and services. It does not apply to
                            third-party websites, payment gateways, logistics providers, or external
                            platforms that may be accessed through links on Ketalog. Such third
                            parties operate independently and are governed by their own privacy
                            policies.
                        </p>

                        {/* Permissible Age */}
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
                            Permissible Age
                        </h2>
                        <p>
                            The Ketalog Platform is intended for individuals who are 18 years of age
                            or older or who are legally competent to enter into a binding contract
                            under applicable laws. Ketalog does not knowingly collect personal
                            information from minors. If we become aware that personal data of a
                            minor has been collected without appropriate consent, we will take
                            reasonable steps to delete such information.
                        </p>

                        {/* Types of Information */}
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
                            Types of Information We Collect
                        </h2>
                        <p className="mb-4">
                            Ketalog collects information to enable seamless transactions between
                            buyers, sellers, and delivery partners. The information collected may be
                            categorized as Personal Information and Non-Personal Information.
                        </p>
                        <ul className="list-disc pl-6 mb-10 space-y-3">
                            <li>
                                <strong className="text-gray-900 dark:text-white">Personal Information:</strong> Information that can identify
                                an individual directly or indirectly, such as name, mobile number, and
                                address.
                            </li>
                            <li>
                                <strong className="text-gray-900 dark:text-white">Non-Personal Information:</strong> Aggregated or anonymized
                                data such as usage statistics, analytics, and technical data that does
                                not identify an individual.
                            </li>
                        </ul>

                        {/* Info Provided */}
                        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                            1. Information You Provide to Us
                        </h2>
                        <p className="mb-4">
                            When you register, place orders, or otherwise interact with the Ketalog
                            Platform, you may voluntarily provide information including:
                        </p>
                        <ul className="list-disc pl-6 mb-10 space-y-3">
                            <li>Identity details such as name, mobile number, and email address</li>
                            <li>
                                Account information including OTP-based login and profile preferences
                            </li>
                            <li>
                                Delivery details such as residential or business address and
                                instructions
                            </li>
                            <li>
                                Order information including items purchased and transaction references
                            </li>
                            <li>
                                Seller information such as business name, shop address, GST details,
                                and bank information
                            </li>
                            <li>
                                Delivery partner details including identification, vehicle
                                information, and availability
                            </li>
                            <li>Customer support communications, feedback, reviews, and ratings</li>
                        </ul>

                        {/* Auto Collected */}
                        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                            2. Information Collected Automatically
                        </h2>
                        <p className="mb-4">
                            When you access or use the Platform, Ketalog may automatically collect
                            certain technical and usage data, including:
                        </p>
                        <ul className="list-disc pl-6 mb-10 space-y-3">
                            <li>
                                Device information such as device type, operating system, and browser
                            </li>
                            <li>Log data including IP address, access times, and error reports</li>
                            <li>Usage data such as pages viewed, searches, and interactions</li>
                            <li>Approximate or real-time location data (subject to permission)</li>
                            <li>Cookies and similar technologies to enhance user experience</li>
                        </ul>

                        {/* Third Party */}
                        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                            3. Information from Third Parties
                        </h2>
                        <p>
                            Ketalog may receive limited information from third parties such as
                            payment gateways, logistics partners, or compliance service providers
                            strictly for operational, security, or legal purposes. Such information
                            is processed in accordance with this Privacy Policy and applicable laws.
                        </p>

                        {/* Usage */}
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
                            How We Use the Information
                        </h2>
                        <p className="mb-6">
                            Ketalog uses the information collected from users to operate and manage
                            the Platform as a technology-enabled e-commerce marketplace and to
                            provide safe, efficient, and reliable services to buyers, sellers, and
                            delivery partners.
                        </p>
                        <ul className="list-disc pl-6 space-y-4 mb-6">
                            <li>
                                To create, authenticate, and manage user accounts, including login
                                through mobile number and OTP verification.
                            </li>
                            <li>
                                To process and fulfill orders, coordinate with sellers for product
                                availability, and assign delivery partners for order pickup and
                                delivery.
                            </li>
                            <li>
                                To communicate with users regarding order confirmations, delivery
                                updates, payments, refunds, customer support, and other
                                service-related notifications.
                            </li>
                            <li>
                                To provide customer support, handle complaints, resolve disputes, and
                                improve service quality based on user feedback and interactions.
                            </li>
                            <li>
                                To improve and optimize the Platform by analyzing usage patterns,
                                browsing behavior, and transaction trends, and to enhance user
                                experience and platform performance.
                            </li>
                            <li>
                                To detect, prevent, and investigate fraudulent activities,
                                unauthorized access, misuse of the Platform, or violations of
                                applicable laws and platform policies.
                            </li>
                            <li>
                                To comply with applicable legal, regulatory, tax, and accounting
                                requirements and respond to lawful requests from authorities.
                            </li>
                            <li>
                                To send promotional communications, offers, and updates where
                                permitted by law, which users may opt out of at any time.
                            </li>
                        </ul>
                        <p>
                            Ketalog may also use anonymized or aggregated information for research,
                            analytics, and business insights. Such information does not identify
                            individual users and is used solely to improve the Platform and related
                            services.
                        </p>

                        {/* Sharing */}
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
                            How We Share Information
                        </h2>
                        <p className="mb-6">
                            Ketalog does not sell, rent, or trade users’ personal information to
                            third parties. We share information only on a limited and need-to-know
                            basis to enable the functioning of the Platform and to provide services
                            requested by users. This includes sharing relevant order and delivery
                            information with sellers and shopkeepers to prepare and fulfill orders,
                            and with independent delivery partners to enable pickup and delivery of
                            products to the user’s specified address. Information may also be shared
                            with trusted third-party service providers such as payment gateways,
                            technology vendors, analytics providers, and customer support service
                            providers solely for the purpose of operating and improving the
                            Platform.
                        </p>
                        <p>
                            Ketalog may also disclose user information where required to comply with
                            applicable laws, regulations, court orders, or lawful requests from
                            government or regulatory authorities. In addition, information may be
                            shared to protect the rights, property, or safety of Ketalog, its users,
                            delivery partners, sellers, or the public, including for the purposes of
                            fraud prevention, dispute resolution, and enforcement of our Terms and
                            Conditions and other platform policies. All third parties with whom
                            information is shared are required to maintain appropriate data
                            protection and confidentiality standards consistent with this Privacy
                            Policy.
                        </p>

                        {/* Retention */}
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
                            Data Retention
                        </h2>
                        <p className="mb-6">
                            We retain personal information only for as long as it is necessary to
                            support our e-commerce operations, provide services to users, fulfill
                            orders, manage returns and refunds, maintain transaction records, and
                            comply with applicable legal, regulatory, and tax requirements.
                            Information such as account details, order history, delivery addresses,
                            payment-related references (excluding sensitive financial data),
                            communications, and customer support records may be stored for a
                            reasonable period to ensure service continuity, prevent fraud, resolve
                            disputes, and improve platform performance.
                        </p>
                        <p>
                            Upon account deletion or deactivation, we take commercially reasonable
                            steps to delete or anonymize personal data that is no longer required
                            for legitimate business purposes. However, certain information may be
                            retained for longer durations where retention is mandated by law,
                            required for auditing, taxation, regulatory compliance, enforcement of
                            agreements, or protection of legal rights. Data related to third-party
                            sellers, delivery partners, and service providers may also be retained
                            in accordance with contractual obligations and applicable laws governing
                            e-commerce, logistics, and digital marketplaces.
                        </p>

                        {/* Third Party Links */}
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
                            Third-Party Links
                        </h2>
                        <p className="mb-6">
                            The Platform may include links to third-party websites, applications, or
                            services that are not owned or controlled by Ketalog. These links may be
                            provided for user convenience, such as access to payment gateways,
                            logistics partners, promotional offers, seller websites, or external
                            service providers commonly used in e-commerce operations.
                        </p>
                        <p className="mb-6">
                            While we make reasonable efforts to associate with reputable third-party
                            service providers, Ketalog does not control and is not responsible for
                            the content, policies, security practices, or data handling activities
                            of such external platforms. Users are encouraged to review the privacy
                            policies and terms of use of any third-party websites before sharing
                            personal or financial information.
                        </p>
                        <ul className="list-disc pl-6 mb-6">
                            <li>
                                Third-party links may redirect users outside the Ketalog platform.
                            </li>
                            <li>
                                Ketalog does not guarantee the security, accuracy, or reliability of
                                third-party websites or services.
                            </li>
                            <li>
                                Any transactions or interactions with third parties are undertaken at
                                the user’s own risk.
                            </li>
                            <li>
                                Ketalog shall not be liable for any loss, damage, or misuse of data
                                arising from third-party platforms.
                            </li>
                            <li>
                                Users are advised to exercise caution and use secure browsing
                                practices when accessing external links.
                            </li>
                        </ul>

                        {/* Contact */}
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
                            Contact Us
                        </h2>
                        <p>
                            For any questions or concerns regarding privacy or data protection,
                            please contact us at{" "}
                            <a
                                href="mailto:support@ketalog.in"
                                className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
                            >
                                support@ketalog.in
                            </a>
                            . You may also reach out through our{" "}
                            <a
                                href="/contact-us"
                                className="text-blue-600 dark:text-blue-400 font-semibold underline hover:text-blue-700 dark:hover:text-blue-300"
                            >
                                Contact Us
                            </a>
                            {" "}page for further assistance.
                        </p>
                    </div>
                </div>
            </section>
        </>
    );
}
