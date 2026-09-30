# Tradex ERP - Settings & Access Module
### Business Walkthrough | BuildDock Team

---

## 1. What This Module Does
The Settings & Access module is where the Owner manages:
- All users (invite, edit, deactivate, reactivate)
- Roles & permissions (view the permission matrix)
- Approval thresholds (who can approve what)
- Delegation (time-limited authority transfers)
- Locations (branches and warehouses)
- System integrations (courier, payment gateway)
- Audit log (full history of all system actions)

**This is the Admin centre of the entire ERP system.**

## 2. Navigation
```
Left sidebar --> ADMINISTRATION --> Settings & access
```

## 3. Page Header

```
+----------------------------------------------------------+
|  Settings & access                                       |
|  Tradex Electronics Pvt Ltd - GSTIN 29AAKCT4821M1Z6    |
|                                                          |
|                     [Start access review]  [+ Invite user]|
+----------------------------------------------------------+
```

**[Start access review]:** Initiates a periodic review of all user permissions.
The system lists every user and asks you to confirm or revoke their access.
Recommended quarterly.

**[+ Invite user]:** Opens the invite form (fully documented in the User Onboarding Guide).

## 4. Tab 1 - Users

```
+--------------------------------------------------+
|  Users (18 active, 3 deactivated)               |
|  [Active] [Invited] [Deactivated]               |
|                                                  |
|  Rajesh Menon                                   |
|  Owner - All locations - Since: 15 Jan 2025     |
|  MFA: Authenticator [ok] - Last: Today 10:42   |
|                                                  |
|  Anita Rao                                      |
|  Branch Manager - BR-SPR - Since: 1 Mar 2025   |
|  MFA: Authenticator [ok] - Last: Today 09:15   |
|  Delegation: Active (Rs.25k limit)              |
|  [Edit] [Deactivate] [Reset MFA]               |
|                                                  |
|  Invited (not yet accepted):                    |
|  Sanjay K. - Sales - BR-SPR - Invited: 26 Sep  |
|  Link expires: 28 Sep 14:00                    |
|  [Resend invite]                               |
+--------------------------------------------------+
```

For full user management details, see the **User Onboarding Guide** in this folder.

## 5. Tab 2 - Roles & Permissions

```
+--------------------------------------------------+
|  Permission matrix                              |
|                                                  |
|  What can they do? | Staff | Manager | Finance | Owner|
|  View orders       | Own loc| Yes    | Yes     | All  |
|  Create orders     | Limited| Yes    | Read    | Yes  |
|  Give discounts    | Limited| Limit  | No      | Yes  |
|  Process refunds   | Request| Limit  | Yes     | Yes  |
|  View costs        | No     | No     | Yes     | Yes  |
|  Publish products  | No     |Reviewer| Tax     | Yes  |
|  Manage users      | No     |If deleg| No      | Yes  |
|  Financial reports | No     | Branch | Yes     | Yes  |
+--------------------------------------------------+
```

This table cannot be edited by the Owner directly. Custom role changes
require the BuildDock Team to implement (Owner approval required).

### Separation of Duties Rules

The system enforces these rules automatically:

| Rule | What it prevents |
|---|---|
| Cannot approve your own discount | Staff cannot self-approve exceptions |
| Cannot be Maker and Checker | Same person cannot create and approve a payment |
| Cannot invite yourself to Owner role | Owner promotion requires existing Owner approval |
| Cannot approve your own PO | Buyer cannot approve a PO they created |

## 6. Tab 3 - Approval Thresholds

```
+--------------------------------------------------+
|  Approval thresholds                            |
|                                                  |
|  Discounts:                                     |
|  Sales Associate: up to 3%                     |
|  Branch Manager: up to 8%                      |
|  Ops Admin: up to 12%                          |
|  Owner: any discount                           |
|  Below margin floor: always needs Owner        |
|                                                  |
|  Stock write-offs:                             |
|  Branch Manager: up to Rs.5,000                |
|  Ops Admin: up to Rs.50,000                    |
|  Owner: above Rs.50,000                        |
|                                                  |
|  Purchase orders:                              |
|  Buyer: up to Rs.25,000                        |
|  Ops Admin: up to Rs.2,00,000                  |
|  Owner: above Rs.2,00,000                      |
|                                                  |
|  [Edit thresholds]  (Owner + second approver)  |
+--------------------------------------------------+
```

