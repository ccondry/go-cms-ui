# go-cms-ui Change Log

Version numbers are semver-compatible dates in YYYY.MM.DD-X format,
where X is the revision number


# 2023.6.14-2

### Fixes
* **Login:** Fix login errors appearing after successful login and when
refreshing the page after logging in.


# 2023.6.14-1

### Fixes
* **Login:** Fix multiple login issues.


# 2023.6.14

### Features
* **Build:** Replace webpack build tools with rollup, update SSO provider.
* **Login:** Update SSO login provider.


# 2021.2.19

### Features
* **User:** Update user to match LDAP sAMAccountName


# 2020.11.2

### Bug Fixes
* **Fonts:** Fix importing the Cisco fonts from momentum-ui. Cisco fonts are now
used instead of falling back to Helvetica Neue


# 2020.10.26-1

### Features
* **Footer:** Add version and copyright information footer
* **Style:** Increase the box shadow and add a border to the main content panels
to improve the visuals a bit

### Bug Fixes
* **Token Expiration:** Fix refresh loop when JWT has expired


# 2020.10.26

### Features
* **Passcode:** Removed passcode input and display
* **Admin:** Replace "Enabled" column of users table with "Last Login"

### Bug Fixes
* **Token Expiration:** Replace SSO token when it has expired


# 2020.10.24-1

### Features
* **Admin:** Show user space info in user table details. Add CCO email column to
users table.


# 2020.10.24

### Features
* **Create Account:** Press enter to submit the form
* **Logout:** Remove the logout button


# 2020.10.23-3

### Features
* **Create Account:** Remove passcode input


# 2020.10.23-2

### Features
* **Account Expiration:** Improve the success message for extending the expiration
of user accounts


# 2020.10.23-1

### Features
* **Demo Information:** Create demo information display for user
* **Reset Password:** Add reset password button for users and admins


# 2020.10.23

### Features
* **Created:** Created site and changelog
