import { site, money } from "../site.config"
import { plans } from "./plans"
import type { LegalContent } from "../types"

// Templates to be reviewed by legal counsel before going live. The French version prevails.
const b = site.brand
const c = site.company

export const legal: LegalContent = {
  eyebrow: "Legal",
  contactTitle: "Contact",
  cgv: {
    title: "Terms of service",
    updated: "Last updated: September 2026. In case of discrepancy, the French version prevails.",
    intro: `These terms govern the subscription to the ${b} service, published by ${c.legalName} (“the Publisher”), and its use by the professional customer (“the Customer”).`,
    sections: [
      { h: "1. Purpose", p: [`${b} is an online software (SaaS) for print shops and graphic workshops: orders, quotes, production, delivery, collection, customers, online store and print sync agent (${site.agentName}). The service is accessible through a workspace dedicated to the Customer at “subdomain.${site.appDomain}”.`] },
      { h: "2. Workspace creation and trial period", p: [`The Customer creates their workspace from the ${site.domain} website. They benefit from a ${site.trialDays}-day free trial, without commitment or payment method. At the end of the trial, without a plan subscription, the workspace is suspended; data is kept for 30 days then deleted.`] },
      { h: "3. Plans and prices", p: [`Current plans are: ${plans.map((p) => `${p.name} (${money(p.monthly, "en")} excl. VAT per month, or ${money(p.yearlyMonthly, "en")} excl. VAT per month on a yearly commitment)`).join("; ")}. Prices are excl. VAT; the VAT in force in Morocco applies. Each plan has usage limits (users, monthly orders, storage, points of sale) described on the Pricing page. The Publisher may change prices with 30 days' notice; the change applies at the next renewal.`] },
      { h: "4. Payment", p: ["Payment is made by bank transfer, monthly or yearly in advance, upon invoice. The plan is activated on receipt of payment. In case of payment more than 15 days late, access to the workspace may be suspended until settled, without data deletion for 30 days."] },
      { h: "5. Term, plan changes and cancellation", p: ["The monthly subscription renews tacitly each month and can be cancelled at any time, free of charge, effective at the end of the current month. The yearly subscription runs until its end date. Upgrading is immediate with pro-rata billing; downgrading takes effect at the next renewal subject to the new plan's limits."] },
      { h: "6. Publisher's obligations", ul: ["Provide a service available 24/7, excluding planned maintenance announced at least 24 h in advance and force majeure, with a monthly availability target of 99.5%.", "Host the Customer's data in a dedicated database and storage space, and perform backups at the plan's frequency.", "Provide support according to the subscribed plan, during the hours shown on the website.", "Not access the Customer's data except at their request for support, or for strictly necessary technical operations."] },
      { h: "7. Customer's obligations", ul: ["Provide accurate information at signup and keep it up to date.", "Keep their credentials and those of their users and service accounts confidential; any action performed from their workspace is deemed performed by them.", "Use the service in accordance with the law, in particular regarding their own customers' personal data, and not upload unlawful content.", "Hold the rights to the files uploaded for printing."] },
      { h: "8. Data and reversibility", p: ["The Customer remains the owner of their data. They may export it at any time (CSV from the application; full export on request). On cancellation, data is kept 30 days to allow export, then permanently deleted, backups included within an additional 30 days."] },
      { h: "9. Liability", p: ["The service is provided as is, under a best-efforts obligation. The Publisher is not liable for indirect losses (loss of revenue, customers, or data resulting from non-compliant use). In any event, the Publisher's liability is limited to the amounts paid by the Customer over the last twelve months. Integrations with third-party carriers (Ameex, Olivraison, Ozone Express…) depend on their respective services; the Publisher is not responsible for their unavailability nor for the amounts they actually collect."] },
      { h: "10. Intellectual property", p: ["The software, its documentation, trademarks and content remain the exclusive property of the Publisher. The Customer has a non-exclusive, non-transferable right of use for the duration of the subscription."] },
      { h: "11. Service evolutions", p: ["The Publisher continuously evolves the service. Updates are deployed without Customer intervention. Substantial features removed are subject to 60 days' notice."] },
      { h: "12. Governing law", p: [`These terms are governed by Moroccan law. Failing amicable resolution, any dispute is brought before the competent courts of ${c.city}.`] },
    ],
  },
  privacy: {
    title: "Privacy policy",
    updated: "Last updated: September 2026.",
    intro: `${c.legalName} processes personal data in the context of the ${site.domain} website and the ${b} service, in accordance with Moroccan law 09-08 on the protection of individuals with regard to the processing of personal data.`,
    sections: [
      { h: "1. Data collected on the website", p: ["Contact and signup forms: name, company, e-mail, phone, city, workshop size, message, chosen plan, subdomain. Technical data: IP address, browser, pages visited (anonymised audience measurement). We do not use advertising cookies."] },
      { h: "2. Purposes", ul: ["Answer your demo and contact requests.", "Create and administer your workspace, send you your access and invoices.", "Inform you about service evolutions (you can unsubscribe at any time).", "Ensure service security and prevent abuse."] },
      { h: "3. Your own customers' data", p: [`The data you enter in your workspace (your customers, orders, files) is processed on your behalf: you are the data controller, ${c.legalName} is the processor. It is stored in a database and storage space dedicated to your workspace, encrypted at rest, and never used for any purpose other than providing the service.`] },
      { h: "4. Hosting and security", p: ["The service is hosted on a professional cloud infrastructure with HTTPS access only. Passwords are hashed. Print agent access relies on revocable tokens. Backups are encrypted."] },
      { h: "5. Retention", p: ["Contact requests: 24 months. Account data: for the duration of the subscription then 30 days after cancellation (60 days for backups). Billing data: legal duration."] },
      { h: "6. Recipients", p: ["Our sales and support teams, and our technical providers (hosting, transactional e-mail) strictly for the needs of the service. The carriers you connect only receive the information needed to deliver the orders you entrust to them."] },
      { h: "7. Your rights", p: [`You have a right of access, rectification, objection and deletion of your data. Write to us at ${site.contact.email}. This processing is subject to the required formalities with the CNDP.`] },
    ],
  },
  notice: {
    title: "Legal notice",
    updated: "",
    intro: "",
    sections: [
      { h: "Website publisher", p: [`${c.legalName} — ${c.address}. ICE: ${c.ice}. RC: ${c.rc}. E-mail: ${site.contact.email}. Phone: ${site.contact.phone}.`] },
      { h: "Publication director", p: [`The legal representative of ${c.legalName}.`] },
      { h: "Hosting", p: ["Website and service hosted on a professional cloud infrastructure (Amazon Web Services). Customer data is stored in dedicated databases and storage spaces."] },
      { h: "Intellectual property", p: ["All content on this website (texts, illustrations, trademarks, software) is protected. Any reproduction without authorisation is prohibited. Carrier trademarks mentioned (Ameex, Olivraison, Ozone Express) belong to their respective owners."] },
    ],
  },
}
