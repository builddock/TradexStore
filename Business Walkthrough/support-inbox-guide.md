# Tradex ERP - Support Inbox Module
### Business Walkthrough - Step by Step
### Non-Technical Edition by BuildDock Team

---

## Contents
1. [What This Module Does](#1-what-this-module-does)
2. [How to Navigate Here](#2-navigate)
3. [Tab 1 - Inbox (Active Conversations)](#3-tab-1---inbox)
4. [Tab 2 - Tickets](#4-tab-2---tickets)
5. [Tab 3 - Knowledge Library](#5-tab-3---knowledge-library)
6. [How Other Roles See Support](#6-other-roles)

---

## 1. What This Module Does

The **Support Inbox** is the central communication hub for all customer
conversations coming in from WhatsApp, email, and web chat.
All channels arrive in one shared inbox - no switching between apps.

**Key features:**
- WhatsApp, email, and web chat messages in one queue
- Convert a chat into an order with one click
- Create and track support tickets for complex issues
- Approved answer library (FAQ) for consistent replies
- Bot-to-human handoff when the bot cannot resolve an issue

---

## 2. How to Navigate Here

```
Left sidebar --> SELL & SERVE --> Support inbox
```

The red badge shows unread/unassigned conversations needing attention.

---

## 3. Tab 1 - Inbox (Active Conversations)

```
+-----------------------------+  +------------------------------------+
|  Inbox (32)    [Filters v]  |  |  CONVERSATION: Deepa Kumar        |
|  [All] [Mine] [Unassigned]  |  |  WhatsApp - +91 9876543210        |
|                             |  |  Open since: 26 Sep 09:45         |
|  [WA] Deepa Kumar      NEW  |  |                                   |
|  +91 9876543210 - 09:45     |  |  Customer: Hi, I want to return   |
|  "I want to return my..."   |  |  my headphones. They are defect.. |
|                             |  |                                   |
|  [WA] Ramesh Shetty         |  |  [Bot]: I can help with returns.  |
|  +91 9765432109 - 09:30     |  |  What is your order number?       |
|  "Order status query"       |  |                                   |
|  Assigned: Karthik R.       |  |  Customer: TXO-10421              |
|                             |  |                                   |
|  [Email] Priya Nair         |  |  [Bot]: Found order TXO-10421.    |
|  09:15 - "Wrong product"    |  |  Return window open (4 days left) |
|  Ticket: TKT-0234 linked    |  |  Sending to agent...              |
|                             |  |                                   |
|                             |  |  [Karthik R.]: Hi Deepa, I can   |
|                             |  |  raise a return for you. Can you  |
|                             |  |  describe the defect?             |
|                             |  |                                   |
|  [+ New conversation]       |  |  Customer: Audio cuts out...      |
+-----------------------------+  +------------------------------------+
                                 |  [Type reply...]      [Templates v] |
                                 |  [Raise return] [Create order]      |
                                 |  [Create ticket] [Assign to...]     |
                                 +------------------------------------+
```

### Inbox Filter Tabs

| Tab | What it shows |
|---|---|
| **All** | Every open conversation regardless of who it is assigned to |
| **Mine** | Only conversations assigned to you personally |
| **Unassigned** | Conversations not yet assigned to any staff member |

### Conversation Action Buttons

| Button | What it does |
|---|---|
| **[Type reply...]** | Send a message back to the customer (WhatsApp / Email) |
| **[Templates]** | Select a pre-approved WhatsApp template message |
| **[Raise return]** | Creates a return request (RMA) directly from this conversation |
| **[Create order]** | Creates an assisted order - adds products to a cart and sends a payment link |
| **[Create ticket]** | Escalates to a formal support ticket for complex issues |
| **[Assign to...]** | Reassigns the conversation to another staff member |

### WhatsApp Templates

WhatsApp business rules require pre-approved templates for outbound messages.
The system only allows sending approved templates. Staff cannot send free-form
messages until the customer replies first (24-hour window rule).

Common templates:
- **order_confirmed v3** - Order confirmation
- **order_dispatched v2** - Dispatch notification with tracking link
- **return_approved v1** - Return request approved
- **order_review v1** - Order under review notification
- **payment_link v4** - Send payment link for assisted order

### Bot to Human Handoff

When a customer starts a WhatsApp conversation, the bot handles it first:
- Answers common queries (order status, return policy, product availability)
- Asks for the order number to pull up the right information
- If it cannot resolve, it passes the conversation to a human agent

The conversation appears in the "Unassigned" queue with full bot context included.
The agent can see the entire bot conversation before replying.

---

## 4. Tab 2 - Tickets

Tickets are formal support records for complex issues that need tracking
across multiple days or multiple team members.

```
+--------------------------------------------------+
|  Tickets (active: 14)    [+ New ticket]          |
|  [All] [Open] [Awaiting customer] [Resolved]     |
|                                                  |
|  TKT-0234 - Wrong product received               |
|  Priya Nair - Email - Opened: 24 Sep             |
|  Order: TXO-10398 - LG Monitor                   |
|  Status: OPEN - Awaiting return inspection       |
|  Owner: Karthik R.   Priority: HIGH              |
|  SLA: Resolve by 28 Sep                         |
|  [View ticket] [Update status]                   |
|                                                  |
|  TKT-0231 - Product not turning on              |
|  Arjun S. - WhatsApp - Opened: 22 Sep           |
|  Order: TXO-10389 - Dell Laptop                  |
|  Status: WAITING FOR CUSTOMER                   |
|  [Reminder sent: 25 Sep]                         |
+--------------------------------------------------+
```

### Ticket Fields

| Field | What it means |
|---|---|
| **Ticket ID** | Unique reference (TKT-XXXX) shared with the customer |
| **Channel** | How the customer contacted (WhatsApp / Email / Web chat) |
| **Order reference** | Linked order so staff can see purchase history |
| **Status** | OPEN / AWAITING CUSTOMER / IN PROGRESS / RESOLVED |
| **Owner** | The staff member responsible for resolving this ticket |
| **Priority** | LOW / MEDIUM / HIGH / URGENT |
| **SLA** | Target resolution date |

---

## 5. Tab 3 - Knowledge Library

The **Knowledge Library** contains approved answers and FAQ content used by:
- Human agents (to give consistent, accurate answers)
- The WhatsApp bot (to answer common questions automatically)

```
+--------------------------------------------------+
|  Knowledge library (approved answers)            |
|  [Search library...]                             |
|                                                  |
|  Return policy - New products (7 days)           |
|  Last updated: 15 Sep 2026 - v3                 |
|  Used by: Bot + Agents                          |
|  [View] [Suggest edit]                           |
|                                                  |
|  Return policy - Refurbished (3 days)            |
|  Warranty claim process - step by step           |
|  How to track my order                           |
|  Payment failed - what to do                    |
|  Dealer account application process             |
|                                                  |
|  [+ Propose new answer]                          |
+--------------------------------------------------+
```

> [!NOTE]
> Only APPROVED answers are shown to customers or used by the bot.
> Any staff member can propose a new answer or an edit, but it goes through
> an approval process before going live. This prevents incorrect information
> from being sent to customers.

---

## 6. How Other Roles See Support

| Feature | Owner | Ops Admin | Branch Mgr | Support Staff | Warehouse | Finance |
|---|---|---|---|---|---|---|
| View all conversations | Yes | Yes | Own branch | Own branch | No | No |
| Reply to customers | Yes | Yes | Yes | Yes | No | No |
| Create returns from chat | Yes | Yes | Yes | Yes | No | No |
| Create assisted orders from chat | Yes | Yes | Yes | Yes | No | No |
| Manage knowledge library | Yes | Yes | No | Propose only | No | No |
| Escalate to ticket | Yes | Yes | Yes | Yes | No | No |
| View tickets | Yes | Yes | Own branch | Own tickets | No | No |

---

*This guide covers Tradex ERP Support Inbox Module - Version 1.4.2*
*Based on erp-support.html mockup*
*Produced by BuildDock Team - Last updated: 30 September 2026*
