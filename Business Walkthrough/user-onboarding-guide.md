# Tradex ERP - User Onboarding Guide
### For Business Owners & Managers - Non-Technical Edition

> **Who is this guide for?**
> This guide is written for the **business owner (Rajesh Menon)** and team managers.
> It explains - in plain business language - how every type of user is added to Tradex,
> how their access is set up, and what they can do once they are inside the system.
> No technical knowledge is required to follow this guide.

---

## Contents

1. [How the Owner Account Is Created](#1-how-the-owner-account-is-created)
2. [Owner's First Login - What You See](#2-owners-first-login)
3. [How to Find the "Invite User" Option](#3-where-is-invite-user)
4. [Creating a User for Every Role](#4-creating-a-user-for-every-role)
5. [What the New User Does After Receiving the Invite](#5-new-user-onboarding-steps)
6. [How Permissions Are Assigned (Tagged)](#6-how-permissions-are-assigned)
7. [Managing Existing Users](#7-managing-existing-users)
8. [Quick Reference Tables](#8-quick-reference-tables)
9. [End-to-End Worked Examples](#9-end-to-end-worked-examples)

---

## 1. How the Owner Account Is Created

> **Confirmed:** The Owner account is **NOT created by invitation**. It is created automatically by the **BuildDock Team** as part of the system setup (deployment). You - the business owner - never need to "invite" yourself.

---

### 1.1 What Happens During System Setup (One-Time, Done by BuildDock Team)

When BuildDock Team sets up your store for the first time, a technical process called the **bootstrap** runs automatically. This is a behind-the-scenes setup script that:

| Step | What It Does |
|---|---|
| **1** | Sets up your company profile (business name, GSTIN, locations) |
| **2** | Creates all the standard roles (Owner, Finance, Branch Manager, etc.) |
| **3** | Creates your branches and warehouses in the system |
| **4** | Creates the **Owner account** for your business |
| **5** | Sends a **welcome invitation email** to the Owner's email address |

> [!IMPORTANT]
> The BuildDock Team needs the following from you before setup:
> - Owner's **full name**
> - Owner's **work email address**
> - Owner's **mobile number**
> - Your company's **GSTIN and registered address**
> - Branch/warehouse **names and addresses**
>
> These are collected during the onboarding meeting and entered by the BuildDock Team.
> **You do not fill any forms in the system yourself** - the team runs the setup script on your behalf.

---

### 1.2 What the Owner Receives After Setup

Once the BuildDock Team completes the setup, the Owner's email inbox receives:

```
From:    noreply@tradex.example
Subject: Welcome to Tradex - Set up your Owner access

Hi Rajesh,

Your Tradex ERP workspace has been set up for Tradex Electronics Pvt Ltd.
You are the Owner (Super admin) of this workspace.

Click below to activate your account:

  [ Activate my account & set up access ]

This link is valid for 48 hours and is personal to you.
```

Once the Owner clicks this and completes setup (see Section 2), the Owner's access
is fully active and the system is ready to use.

---

### 1.3 Can There Be More Than One Owner?

Yes. Once Rajesh (the first owner) is active, he can invite a second person with the
**Owner** role if needed (for example, a co-founder or a trusted deputy).
This is done through the normal "Invite user" flow described in Section 4.

> [!NOTE]
> Adding a second Owner requires approval from an existing Owner.
> The system never allows a single person to grant themselves the Owner role.

---

## 2. Owner's First Login

### 2.1 Step 1 - Click the Activation Link

Open the welcome email and click **"Activate my account & set up access"**.
The link opens the Tradex ERP workspace sign-in page.

---

### 2.2 Step 2 - Verify Your Mobile Number

```
+------------------------------------------+
|  Verify your identity                    |
|                                          |
|  We've sent a code to +91 98xxxxxxxx    |
|                                          |
|  Enter code  [      ]      [Verify]      |
|                                          |
|  Resend code                             |
+------------------------------------------+
```

Enter the 6-digit code from your mobile. This confirms you are the real person who was invited.

---

### 2.3 Step 3 - Accept the Terms & Set a Password

```
+------------------------------------------+
|  Welcome, Rajesh Menon                   |
|  Owner - Tradex Electronics Pvt Ltd      |
|                                          |
|  Create a password (optional)            |
|  [                              ]        |
|                                          |
|  [x] I agree to the Terms of Service    |
|  [x] I agree to the Privacy Policy      |
|                                          |
|                 [ Accept & Continue ]    |
+------------------------------------------+
```

A password is optional but recommended. You can also sign in with a one-time mobile
code every time.

---

### 2.4 Step 4 - Set Up Two-Step Verification (Mandatory for Owners)

Because the Owner has full access to everything, two-step verification is **required**.
You cannot skip this step.

```
+------------------------------------------------------+
|  Set up two-step verification                        |
|                                                      |
|  This protects your account from unauthorised access |
|                                                      |
|  (o) Authenticator app  <-- Recommended              |
|  ( ) Security key (FIDO2)                            |
|                                                      |
|  Steps:                                              |
|  1. Download Google Authenticator, Authy, or         |
|     Microsoft Authenticator on your phone            |
|  2. Scan the QR code shown on screen                 |
|  3. Enter the 6-digit code shown in the app          |
|     [      ]                         [ Verify ]      |
|                                                      |
|  Save your backup codes (shown once - keep safely):  |
|  72813-49021   38204-91023   56302-74018             |
|                                                      |
|                  [ I've saved my backup codes ]      |
+------------------------------------------------------+
```

> [!IMPORTANT]
> **Save your backup codes!** Print them or store them in a password manager.
> If you lose your phone and do not have backup codes, you will need the BuildDock Team
> to reset your access.

---

### 2.5 Step 5 - You're In! The Owner Dashboard

After MFA setup, you land on the **Control Centre** - the Owner's main dashboard.

```
+----------------------------------------------------------------+
|  Good morning, Rajesh                                          |
|  Saturday, 28 September 2026 - All locations - FY 2026-27     |
|                                                                |
|  Rs.1.84 Cr    1,284 Orders    Rs.14,330 Avg    98.7% Stock   |
|                                                                |
|  [!] Needs attention (6 items)    [v] Approvals waiting (5)   |
+----------------------------------------------------------------+
```

The **sidebar on the left** is your main menu. From here you can navigate to every
part of the system.

---

## 3. Where Is "Invite User"?

> **The "Invite User" button is NOT on the dashboard page.**
> It lives in a separate section called **Settings & Access**.

### 3.1 Navigation Path

Follow these exact steps from any screen:

```
Left sidebar  -->  scroll to bottom  -->  Administration  -->  Settings & access
```

The sidebar sections (scroll down past Finance & Insight):

```
  OVERVIEW
    Control centre

  SELL & SERVE
    Orders
    Pick - pack - dispatch
    Returns & warranty
    Support inbox

  CATALOG
    Products
    Pricing & tiers

  STOCK
    Inventory & serials
    Purchasing & receiving

  PARTNERS
    Customers & dealers
    Vendors

  FINANCE & INSIGHT
    Payments & settlements
    Reports

  ADMINISTRATION          <-- Scroll here
    Settings & access     <-- Click this
```

---

### 3.2 The Settings & Access Page

Once you click **Settings & access**, you land on a page with several tabs:

```
+------------------------------------------------------------------------------+
|  Settings & access                                                           |
|  Tradex Electronics Pvt Ltd - GSTIN 29AAKCT4821M1Z6                         |
|                              [ Start access review ]  [ + Invite user ] <-- |
+-------------+-------------+--------------+--------------+-------------------+
|  Users (18) | Roles &     | Thresholds   | Delegation   | Audit log         |
|             | permissions |              |              |                   |
+-------------+-------------+--------------+--------------+-------------------+
```

The **"+ Invite user"** button is in the **top-right corner** of this page (blue button).

> [!NOTE]
> If you do not see **Administration** in the sidebar, scroll the left navigation
> all the way to the **bottom** - it appears below Finance & Insight.

---

## 4. Creating a User for Every Role

### 4.0 The Invite Form - All Fields Explained

When you click **"+ Invite user"**, this form appears:

```
+----------------------------------------------------------------------+
|  Invite a staff user                                            [X]  |
|  Individual account - no shared logins - link expires in 48 hours    |
|                                                                      |
|  Full name *                                                         |
|  [                                         ]                         |
|                                                                      |
|  Work email *                                                        |
|  [                                         ]                         |
|                                                                      |
|  Mobile number (for OTP sign-in fallback)                            |
|  [+91] [                                   ]                         |
|                                                                      |
|  Role *                                                              |
|  [ Select a role                           v ]                       |
|    +-- Sales associate                                               |
|    +-- Warehouse                                                     |
|    +-- Catalog specialist                                            |
|    +-- Branch manager                                                |
|    +-- Operations admin  [!] Privileged                              |
|    +-- Finance           [!] Privileged                              |
|    +-- Owner             [!] Privileged                              |
|                                                                      |
|  Location(s) this person works at                                    |
|  [ ] WH-BLR -- Bangalore Warehouse                                   |
|  [ ] BR-SPR -- SP Road Branch                                        |
|  [ ] BR-KRM -- Koramangala Branch                                    |
|  [ ] BR-MYS -- Mysuru Branch                                         |
|                                                                      |
|  Access expiry  (leave blank for permanent access)                   |
|  [ DD / MM / YYYY ]   e.g. for seasonal or temporary staff           |
|                                                                      |
|  Two-step verification method                                        |
|  [ Authenticator app (recommended)         v ]                       |
|                                                                      |
|                          [ Cancel ]  [ Send invite ]                 |
+----------------------------------------------------------------------+
```

| Field | What to enter | Tips |
|---|---|---|
| **Full name** | Person's full name | e.g. "Pooja Hegde" |
| **Work email** | Their company/work email | This is where the invite goes |
| **Mobile** | Their mobile (for OTP) | Important if they lose their password |
| **Role** | Their job function in the system | See Sections 4.1 to 4.8 |
| **Location(s)** | Which branch/warehouse they work at | Staff roles need a location |
| **Access expiry** | Only if temporary | Leave blank for permanent staff |
| **MFA method** | Authenticator app is recommended | SMS OTP is weaker |

---

### 4.1 Inviting a Sales Associate / Support Executive

**Who:** Counter staff, sales team, support team at a branch.

**Example:** Pooja Hegde joins the Koramangala branch (BR-KRM) as a Sales Associate.

| Field | Value |
|---|---|
| Full name | Pooja Hegde |
| Work email | pooja.hegde@tradexelectronics.in |
| Mobile | +91 98765 43210 |
| **Role** | **Sales associate** |
| **Location(s)** | [x] BR-KRM -- Koramangala Branch only |
| Access expiry | *(leave blank - she is permanent)* |
| MFA method | Authenticator app |

Click **"Send invite"**.

**What Pooja can do after joining:**
- View and manage orders at Koramangala only
- Help customers with assisted orders
- Handle support requests and returns
- Cannot see supplier costs or profit margins
- Cannot manage other branches
- Cannot invite other users

---

### 4.2 Inviting a Warehouse Staff Member

**Who:** Pickers, packers, goods receivers, stock counters at the warehouse.

**Example:** Kiran D. joins the Bangalore Warehouse (WH-BLR) as a Warehouse associate.

| Field | Value |
|---|---|
| Full name | Kiran D. |
| Work email | kiran.d@tradexelectronics.in |
| Mobile | +91 97654 32109 |
| **Role** | **Warehouse** |
| **Location(s)** | [x] WH-BLR -- Bangalore Warehouse only |
| Access expiry | *(leave blank)* |
| MFA method | Authenticator app |

Click **"Send invite"**.

**What Kiran can do:**
- Pick, pack, and dispatch orders
- Receive stock from suppliers
- Transfer stock between locations
- Perform stock counts
- Cannot see order prices or customer contact details
- Cannot create purchase orders

---

### 4.3 Inviting Seasonal / Temporary Staff

**Who:** Packers or sales staff hired only for a season (e.g. Diwali sales).

**Example:** Arjun N. is a temporary packer at the warehouse for October only.

| Field | Value |
|---|---|
| Full name | Arjun N. |
| Work email | arjun.n@tradexelectronics.in |
| Mobile | +91 96543 21098 |
| **Role** | **Warehouse** |
| **Location(s)** | [x] WH-BLR |
| **Access expiry** | **31 October 2026** -- This is the key field |
| MFA method | Authenticator app |

Click **"Send invite"**.

> [!IMPORTANT]
> On **1 November 2026**, Arjun's access will automatically stop working.
> You do not need to manually deactivate him.
> His account is deactivated but his history is kept forever for audit purposes.

His status in the Users list will show: **Temporary** - *"Expires 31 Oct"*

---

### 4.4 Inviting a Catalog Specialist

**Who:** The person who manages product listings, descriptions, images, and categories.

**Example:** Sneha Pillai joins as Catalog specialist managing Laptops and Monitors.

| Field | Value |
|---|---|
| Full name | Sneha Pillai |
| Work email | sneha.p@tradexelectronics.in |
| Mobile | +91 95432 10987 |
| **Role** | **Catalog specialist** |
| **Location(s)** | *(none required - catalog work is not branch-specific)* |
| Access expiry | *(blank)* |
| MFA method | Authenticator app |

Click **"Send invite"**.

**Additional step - Assigning Categories:**
After Sneha accepts her invite and logs in, go to **Products**, find the category
(e.g. Laptops), and assign Sneha as the reviewer for that category.

**What Sneha can do:**
- Create and edit product listings in her assigned categories
- Upload product images
- Import product data from supplier files
- Cannot publish a product live without a Designated Reviewer step
- Cannot see prices or costs

---

### 4.5 Inviting a Branch Manager

**Who:** The person in charge of a branch - manages staff, stock, orders, and customers.

**Example:** Anita R. is the new Branch Manager at the SP Road branch (BR-SPR).

| Field | Value |
|---|---|
| Full name | Anita R. |
| Work email | anita.r@tradexelectronics.in |
| Mobile | +91 94321 09876 |
| **Role** | **Branch manager** |
| **Location(s)** | [x] BR-SPR -- SP Road Branch |
| Access expiry | *(blank)* |
| MFA method | Authenticator app |

Click **"Send invite"**.

**What Anita can do:**
- See and manage all orders at SP Road
- Manage stock levels at SP Road
- Give discounts within approved limits
- Approve dealer applications
- Invite her own team members *(only if Owner delegates this - see Section 6.4)*
- Cannot see other branches' data
- Cannot change system-wide prices
- Cannot approve her own discount requests *(system rule)*

---

### 4.6 Inviting an Operations Admin

> **[!] Privileged Role - Requires a second approver before the invite is sent.**

**Who:** A senior staff member who manages operations across all locations.

**Example:** Vikram Shetty is promoted to Operations Admin.

| Field | Value |
|---|---|
| Full name | Vikram Shetty |
| Work email | vikram.s@tradexelectronics.in |
| Mobile | +91 93210 98765 |
| **Role** | **Operations admin [!] Privileged** |
| **Location(s)** | *(All locations - company-wide)* |
| Access expiry | *(blank)* |
| MFA method | Security key or Authenticator app |

Click **"Send invite"**.

**What happens next - different from other roles:**

```
You click "Send invite"
      |
      v
System DOES NOT send the email immediately
      |
      v
A SECOND APPROVER must confirm this invitation
(Another Owner or a designated approver)
      |
      v
Only after the second person approves:
Email invite is sent to Vikram (48-hour window)
      |
      v
Vikram MUST set up two-step verification
BEFORE his account becomes active
```

> [!WARNING]
> If you are the **only Owner** and there is no second approver available,
> contact the BuildDock Team to assist with the approval.
> The system will never auto-approve a privileged invitation.

---

### 4.7 Inviting a Finance Person

> **[!] Privileged Role - Same second-approver process as Section 4.6.**

**Who:** The person who handles payments, refunds, reconciliation, and financial reporting.

**Example:** Deepa K. is joining as Finance.

| Field | Value |
|---|---|
| Full name | Deepa K. |
| Work email | deepa.k@tradexelectronics.in |
| Mobile | +91 92109 87654 |
| **Role** | **Finance [!] Privileged** |
| **Location(s)** | *(All locations - finance sees company-wide)* |
| Access expiry | *(blank)* |
| MFA method | Authenticator app |

Click **"Send invite"** --> Second approver required --> invite sent after approval.

**What Deepa can do:**
- Process refunds and payments
- Reconcile bank settlements
- Export financial data to accounting software
- See supplier costs and profit margins
- Approve price changes that need finance review
- Cannot invite or manage other staff users
- Cannot change role permissions

---

### 4.8 Inviting a Vendor User

> **This is done from the Vendors section, NOT from Settings & Access.**

**Who:** A supplier's own team member who needs access to the Vendor Portal.

**Navigate to:**
```
Left sidebar --> Vendors --> [Find the vendor] --> Users tab --> Invite vendor user
```

**What a Vendor user can do:**
- Update stock availability
- Submit new products for approval
- Respond to purchase orders
- See their own statements
- Cannot see Tradex's internal costs or other vendors' data
- Cannot access the ERP workspace

---

## 5. What the New User Does After Receiving the Invite

> This section is written from the **new user's point of view**.
> Share this with your new team members so they know what to do.

---

### 5.1 Step 1 - Check Your Email

Look for an email with subject:
**"You've been invited to join Tradex Electronics - [Your Role]"**

> [!WARNING]
> This link expires in **48 hours**. If you do not click it in time,
> ask your manager to resend it. Do not share this link with anyone - it is personal to you.

---

### 5.2 Step 2 - Click "Accept Invitation & Set Up Access"

The button in the email opens the Tradex ERP sign-in page.

---

### 5.3 Step 3 - Verify Your Mobile Number

```
+------------------------------------------+
|  Verify your identity                    |
|                                          |
|  We sent a 6-digit code to              |
|  +91 98xxx xxxxx                         |
|                                          |
|  Enter code  [      ]     [ Verify ]     |
|                                          |
|  Did not receive it? Resend             |
+------------------------------------------+
```

Enter the OTP that arrives on your mobile. This must be the same mobile number
your manager entered when inviting you.

---

### 5.4 Step 4 - Review Your Role and Accept

```
+----------------------------------------------+
|  Welcome to Tradex Electronics               |
|                                              |
|  You are joining as:                         |
|  Sales associate - Koramangala Branch        |
|                                              |
|  Set a password (optional):                  |
|  [                            ]              |
|                                              |
|  [x] I agree to Terms of Service            |
|  [x] I agree to Privacy Policy              |
|                                              |
|                  [ Accept & Continue ]       |
+----------------------------------------------+
```

Check your role and branch are correct. If something looks wrong,
**do not proceed** - contact your manager before accepting.

---

### 5.5 Step 5 - Set Up Two-Step Verification

You **must** complete this step before you can use the system.

**What you need:** A smartphone with the **Google Authenticator**, **Authy**,
or **Microsoft Authenticator** app installed.

**Steps:**
1. Open your authenticator app
2. Tap **"+"** or **"Add account"**
3. Choose **"Scan a QR code"**
4. Point your phone camera at the QR code shown on screen
5. The app will show a 6-digit number - enter it into the box on screen
6. Click **Verify**

```
+------------------------------------------------+
|  Set up two-step verification                  |
|                                                |
|  1. Open your authenticator app               |
|  2. Scan this QR code:                        |
|     +--------+                                |
|     |  [QR]  |   Or enter key: ABCD EFGH...   |
|     +--------+                                |
|  3. Enter the 6-digit code from the app:      |
|     [      ]                    [ Verify ]    |
|                                               |
|  Your backup codes (save these!):             |
|  52813-19028  |  83920-47381  |  29183-74920  |
|                                               |
|              [ I've saved my backup codes ]   |
+------------------------------------------------+
```

> [!IMPORTANT]
> **Save your backup codes** - write them down or store in a safe place.
> If you lose your phone, these are the only way to sign in without calling your manager.

---

### 5.6 Step 6 - You're In!

After setting up two-step verification, you land on your personalised workspace.

| Your role | What you land on |
|---|---|
| Sales associate | Orders queue - filtered to your branch |
| Warehouse | Pick / pack / dispatch queue |
| Catalog specialist | Products - catalog management |
| Branch manager | Branch dashboard with your branch data |
| Finance | Payments & reconciliation screen |
| Operations admin | Full workspace - all locations |
| Owner | Control Centre - full dashboard |

---

### 5.7 How to Sign In Every Day After That

```
Go to: https://erp.tradexelectronics.in

+------------------------------------------+
|  Tradex ERP Workspace - Sign in          |
|                                          |
|  Work email                              |
|  [ pooja@tradexelectronics.in ]          |
|                                          |
|  Password                                |
|  [ ........          ]                   |
|                                          |
|  Or: [ Sign in with a one-time code ]   |
|                                          |
|                        [ Sign in ]       |
+------------------------------------------+
          |
          v
+------------------------------------------+
|  Enter your authenticator code           |
|  Open your app and enter the 6-digit code|
|  [ 4 3 1 8 2 9 ]             [ Verify ]  |
|                                          |
|  Use a backup code instead              |
+------------------------------------------+
```

> **Sign-in safety:** After 3 wrong password attempts, the system pauses for 15 minutes.
> After 5 wrong attempts, the account is locked and you must contact your manager.

---

## 6. How Permissions Are Assigned (Tagged)

### 6.1 Permissions Are Set by Role - Not by Person

The system does not let you customise permissions for individual people. Instead,
**each role comes with a pre-defined set of permissions**. When you assign a role
to a person, they automatically get all the permissions that come with that role.

Think of it like job descriptions: a "Warehouse" role always comes with "pick and pack"
access. A "Finance" role always comes with "payments" access.

---

### 6.2 The Roles & Permissions Screen

On the **Settings & access** page, click the **"Roles & permissions"** tab:

```
+------------------------------------------------------------------------------+
|  Roles & permissions                                                         |
|  Enforced on the server for every operation - not just hidden in the UI     |
+----------------------------------+---------+--------+---------+--------------+
|  What can they do?               |  Staff  | Manager| Finance | Owner/Admin  |
+----------------------------------+---------+--------+---------+--------------+
|  View orders                     |  Own loc|  Yes   |  Yes    |  All locs    |
|  Create & manage orders          |  Limited|  Yes   |  Read   |  Yes         |
|  Give discounts                  |  Limited|  Limit |  No     |  Yes         |
|  Process refunds                 |  Request|  Limit |  Yes    |  Yes         |
|  View supplier costs             |  No     |  No    |  Yes    |  Yes         |
|  Publish products live           |  No     |  If reviewer|  Tax|  Yes        |
|  Manage staff users              |  No     |  If delegated| No |  Yes        |
|  View financial reports          |  No     |  Branch|  Yes    |  Yes         |
|  Change approval thresholds      |  No     |  No    |  Limited|  Yes         |
+----------------------------------+---------+--------+---------+--------------+
```

> [!NOTE]
> You **cannot edit** this table - it is the system's built-in policy.
> If you need a custom role, contact the BuildDock Team to create a new role
> draft (Owner approval required).

---

### 6.3 Giving Someone Extra Capabilities - Designations

Some tasks require a **designation** - a special qualifier added on top of a
person's role. Designations give an extra capability without changing the person's role.

**How to add a designation:**
```
Settings & access --> Users --> Find the person --> Edit --> Designations
```

| Designation | Who should get it | What it unlocks |
|---|---|---|
| **Designated Reviewer** | A branch manager or ops admin who approves product listings | Ability to publish products live for their assigned categories |
| **Buyer** | An ops admin or branch manager who handles purchasing | Can create and manage purchase orders |
| **Warehouse Lead** | A senior warehouse staff member | Can assign pick waves and approve stock decisions |
| **Returns Desk Lead** | A sales or warehouse person managing returns | Wider authority over return decisions |

**Example:** You want Anita R. (Branch Manager, SP Road) to publish laptop listings.

```
Users tab --> Anita R. --> Edit
--> Designations --> Add "Designated Reviewer"
--> Category scope: Laptops
--> Save
```

After this, Anita can publish laptop listings - only for SP Road branch and
only in the Laptops category.

---

### 6.4 Giving a Branch Manager the Right to Invite Their Own Team

By default, branch managers **cannot** invite users. Only the Owner and Operations
Admin can invite staff. To give a branch manager this ability, set up a **Delegation**:

```
Settings & access --> Delegation tab --> + New delegation
```

**Delegation form:**

```
+----------------------------------------------------------+
|  Delegate authority                                      |
|                                                          |
|  Delegate to:    [ Anita R. -- Branch manager ]         |
|  Valid from:     [ 01 Oct 2026 ]                        |
|  Valid until:    [ 31 Oct 2026 ]  (max 14 days)         |
|                                                          |
|  What she can do on your behalf:                        |
|  [x] Invite staff at her own branch                     |
|  [x] Approve discounts up to Rs.5,000                  |
|  [ ] Process refunds                                    |
|  [ ] Approve purchase orders                            |
|  [ ] Approve write-offs                                 |
|                                                          |
|  Reason / Note:                                          |
|  [ Anita covering for Vikram during his leave ]         |
|                                                          |
|                   [ Cancel ]  [ Set delegation ]        |
+----------------------------------------------------------+
```

> [!WARNING]
> A delegation is **time-limited** (maximum 14 days). It ends automatically on the
> "Valid until" date. The Owner is always notified of every action taken by the delegate.

---

### 6.5 Location Scope - Controlling Which Branch a Person Sees

The **"Location(s)"** checkboxes when inviting a user control which branches they
can see data for.

| Scenario | Location setting |
|---|---|
| Staff at one branch only | Check that one branch only (e.g. BR-KRM) |
| Staff who covers multiple branches | Check all branches they cover |
| Warehouse staff | Check their warehouse (e.g. WH-BLR) |
| Finance / Owner / Ops admin | No location restriction - they see all |

> A staff member assigned to BR-KRM can only see Koramangala orders, stock, and
> customers. If they try to look up an order from SP Road, the system shows
> "Not found" - even if the order exists. This is by design.

---

## 7. Managing Existing Users

### 7.1 Viewing All Users

```
Settings & access --> Users tab
```

The Users tab shows all staff with their name, role, branch, status, MFA status,
and last sign-in date.

---

### 7.2 Editing a User's Role or Location

```
Users tab --> Find the person --> Edit (pencil icon)
```

You can change their role, location scope, access expiry date, and designations.

> For **privileged role changes** (adding Finance or Ops Admin role), a second
> approver must confirm before the change takes effect.

After saving, the change takes effect on their **very next** action in the system.

---

### 7.3 Deactivating a User (Someone Leaving)

```
Users tab --> Find the person --> Actions --> Deactivate
```

**What happens immediately:**
- They are signed out of all devices
- Their next sign-in attempt will fail
- Their account history is kept forever (for audit)
- All their past actions remain visible in reports

> [!IMPORTANT]
> **Accounts are never permanently deleted.** Deactivation is the only way to remove
> someone's access. Their history must be kept for compliance purposes.

---

### 7.4 Reactivating a Deactivated User (Returning Employee)

```
Users tab --> Show deactivated accounts --> Find the person --> Actions --> Reactivate
```

> [!NOTE]
> Reactivation requires **Owner approval**. An Operations Admin cannot reactivate
> accounts on their own.

After reactivation, the person receives a new sign-in link and must set up MFA again.

---

### 7.5 Resending an Expired Invite

```
Users tab --> Find the person ("Invited - link expired") --> Actions --> Resend invite
```

A fresh 48-hour link is sent. The old link stops working immediately.

---

### 7.6 Resetting Someone's Two-Step Verification

**When to use:** A staff member has lost their phone and cannot sign in.

```
Users tab --> Find the person --> Reset MFA
```

Their current MFA is cleared. They receive an email link to set up MFA again.

---

## 8. Quick Reference Tables

### 8.1 Who Can Invite Whom?

| Who is inviting | Can invite |
|---|---|
| **Owner** | Everyone - all roles, all locations |
| **Operations Admin** | All non-privileged roles; privileged roles need a second approver |
| **Branch Manager** | Only their own branch's staff - ONLY IF the Owner has set up a delegation |
| **Finance / Warehouse / Catalog / Sales** | Cannot invite anyone |

---

### 8.2 Role Capabilities at a Glance

| Role | Sees | Can do | Cannot do |
|---|---|---|---|
| **Owner** | Everything, all locations | Everything | Nothing blocked |
| **Operations Admin** | All locations, all ops data | Full operations management | Sensitive finance without Finance approval |
| **Finance** | All locations, financial data | Payments, refunds, reconciliation | Manage staff, publish products |
| **Branch Manager** | Assigned branch only | Orders, stock, customers, discounts within limit | Other branches, system-wide settings |
| **Warehouse** | Assigned warehouse only | Pick, pack, receive, count | Prices, customer data, purchasing |
| **Catalog Specialist** | Products (assigned categories) | Create listings, import products | Publish listings (unless reviewer), prices |
| **Sales Associate** | Assigned branch, orders | Assisted orders, returns, support | Costs, other branches, admin |

---

### 8.3 Common Mistakes to Avoid

| Mistake | What to do instead |
|---|---|
| Assigning "All locations" to a branch-only role | Only check the specific branch(es) they work at |
| Sharing one login between two people | Each person must have their own individual account |
| Using a personal email for a work account | Use work email addresses (company domain) |
| Deactivating instead of editing a role change | Use Edit for role changes; only deactivate when someone leaves |
| Forgetting to set an access expiry for seasonal staff | Always set "Access expiry" when inviting temporary staff |
| Creating the same person twice | Always search the Users list first before inviting |

---

## 9. End-to-End Worked Examples

### 9.1 Example A - New Sales Associate Joins

**Situation:** Priya S. is joining the Koramangala branch as a Sales Associate on 5 October.

```
Day 1 (4 Oct - before she joins):
  Settings & access --> + Invite user
  Fill: Priya S. | priya.s@tradex.in | +91 98xxx | Sales associate | [x] BR-KRM
  Click: Send invite

Day 1 (4 Oct - Priya receives email):
  Priya clicks the link --> verifies OTP --> accepts terms --> sets up authenticator app
  --> Priya is now Active

Day 2 (5 Oct - Priya's first day):
  Priya signs in --> enters password + authenticator code
  --> lands on Orders (BR-KRM)

Owner checks (5 Oct evening):
  Settings & access --> Users tab
  Priya S. -- Active -- Last sign-in: 5 Oct 09:15
  MFA: Authenticator [ok]
  Location: BR-KRM [ok]
```

**Time taken:** Under 5 minutes to send the invite. Priya is fully set up within the hour.

---

### 9.2 Example B - Finance Person Replaces Someone Who Left

**Situation:** The previous finance person Meera has left. Deepa K. is taking over.

```
Step 1 - Deactivate Meera:
  Users tab --> Meera --> Actions --> Deactivate
  Meera signed out immediately

Step 2 - Invite Deepa:
  Settings & access --> + Invite user
  Fill: Deepa K. | deepa.k@tradex.in | +91 97xxx | Finance [!] Privileged | All locations
  Click: Send invite

  System: "This is a privileged role. A second approver must confirm."

Step 3 - Second approver confirms:
  Rajesh asks Anita R. to approve in the Approvals queue
  Anita opens Approvals --> Reviews --> Approves

Step 4 - Deepa receives invite:
  (Only sent AFTER Step 3 approval)
  Deepa clicks link --> verifies OTP --> accepts --> sets up authenticator app --> Active

Owner checks:
  Users tab --> Deepa K. -- Active -- Privileged [lock] -- MFA [ok]
  Audit log: "Privileged role approved by Anita R."
```

> Until Step 3 is complete, Deepa has no access. The invite email is not sent
> until the second approver confirms.

---

### 9.3 Example C - Diwali Season Temporary Packer

**Situation:** Ravi M. is joining for the Diwali season, working 1-30 October only.

```
Sending the invite (30 Sep):
  Settings & access --> + Invite user
  Fill: Ravi M. | ravi.m@tradex.in | +91 96xxx | Warehouse | [x] WH-BLR
  Access expiry: 30 October 2026  <-- SET THIS
  Click: Send invite

Ravi accepts and sets up access (1 Oct):
  Standard 5-step flow --> Active with "Temporary" badge - Expires 30 Oct

Ravi's workspace shows a notice:
  "[!] Your access expires on 30 October 2026 - contact your manager for an extension"

What happens on 31 October at midnight (automatic):
  Ravi's access stops automatically
  He is signed out of all devices
  Any sign-in attempt: "Access expired"
  No action required from Owner - the system handles it automatically

If Ravi needs an extension:
  Users tab --> Ravi M. --> Edit --> Change access expiry to 15 November --> Save
```

---

### 9.4 Example D - Branch Manager Invites Own Team Member

**Situation:** Anita R. (Branch Manager, SP Road) needs to add a new sales associate.
The Owner has set up a delegation before travelling.

**Owner sets up delegation first:**
```
Settings & access --> Delegation tab --> + New delegation
Delegate to: Anita R.
Valid: 1-14 Oct 2026
Authority: [x] Invite staff at her own branch
Reason: Rajesh travelling - Anita covering
--> Set delegation
```

**Anita's actions (from her own login):**
```
Settings & access --> + Invite user  (button now visible for Anita)
Fill: Sanjay K. | sanjay.k@tradex.in | +91 95xxx | Sales associate | [x] BR-SPR
Click: Send invite
```

**What Anita CANNOT do even with the delegation:**
- Cannot invite for BR-KRM or WH-BLR (only her own branch)
- Cannot assign Finance or Ops Admin roles
- Cannot set herself or Sanjay as an Owner

The audit log records: *"User invited by delegated Branch manager (Anita R.) - Delegation DEL-0010"*
The Owner receives a notification that Anita has used the delegation.

---

## Appendix - Glossary of Terms

| Term | Plain English meaning |
|---|---|
| **Role** | The job function in the system (e.g. Warehouse, Finance). Controls what you can see and do. |
| **Location scope** | Which branch or warehouse a person can access data for. |
| **MFA / Two-step verification** | An extra security step after your password - a 6-digit code from your phone app. |
| **Privileged role** | A high-trust role (Owner, Finance, Ops Admin) that requires a second person to approve the assignment. |
| **Designation** | An extra capability added to someone's role without changing the role itself (e.g. "Designated Reviewer"). |
| **Delegation** | A time-limited transfer of some Owner authority to a named person. |
| **Deactivate** | Removing someone's access (they remain in the system for history but cannot log in). |
| **Audit log** | An automatic record of every important action - who did what, when, and why. Cannot be edited. |
| **Bootstrap** | The one-time technical setup run by BuildDock Team that creates the Owner account and company settings. |
| **Access expiry** | An automatic end date for someone's access - used for seasonal or temporary staff. |
| **Second approver** | A second authorised person who must confirm a privileged action before it takes effect. |

---

*This guide covers Tradex ERP - Version 1.4.2*
*Based on erp-admin.html mockup and plan/07-auth-roles-permissions.md*
*Last updated: 30 September 2026*
