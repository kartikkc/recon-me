<!-- <img aling="center" src="https://imgur.com/AO4B9WL.png" /> -->
<img align="center" src="./Logo/Recon-me-poster.png"/>

# R3C0N-M3: Authentication API 
Your Gateway to Secure Access

**Website : https://recon-me.vercel.app**

**Docs : https://recon-me-doc.vercel.app**


## Features
- Signup Using Email and generation of JWT token.
- Login
- Getting User details using JWT token.
- Verifing User using OTP on corresponding email.
- Authentication using Google.

## Endpoints

### Sign-up

### Sending the User Details 

```js
POST https://recon-me.vercel.app/createuser/
```

#### Body :

| Parameter  | Type     | Description                                |
| :--------- | :------- | :------------------------------------------|
| `email`    | `string` | **Required** Email Address                 |
| `name`     | `string` | **Required** Name                          |
| `password` | `string` | **Required** Password                      |

#### Usage

javascript:

```javascript
const createNewUser = await fetch(`https://recon-me.vercel.app/createuser/`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({name:credentials.name ,email: credentials.email, password: credentials.password})
});
const json = await createNewUser.json();
console.log(json);
```

#### Response

```javascript
{
  "status": "Success! User Created! Please Continue to Verify your Account",
  "authToken": "esJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjUxZDZkNDc4N2RhMDcwMDA4MDM4YWQ4In0sImlhdCI6MTY5NjQyNzMzNX0.NMzkynrn7fmZuO1HBkOtBsaWIyzM0dq_MaB0Lft5WPA"
}
```

### Verfiying User


```js
POST https://recon-me.vercel.app/createuser/verify/
```

#### Body:


| Parameter  | Type     | Description                                |
| :--------- | :------- | :------------------------------------------|
| `otp`    | `Integer` | **Required** Email Address                  |

*setting the auth-token as a header to the request.

#### Usage

javascript:

```javascript
const verfiyNewUser = await fetch(`https://recon-me.vercel.app/createuser/verify`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({otp: otp.number});
});
const json = await verifyNewUser.json();
console.log(json);
```

#### Response

```js
{
  "status": {
    "status": "User Verified"
  }
}
```

### Log-In

#### Using Email

```js
POST https://recon-me.vercel.app/login
```

#### Body :

| Parameter  | Type     | Description                                |
| :--------- | :------- | :------------------------------------------|
| `email`    | `string` | **Required** Email Address                 |
| `password` | `string` | **Required** Password                      |

#### Usage

javascript:

```javascript
const userLogin = await fetch(`https://recon-me.vercel.app/login`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({email: credentials.email, password: credentials.password})
});
const json = await userLogin.json();
console.log(json);
```

#### Response

If the user is not verified : 

```javascript
{
  "Verify": "Please verify your account to activate it."
}
```

After verifying using OTP:

```javascript
{
  "authToken": "exJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjUxZDZkNDc4N2RhMDcwMDA4MDM4YWQ4In0sImlhdCI6MTY5NjQyNzMzNX0.NMzkynrn7fmZuO1HBkOtBsaWIyzM0dq_MaB0Lft5WPA"
}
```

### Authentication with Google


```js
GET https://recon-me.vercel.app/googleLogin/auth/google
```

#### Usage

javascript:

```javascript
<a href='https://recon-me.vercel.app/googleLogin/auth/google' target='_blank'>Continue with Google</Link>
```

#### Response

```js
{	
    "status":	"not verified"
    "otp":	"3043"
}
```

#### Verifying account created using google login

```js
POST https://recon-me.vercel.app/verifyOtp
```

#### Body :

| Parameter  | Type     | Description                                |
| :--------- | :------- | :------------------------------------------|
| `otp`      | `Integer`| **Required** Password                      |

*setting the googleId as a header to the request


#### Usage

javascript:

```js
const googleUserVerify = await fetch(`https://recon-me.vercel.app/verifyOtp`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({otp: otp.otp})
});
const json = await googleUserVerify.json();
console.log(json);
```

#### Response

```js
{
  "status": {
    "status": "User Verified"
  },
  "auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1MWQ4Mjg5NGI2NTU2MDAwODU0ZDE3ZCIsImlhdCI6MTY5NjQzMjc5MH0.bhNc0fuzPYhqw2nCm8C6SE1s31q5AWsiUmLTf7HBtco"
}
```

## Support
For any issue or query. Contact me at : r3c0nm3.303@gmail.com

Contribute to this API <a href="https://github.com/kartikkc/recon-me">here</a>

## Contact me
<a href = "https://www.github.com/kartikkc/" target="_blank"><img src="https://img.icons8.com/fluent/48/000000/github.png"/></a><a href = "https://www.linkedin.com/in/kartikkc397/" target="_blank"><img src="https://img.icons8.com/fluent/48/000000/linkedin.png"/></a><a href = "mailto:kartikkc95@gmail.com" target="_blank"><img src="https://img.icons8.com/fluent/48/000000/gmail.png"/></a>
