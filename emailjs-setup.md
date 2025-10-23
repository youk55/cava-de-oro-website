# EmailJS Setup Instructions

This project uses EmailJS to send order confirmation emails to order@yoload.asia.

## Setup Steps:

1. **Create EmailJS Account**
   - Go to https://www.emailjs.com/
   - Sign up for a free account

2. **Create Email Service**
   - Add an email service (Gmail, Outlook, etc.)
   - Connect the email account you want to send FROM

3. **Create Email Template**
   - Create a new email template with these parameters:
   - Template variables to use:
     ```
     {{to_email}} - order@yoload.asia
     {{from_name}} - Customer name
     {{from_email}} - Customer email
     {{customer_phone}} - Customer phone
     {{customer_address}} - Full address
     {{order_notes}} - Order notes
     {{order_items}} - List of ordered items
     {{subtotal}} - Subtotal amount
     {{shipping}} - Shipping cost
     {{total_amount}} - Total amount
     {{payment_method}} - PayNow or PayPal
     {{order_date}} - Order date and time
     ```

4. **Email Template Example:**
   ```
   Subject: New Order from Cava de Oro Website

   Dear Team,

   A new order has been received:

   Customer Information:
   Name: {{from_name}}
   Email: {{from_email}}
   Phone: {{customer_phone}}
   Address: {{customer_address}}

   Order Details:
   {{order_items}}

   Pricing:
   Subtotal: {{subtotal}}
   Shipping: {{shipping}}
   Total: {{total_amount}}

   Payment Method: {{payment_method}}
   Order Date: {{order_date}}

   Notes: {{order_notes}}

   Please process this order promptly.

   Best regards,
   Cava de Oro Website
   ```

5. **Update Configuration**
   - Replace the following in `/src/app/page.tsx`:
     - `YOUR_PUBLIC_KEY` with your EmailJS public key
     - `YOUR_SERVICE_ID` with your email service ID
     - `YOUR_TEMPLATE_ID` with your template ID

6. **Test the Email System**
   - Place a test order to verify emails are sent correctly

## Important Notes:
- EmailJS free plan allows 200 emails per month
- Make sure to set up proper spam filtering for order@yoload.asia
- Consider upgrading to a paid plan for higher volume