> [!IMPORTANT]
> Changing thresholds requires a second approver (Separation of Duties).
> The Owner cannot change thresholds unilaterally.

## 7. Tab 4 - Delegation

```
+--------------------------------------------------+
|  Delegation                [+ New delegation]    |
|                                                  |
|  Active delegations:                            |
|  DEL-0010 - Anita Rao                          |
|  Authority: Invite staff at BR-SPR             |
|             Approve discounts up to Rs.25k     |
|  Valid: 1 Oct - 14 Oct (14 days max)           |
|  Created by: Rajesh Menon (Owner)              |
|  [Edit] [Revoke]                               |
|                                                  |
|  Emergency access:                             |
|  [Grant emergency access to Vikram S.]         |
|  (Time-bounded, post-review mandatory)         |
+--------------------------------------------------+
```

Delegation details: see the **User Onboarding Guide** Section 6.4.

## 8. Tab 5 - Locations

```
+--------------------------------------------------+
|  Locations (5)              [+ Add location]     |
|                                                  |
|  WH-BLR - Central Warehouse                    |
|  Bangalore - Bengaluru 560025                  |
|  Type: Warehouse - Active                      |
|  Staff: 8 - Courier: Delhivery + Bluedart     |
|                                                  |
|  BR-SPR - SP Road Branch                       |
|  SP Road, Bangalore 560002                     |
|  Type: Retail Branch - Active                  |
|  Staff: 6                                      |
|  [Edit] [Deactivate]                           |
+--------------------------------------------------+
```

## 9. Tab 6 - Integrations

```
+--------------------------------------------------+
|  Integrations                                   |
|                                                  |
|  Payment gateway: Razorpay [ACTIVE]            |
|  Last webhook: 10:42 - Signed [ok]             |
|  [Test connection] [View logs]                  |
|                                                  |
|  Courier: Delhivery [ACTIVE]                   |
|  Booking: [ok]   Tracking: [DEGRADED]          |
|  [View job logs] [Retry connection]            |
|                                                  |
|  Courier: Bluedart [ACTIVE]                    |
|  Booking: [ok]   Tracking: [ok]               |
|                                                  |
|  WhatsApp Business API [ACTIVE]                |
|  Templates approved: 14                        |
+--------------------------------------------------+
```

## 10. Tab 7 - Audit Log

```
+--------------------------------------------------+
|  Audit log (cannot be edited)                   |
|  Every important action - who, what, when       |
|                                                  |
|  26 Sep 10:42 - Rajesh M. (Owner)              |
|  Approved discount override TXO-10491 (14%)    |
|  Reason: School tender - long term relationship |
|                                                  |
|  26 Sep 09:40 - Anita R. (Branch Mgr - DEL)   |
|  Approved transfer TR-0212 (delegated auth)    |
|                                                  |
|  26 Sep 09:15 - System                         |
|  Released 14 expired reservations (A01)        |
|                                                  |
|  [Export audit log] [Filter by user/action]    |
+--------------------------------------------------+
```

The audit log is **permanent and uneditable**. Every action - by humans
and by automation - is recorded with the actor, action, reason, and timestamp.

## 11. How Other Roles See Settings & Access

| Feature | Owner | Ops Admin | Finance | Branch Mgr | Others |
|---|---|---|---|---|---|
| Invite users | Yes | Yes | No | If delegated | No |
| View permission matrix | Yes | Yes | No | View only | No |
| Edit approval thresholds | Yes (2nd approver) | No | No | No | No |
| Set up delegations | Yes | No | No | No | No |
| View audit log | Yes | Yes | Finance scope | Own branch | No |
| Manage integrations | Yes | Yes | No | No | No |
| Manage locations | Yes | Yes | No | No | No |
| Perform access review | Yes | Yes | No | No | No |

---
*Based on erp-admin.html | BuildDock Team - 30 September 2026*
